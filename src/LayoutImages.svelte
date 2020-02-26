<div id="layout-images">
  <div class="title">
    <slot />
  </div>
  <div id="layout-container">
    {#if showRemove}
      <div class="remove" transition:fade>
        <button class="btn" on:click="{deleteSelectedImage}">
          <span class="gradient-text">Delete Selected</span>
        </button>
      </div>
    {/if}
    <div class="container-measure">
      <ImportImages on:image="{importImage}">
      <p slot="info">
        <span class="link" on:click="{addDefaultImages}">Click Here</span>
        for some boring placeholders.
      </p>
        <div id="layout-canvas-container">
          <canvas id="layout" bind:this="{canvasElement}">
          </canvas>
        </div>
      </ImportImages>
    </div>
  </div>
</div>

<script>
import { onMount, createEventDispatcher } from 'svelte';
import { fabric } from 'fabric';
import { viewport } from './state/viewport.js'
import { fade, slide } from 'svelte/transition'
import ImportImages from './ImportImages.svelte'

const dispatch = createEventDispatcher()

const grid = 25
const maxImageWidth = 200
const defaultImages = [
  { src: 'assets/placeholder-1.png', top: 0, left: 0 },
  { src: 'assets/placeholder-2.png', top: 300, left: 0 },
  { src: 'assets/placeholder-3.png', top: 300, left: 300 },
  { src: 'assets/placeholder-4.png', top: 0, left: 300 },
]
let canvasWidth = 1920
let canvasHeight = 1080
// Actual DOM Canvas
let canvasElement
// Fabric altered Canvas
let canvas = null
let showGrid = true
let showRemove = false

onMount(() => {
  // canvasElement.width = canvasWidth
  // canvasElement.height = canvasHeight

  canvas = new fabric.Canvas('layout', {
    selection: false
  })
  setCanvasSize(canvasWidth, canvasHeight)
  addGrid()

  // Active objects show delete button
  canvas.on('object:selected', options => {
    showRemove = true
  })

  canvas.on('selection:cleared', options => {
    showRemove = false
  })

  // snap to grid
  canvas.on('object:moving', options => {
    options.target.set({
      left: Math.round(options.target.left / grid) * grid,
      top: Math.round(options.target.top / grid) * grid
    })
    dispatch('render', getImages())
  })

  canvas.on('object:scaling', options => {
    let target = options.target
    let  w = target.width * target.scaleX
    let h = target.height * target.scaleY
    let snap = {
      // Closest snapping points
      top: Math.round(target.top / grid) * grid,
      left: Math.round(target.left / grid) * grid,
      bottom: Math.round((target.top + h) / grid) * grid,
      right: Math.round((target.left + w) / grid) * grid
    }
    let threshold = grid
    let dist = {
      // Distance from snapping points
      top: Math.abs(snap.top - target.top),
      left: Math.abs(snap.left - target.left),
      bottom: Math.abs(snap.bottom - target.top - h),
      right: Math.abs(snap.right - target.left - w)
    }
    let attrs = {
      scaleX: target.scaleX,
      scaleY: target.scaleY,
      top: target.top,
      left: target.left
    }
    switch (target.__corner) {
      case 'tl':
        if (dist.left < dist.top && dist.left < threshold) {
          attrs.scaleX = (w - (snap.left - target.left)) / target.width
          attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY
          attrs.top = target.top + (h - target.height * attrs.scaleY)
          attrs.left = snap.left
        } else if (dist.top < threshold) {
          attrs.scaleY = (h - (snap.top - target.top)) / target.height
          attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX
          attrs.left = attrs.left + (w - target.width * attrs.scaleX)
          attrs.top = snap.top
        }
        break
      case 'mt':
        if (dist.top < threshold) {
          attrs.scaleY = (h - (snap.top - target.top)) / target.height
          attrs.top = snap.top
        }
        break
      case 'tr':
        if (dist.right < dist.top && dist.right < threshold) {
          attrs.scaleX = (snap.right - target.left) / target.width
          attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY
          attrs.top = target.top + (h - target.height * attrs.scaleY)
        } else if (dist.top < threshold) {
          attrs.scaleY = (h - (snap.top - target.top)) / target.height
          attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX
          attrs.top = snap.top
        }
        break
      case 'ml':
        if (dist.left < threshold) {
          attrs.scaleX = (w - (snap.left - target.left)) / target.width
          attrs.left = snap.left
        }
        break
      case 'mr':
        if (dist.right < threshold)
          attrs.scaleX = (snap.right - target.left) / target.width
        break
      case 'bl':
        if (dist.left < dist.bottom && dist.left < threshold) {
          attrs.scaleX = (w - (snap.left - target.left)) / target.width
          attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY
          attrs.left = snap.left
        } else if (dist.bottom < threshold) {
          attrs.scaleY = (snap.bottom - target.top) / target.height
          attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX
          attrs.left = attrs.left + (w - target.width * attrs.scaleX)
        }
        break
      case 'mb':
        if (dist.bottom < threshold)
          attrs.scaleY = (snap.bottom - target.top) / target.height
        break
      case 'br':
        if (dist.right < dist.bottom && dist.right < threshold) {
          attrs.scaleX = (snap.right - target.left) / target.width
          attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY
        } else if (dist.bottom < threshold) {
          attrs.scaleY = (snap.bottom - target.top) / target.height
          attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX
        }
        break
    }
    target.set(attrs)
    dispatch('render', getImages())
  })
})

function setCanvasSize(width, height) {
  if (!canvas) {
    return
  }
  canvas.setWidth(width)
  canvas.setHeight(height)
}

function addImageFromURL(url, left = 0, top = 0) {
  fabric.Image.fromURL(url, (img) => {
    let canvasImg = img.set({ left, top, width: img.width, height: img.height, hasRotatingPoint: false })
    canvasImg.scaleToWidth(maxImageWidth, false)
    canvas.add(canvasImg)
    setTimeout(() => {
      dispatch('render', getImages())
    }, 100)
  })
}

function addDefaultImages() {
  defaultImages.forEach(image => {
    addImageFromURL(image.src, image.left, image.top)
  })
}

function importImage(event) {
  addImageFromURL(event.detail)
}

function getImages() {
  const images = canvas.getObjects('image')
  const result = []
  images.forEach((image) => {
    const width = image.scaleX * image.width
    const height = image.scaleY * image.height
    result.push({
      width,
      height,
      left: image.left ? image.left : 0,
      top: image.top ? image.top : 0,
      src: image.getSrc()
    })
  })

  return result
}

function addGrid() {
  for (var i = 0; i < (canvasWidth / grid); i++) {
    canvas.add(new fabric.Line([i * grid, 0, i * grid, canvasWidth], {
      stroke: 'rgba(51,51,51,0.2)',
      selectable: false
    }))
    canvas.add(new fabric.Line([0, i * grid, canvasWidth, i * grid], {
      stroke: 'rgba(51,51,51,0.2)',
      selectable: false
    }))
  }
}
function removeGrid() {
  let objects = canvas.getObjects('line')
  for (let i in objects) {
    canvas.remove(objects[i])
  }
}

function deleteSelectedImage() {
  if (canvas.getActiveObject()) {
    canvas.remove(canvas.getActiveObject())
    dispatch('render', getImages())
  }
}
</script>

<style>
#layout-images {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  height: 3rem;
}
#layout-container {
  position: relative;
  flex: 1;
  background-color: var(--body-bg);
  background: var(--body-bg-gradient);
  border-radius: 0.25rem;
  box-shadow: var(--inset-shadow);
  margin: 0 0 1rem 1rem;
  overflow: hidden;
  transition: height 400ms ease-in-out;
}
#layout-canvas-container {
  position: relative;
  max-height: calc(100vh - 250px);
}
.remove {
  position: absolute;
  top: 1rem;
  left: 1rem;
}
</style>