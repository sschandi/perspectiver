<div id="render">
  <div class="title">
    <button class="btn" on:click="{getImage}">Get Image</button>
  </div>
  <div class="render-container">
    <div class="render-canvas-container">
      <div class="canvas-padding"></div>
      <div class="canvas-container">
        <div class="canvas-padding"></div>
        <canvas
          id="render-canvas"
          bind:this="{canvas}"
          on:mousedown="{canvasMouseDown}"
          on:mousemove="{canvasMouseMove}"
          on:mouseup="{canvasMouseUp}"
          on:mousewheel="{canvasScroll}"
          on:DOMMouseScroll="{canvasScroll}"
        ></canvas>
        <div class="canvas-padding"></div>
      </div>
      <div class="canvas-padding"></div>
    </div>
    <div class="render-controls">
      <ChooseDesign on:design="{setupDesign}"/>
      <div class="ui-controls">
        <h2>Customize</h2>
        <div class="ui-controls-group">
          <div class="ui-control">
            <label for="canvas-width">Width (px)</label>
            <input
              id="canvas-width"
              type="number"
              bind:value={canvasWidth}
              on:input="{setupCanvas}"
              min="1"
            />
          </div>
          <div class="ui-control">
            <label for="canvas-height">Height (px)</label>
            <input
              id="canvas-height"
              type="number"
              bind:value={canvasHeight}
              on:input="{setupCanvas}"
              min="1"
            />
          </div>
          <div class="ui-control">
            <label for="canvas-blur">Shadow Blur</label>
            <input
              id="canvas-blur"
              type=number bind:value={shadowBlur}
              min="0"
              on:input="{setupCanvas}"
            >
          </div>
          <div class="ui-control">
            <label for="canvas-offset-x">Shadow Offset X</label>
            <input
              id="canvas-offset-x"
              type=number bind:value={shadowOffsetX}
              on:input="{setupCanvas}"
            >
          </div>
          <div class="ui-control">
            <label for="canvas-offset-y">Shadow Offset Y</label>
            <input
              id="canvas-offset-y"
              type=number bind:value={shadowOffsetY}
              on:input="{setupCanvas}"
            >
          </div>
          <!-- Hidden because input color does not have support for rgba which looks better -->
          <!-- <div class="color-picker-group" class="ui-control">
            <label for="canvas-shadow-color">Shadow Colour</label>
            <input
              id="canvas-shadow-color"
              bind:this="{colorPicker}"
              type="color" bind:value={shadowColor}
              on:input="{setupCanvas}"
            >
            <div
              class="input-color"
              style="background-color: {shadowColor}"
              on:click="{() => colorPicker.click()}"
            />
          </div> -->
        </div>
      </div>
    </div>
  </div>
</div>

<script>
import { onMount } from 'svelte'
import { createEventDispatcher } from 'svelte'
import ChooseDesign from './ChooseDesign.svelte'

export let images = []

const dispatch = createEventDispatcher()

let processedImagesPromise = processImages()
let processedImages = []

let canvas
let canvasWidth = 1280
let canvasHeight = 720
let ctx = null
let lastX = 600/2
let lastY = 600/2
let dragged = false
let dragStart = null
let scaleFactor = 1.1

let colorPicker
let getImageButton

let shadowColor = 'rgba(0, 0, 0, 0.4)'
let shadowBlur = 30
let shadowOffsetX = 0
let shadowOffsetY = 15
let transformMatrix = [1, -0.5, 1, 0.5, 0, 0]
let rotate = 0
let imageSort = (images) => {
  images.sort((a, b) => {
    return (b.left - a.left) + (a.top - b.top)
  })
}

$: if (images.length > 0) {
  processedImagesPromise = processImages()
  redraw()
}

$: if (processedImages.length > 0) {
  redraw()
}

onMount(() => {
  ctx = canvas.getContext('2d')
  setupCanvas()
})

function setupCanvas() {
  canvas.width = canvasWidth
  canvas.height = canvasHeight

  trackTransforms(ctx)
  
  ctx.shadowColor = shadowColor
  ctx.shadowBlur = shadowBlur
  ctx.shadowOffsetX = shadowOffsetX
  ctx.shadowOffsetY = shadowOffsetY
  ctx.rotate(rotate)
  ctx.transform(...transformMatrix)

  redraw()
}

function setupDesign(event) {
  const design = event.detail
  shadowColor = design.shadowColor
  shadowBlur = design.shadowBlur
  shadowOffsetX = design.shadowOffsetX
  shadowOffsetY = design.shadowOffsetY
  rotate = design.rotate
  transformMatrix = design.transformMatrix
  imageSort = design.imageSort
  setupCanvas()
}

async function processImages() {
  const imagesPromises = images.map( async (image) => {
    const processedImage = await getImageElement(image.src)
    return {
      ...image,
      image: processedImage
    }
  })
  try {
    const result = await Promise.all(imagesPromises)
    processedImages = result
    return result
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

function getImageElement(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      resolve(image)
    }
    image.onerror = reject
    image.crossOrigin = 'Anonymous'
    image.src = src
  })
}

function drawImage({ image, width, height, left, top }) {
  ctx.drawImage(image, left, top, width, height)
}

function drawImages() {
  imageSort(processedImages)
  processedImages.forEach((image) => {
    drawImage(image)
  })
}

function getImage() {
  // For screenshots to work with WebGL renderer, preserveDrawingBuffer should be set to true.
  let w = window.open('', '');
  w.document.title = "Perspective";
  let img = new Image();
  img.src = canvas.toDataURL();

  w.document.body.appendChild(img);
}

function clearCanvas() {
  ctx.resetTransform()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.transform(...transformMatrix)
}

function canvasMouseDown(evt) {
  document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none'
  lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft)
  lastY = evt.offsetY || (evt.pageY - canvas.offsetTop)
  dragStart = ctx.transformedPoint(lastX, lastY)
  dragged = false
}

function canvasMouseMove(evt) {
  lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft)
  lastY = evt.offsetY || (evt.pageY - canvas.offsetTop)
  dragged = true
  if (dragStart){
    let pt = ctx.transformedPoint(lastX, lastY)
    ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y)
    redraw()
  }
}

function canvasMouseUp(evt) {
  dragStart = null
  if (!dragged) zoom(evt.shiftKey ? -1 : 1 )
}

function canvasScroll(evt){
  let delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0
  if (delta) zoom(delta)
  return evt.preventDefault() && false
}

function redraw() {
  if (!ctx) {
    return
  }
  // Clear the entire canvas
  let p1 = ctx.transformedPoint(0,0)
  let p2 = ctx.transformedPoint(canvas.width, canvas.height)
  ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y)

  ctx.save()
  ctx.setTransform(1,0,0,1,0,0)
  ctx.clearRect(0,0, canvas.width, canvas.height)
  ctx.restore()

  drawImages()
}

function zoom(clicks) {
  let pt = ctx.transformedPoint(lastX, lastY)
  ctx.translate(pt.x,pt.y)
  let factor = Math.pow(scaleFactor,clicks)
  ctx.scale(factor,factor)
  ctx.translate(-pt.x,-pt.y)
  redraw()
}

function trackTransforms(ctx) {
  let svg = document.createElementNS("http://www.w3.org/2000/svg",'svg')
  let xform = svg.createSVGMatrix()
  ctx.getTransform = () => {
    return xform
  }

  let savedTransforms = []
  let save = ctx.save
  ctx.save = () => {
    savedTransforms.push(xform.translate(0,0))
    return save.call(ctx)
  }

  let restore = ctx.restore
  ctx.restore = () => {
  xform = savedTransforms.pop()
    return restore.call(ctx)
  }

  let scale = ctx.scale
  ctx.scale = (sx,sy) => {
    xform = xform.scaleNonUniform(sx,sy)
    return scale.call(ctx,sx,sy)
  }

  let rotate = ctx.rotate
  ctx.rotate = (radians) => {
    xform = xform.rotate(radians*180/Math.PI)
    return rotate.call(ctx,radians)
  }

  let translate = ctx.translate
  ctx.translate = (dx,dy) => {
    xform = xform.translate(dx,dy)
    return translate.call(ctx,dx,dy)
  }

  let transform = ctx.transform
  ctx.transform = (a,b,c,d,e,f) => {
    let m2 = svg.createSVGMatrix()
    m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f
    xform = xform.multiply(m2)
    return transform.call(ctx,a,b,c,d,e,f)
  }

  let setTransform = ctx.setTransform
  ctx.setTransform = (a,b,c,d,e,f) => {
    xform.a = a
    xform.b = b
    xform.c = c
    xform.d = d
    xform.e = e
    xform.f = f
    return setTransform.call(ctx,a,b,c,d,e,f)
  }

  let pt  = svg.createSVGPoint()
  ctx.transformedPoint = (x,y) => {
    pt.x=x; pt.y=y
    return pt.matrixTransform(xform.inverse())
  }
}
</script>

<style>
#render {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.title {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  min-height: 3rem;
}
#render-canvas {
  cursor: move;
  cursor: grab;
  box-shadow: 5px 5px 10px 0 rgba(0, 0, 0, 0.5);
}
#render-canvas:active {
  cursor: grabbing;
}
.render-container {
  flex: 1;
  display: flex;
}
.render-canvas-container {
  width: calc(100% - 200px);
  display: flex;
  flex-direction: column;
  background-color: var(--white);
}
.render-controls {
  width: 200px;
}
.canvas-container {
  display: flex;
  justify-content: center;
}
.canvas-padding {
  flex-grow: 1;
  /* background-color: var(--primary); */
}
.info {
  text-align: center;
  padding: 0.5rem;
}
.ui-controls {
  padding: 1rem;
}
.ui-controls-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  text-align: center;
}
.ui-control {
  margin-bottom: 0.5rem;
}
.ui-control input {
  max-width: 100px;
}
.color-picker-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.input-color {
  width: 100px;
  height: 32px;
  border-radius: 50px;
	margin: 0;
  cursor: pointer;
}
#canvas-shadow-color {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
canvas {
  max-width: 100%;
}
.canvas-info {
  text-align: center;
  padding: 1rem;
}
h2 {
  margin-top: 0;
}
</style>