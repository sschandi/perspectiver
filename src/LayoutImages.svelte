<div class="title">
  <h1>Layout Images</h1>
  <button class="btn" on:click="{() => toggleRender(showLayout)}">
    {#if showLayout}
      <span>Render</span>
    {:else}
      <span>Back</span>
    {/if}
  </button>
</div>
<div id="layout-container" bind:this="{container}">
  {#if showRemove}
    <div class="remove" transition:fade>
      <button class="btn" on:click="{deleteSelectedImage}">Delete Selected</button>
    </div>
  {/if}
  <div class="container-measure" bind:this="{measuringWrapper}">
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

<script>
import { onMount, createEventDispatcher } from 'svelte';
import { fabric } from 'fabric';
import { viewport } from './state/viewport.js'
import { fade, slide } from 'svelte/transition'
import ImportImages from './ImportImages.svelte'

export let showLayout = true

const dispatch = createEventDispatcher()

const grid = 25
const maxImageWidth = 200
const defaultImages = [
  { src: 'assets/square-placeholder.jpg', top: 0, left: 0 },
  { src: 'assets/square-placeholder.jpg', top: 300, left: 0 },
  { src: 'assets/square-placeholder.jpg', top: 300, left: 300 },
  { src: 'assets/square-placeholder.jpg', top: 0, left: 300 },
]
let canvasWidth = 1920
let canvasHeight = 1080
// Actual DOM Canvas
let canvasElement
// Fabric altered Canvas
let canvas = null
let showGrid = true
let showRemove = false
// Grow and Shrink transitions
let container
let measuringWrapper

$: if (container) {
  if (showLayout) {
      container.style.height = measuringWrapper.clientHeight + 'px'
  } else {
    container.style.height = 0
  }
}

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

// function toDataURL(src) {
//   var img = new Image();
//   img.crossOrigin = 'Anonymous';
//   img.onload = function() {
//     var canvas = document.createElement('CANVAS');
//     var ctx = canvas.getContext('2d');
//     var dataURL;
//     canvas.height = this.naturalHeight;
//     canvas.width = this.naturalWidth;
//     ctx.drawImage(this, 0, 0);
//     dataURL = canvas.toDataURL()
//   };
//   img.src = src;
// }

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
      stroke: '#f2eff8',
      selectable: false
    }))
    canvas.add(new fabric.Line([0, i * grid, canvasWidth, i * grid], {
      stroke: '#f2eff8',
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

function toggleRender(render) {
  if (render) {
    dispatch('render', getImages())
  } else {
    dispatch('back', true)
  }
}

function deleteSelectedImage() {
  if (canvas.getActiveObject()) {
    canvas.remove(canvas.getActiveObject())
  }
}
</script>

<style>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  border-bottom: 1px solid var(--grey);
  border-top: 1px solid var(--grey);
  background-color: var(--white);
}
#layout-container {
  position: relative;
  transition: height 400ms ease-in-out;
  overflow: hidden;
  background-color: var(--white);
  border-radius: 1rem;
  margin-bottom: 1rem;
}
#layout-canvas-container {
  position: relative;
  max-height: calc(100vh - 250px);
}
.remove {
  position: absolute;
  top: 0;
  left: 0;
}
</style>