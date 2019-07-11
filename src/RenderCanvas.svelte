<script>
import { onMount } from 'svelte'
import ChooseDesign from './ChooseDesign.svelte'

export let images = []

let processedImagesPromise = processImages()
let processedImages = []

let canvas
let canvasWidth = 1920
let canvasHeight = 1080
let ctx = null
let lastX = 600/2
let lastY = 600/2
let dragged = false
let dragStart = null
let scaleFactor = 1.1

let shadowColor = '#222831'
let shadowBlur = 30
let shadowOffsetX = -5
let shadowOffsetY = 20
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
  setupCanvas()
})

function setupCanvas() {
  canvas.width = canvasWidth
  canvas.height = canvasHeight

  ctx = canvas.getContext('2d')

  trackTransforms(ctx)
  
  ctx.shadowColor = shadowColor
  ctx.shadowBlur = shadowBlur
  ctx.shadowOffsetX = shadowOffsetX
  ctx.shadowOffsetY = shadowOffsetY
  ctx.rotate(rotate)
  // ctx.transform(1, 0, .8, 1, 0, 0)
  // ctx.transform(0.87, -0.48, 0.87, 0.48, 0, 0)
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
  // console.log(canvas, canvas.toDataURL())
  // For screenshots to work with WebGL renderer, preserveDrawingBuffer should be set to true.
  // open in new window like this
  var w = window.open('', '');
  w.document.title = "Screenshot";
  var img = new Image();
  img.src = canvas.toDataURL();

  w.document.body.appendChild(img);

  // download file like 
  // var a = document.createElement('a');
  // a.href = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
  // a.download = 'canvas.png'
  // a.click();
}

function clearCanvas() {
  ctx.resetTransform()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.transform(...transformMatrix)
}

function canvasMouseDown(evt) {
  document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
  lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
  lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
  dragStart = ctx.transformedPoint(lastX, lastY);
  dragged = false;
}

function canvasMouseMove(evt) {
  lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
  lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
  dragged = true;
  if (dragStart){
    var pt = ctx.transformedPoint(lastX, lastY);
    ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
    redraw();
  }
}

function canvasMouseUp(evt) {
  dragStart = null;
  if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
}

function canvasScroll(evt){
  var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
  if (delta) zoom(delta);
  return evt.preventDefault() && false;
}

function redraw() {
  if (!ctx) {
    return
  }
  // Clear the entire canvas
  var p1 = ctx.transformedPoint(0,0);
  var p2 = ctx.transformedPoint(canvas.width, canvas.height);
  ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

  ctx.save();
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0, canvas.width, canvas.height);
  ctx.restore();

  drawImages()
}

function zoom(clicks) {
  var pt = ctx.transformedPoint(lastX, lastY);
  ctx.translate(pt.x,pt.y);
  var factor = Math.pow(scaleFactor,clicks);
  ctx.scale(factor,factor);
  ctx.translate(-pt.x,-pt.y);
  redraw();
}

function trackTransforms(ctx) {
  var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
  var xform = svg.createSVGMatrix();
  ctx.getTransform = function(){ return xform; };

  var savedTransforms = [];
  var save = ctx.save;
  ctx.save = function(){
      savedTransforms.push(xform.translate(0,0));
      return save.call(ctx);
  };

  var restore = ctx.restore;
  ctx.restore = function(){
    xform = savedTransforms.pop();
    return restore.call(ctx);
      };

  var scale = ctx.scale;
  ctx.scale = function(sx,sy){
    xform = xform.scaleNonUniform(sx,sy);
    return scale.call(ctx,sx,sy);
      };

  var rotate = ctx.rotate;
  ctx.rotate = function(radians){
      xform = xform.rotate(radians*180/Math.PI);
      return rotate.call(ctx,radians);
  };

  var translate = ctx.translate;
  ctx.translate = function(dx,dy){
      xform = xform.translate(dx,dy);
      return translate.call(ctx,dx,dy);
  };

  var transform = ctx.transform;
  ctx.transform = function(a,b,c,d,e,f){
      var m2 = svg.createSVGMatrix();
      m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
      xform = xform.multiply(m2);
      return transform.call(ctx,a,b,c,d,e,f);
  };

  var setTransform = ctx.setTransform;
  ctx.setTransform = function(a,b,c,d,e,f){
      xform.a = a;
      xform.b = b;
      xform.c = c;
      xform.d = d;
      xform.e = e;
      xform.f = f;
      return setTransform.call(ctx,a,b,c,d,e,f);
  };

  var pt  = svg.createSVGPoint();
  ctx.transformedPoint = function(x,y){
      pt.x=x; pt.y=y;
      return pt.matrixTransform(xform.inverse());
  }
}
</script>

<style>
canvas {
  border: 1px solid black;
  max-width: 100vw;
}
</style>

<ChooseDesign on:design="{setupDesign}"/>
<h1>Render Canvas</h1>

{#await processedImagesPromise}
  <p>...waiting</p>
{:then res}
<input
  type="range"
  bind:value={canvasWidth}
  on:input="{setupCanvas}"
  min="1"
  max="1920"
/>
{canvasWidth}px Width
<input
  type="range"
  bind:value={canvasHeight}
  on:input="{setupCanvas}"
  min="1"
  max="1080"
/>
{canvasHeight}px Height
Shadow Blur
<input
  type=number bind:value={shadowBlur}
  min="0"
  on:input="{setupCanvas}"
>
Shadow Offset X
<input
  type=number bind:value={shadowOffsetX}
  on:input="{setupCanvas}"
>
Shadow Offset Y
<input
  type=number bind:value={shadowOffsetY}
  on:input="{setupCanvas}"
>
Shadow Color
<input
  type="color" bind:value="{shadowColor}"
  on:input="{setupCanvas}"
>
{:catch error}
  <p>Error {error}</p>
{/await}
<canvas
  id="render-canvas"
  bind:this="{canvas}"
  on:mousedown="{canvasMouseDown}"
  on:mousemove="{canvasMouseMove}"
  on:mouseup="{canvasMouseUp}"
  on:mousewheel="{canvasScroll}"
  on:DOMMouseScroll="{canvasScroll}"
></canvas>
<button on:click="{getImage}">Get Image</button>