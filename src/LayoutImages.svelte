<script>
import { onMount, createEventDispatcher } from "svelte";
import { fabric } from "fabric";
import { viewport } from './state/viewport.js'
import { fade } from 'svelte/transition'
import ImportImages from './ImportImages.svelte'

export let showLayout = true

const dispatch = createEventDispatcher()

const grid = 25
const maxImageWidth = 200
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

$: setCanvasSize($viewport.width)
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

  canvas = new fabric.Canvas("layout", {
    selection: false
  });
  setCanvasSize($viewport.width, $viewport.height)
  addGrid()

  // addImageFromURL("http://fabricjs.com/assets/pug_small.jpg")
  // addImageFromURL(
  //   "https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
  // );
  // addImageFromURL(
  //   "data:image/gif;base64,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"
  // );
  // addImageFromURL('http://phrogz.net/tmp/gkhead.jpg')
  addImageFromURL('https://i.imgur.com/31JMbcr.jpg')
  addImageFromURL('https://i.imgur.com/31JMbcr.jpg')

  // Active objects show delete button
  canvas.on('object:selected', options => {
    showRemove = true
  })

  canvas.on('selection:cleared', options => {
    showRemove = false
  })

  // snap to grid
  canvas.on("object:moving", options => {
    options.target.set({
      left: Math.round(options.target.left / grid) * grid,
      top: Math.round(options.target.top / grid) * grid
    });
  });

  canvas.on("object:scaling", options => {
    var target = options.target,
      w = target.width * target.scaleX,
      h = target.height * target.scaleY,
      snap = {
        // Closest snapping points
        top: Math.round(target.top / grid) * grid,
        left: Math.round(target.left / grid) * grid,
        bottom: Math.round((target.top + h) / grid) * grid,
        right: Math.round((target.left + w) / grid) * grid
      },
      threshold = grid,
      dist = {
        // Distance from snapping points
        top: Math.abs(snap.top - target.top),
        left: Math.abs(snap.left - target.left),
        bottom: Math.abs(snap.bottom - target.top - h),
        right: Math.abs(snap.right - target.left - w)
      },
      attrs = {
        scaleX: target.scaleX,
        scaleY: target.scaleY,
        top: target.top,
        left: target.left
      };
    switch (target.__corner) {
      case "tl":
        if (dist.left < dist.top && dist.left < threshold) {
          attrs.scaleX = (w - (snap.left - target.left)) / target.width;
          attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
          attrs.top = target.top + (h - target.height * attrs.scaleY);
          attrs.left = snap.left;
        } else if (dist.top < threshold) {
          attrs.scaleY = (h - (snap.top - target.top)) / target.height;
          attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
          attrs.left = attrs.left + (w - target.width * attrs.scaleX);
          attrs.top = snap.top;
        }
        break;
      case "mt":
        if (dist.top < threshold) {
          attrs.scaleY = (h - (snap.top - target.top)) / target.height;
          attrs.top = snap.top;
        }
        break;
      case "tr":
        if (dist.right < dist.top && dist.right < threshold) {
          attrs.scaleX = (snap.right - target.left) / target.width;
          attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
          attrs.top = target.top + (h - target.height * attrs.scaleY);
        } else if (dist.top < threshold) {
          attrs.scaleY = (h - (snap.top - target.top)) / target.height;
          attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
          attrs.top = snap.top;
        }
        break;
      case "ml":
        if (dist.left < threshold) {
          attrs.scaleX = (w - (snap.left - target.left)) / target.width;
          attrs.left = snap.left;
        }
        break;
      case "mr":
        if (dist.right < threshold)
          attrs.scaleX = (snap.right - target.left) / target.width;
        break;
      case "bl":
        if (dist.left < dist.bottom && dist.left < threshold) {
          attrs.scaleX = (w - (snap.left - target.left)) / target.width;
          attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
          attrs.left = snap.left;
        } else if (dist.bottom < threshold) {
          attrs.scaleY = (snap.bottom - target.top) / target.height;
          attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
          attrs.left = attrs.left + (w - target.width * attrs.scaleX);
        }
        break;
      case "mb":
        if (dist.bottom < threshold)
          attrs.scaleY = (snap.bottom - target.top) / target.height;
        break;
      case "br":
        if (dist.right < dist.bottom && dist.right < threshold) {
          attrs.scaleX = (snap.right - target.left) / target.width;
          attrs.scaleY = (attrs.scaleX / target.scaleX) * target.scaleY;
        } else if (dist.bottom < threshold) {
          attrs.scaleY = (snap.bottom - target.top) / target.height;
          attrs.scaleX = (attrs.scaleY / target.scaleY) * target.scaleX;
        }
        break;
    }
    target.set(attrs);
  });
});

function renderCanvas() {
  dispatch('render', getImages())
}

function setCanvasSize(width, height) {
  if (!canvas) {
    return
  }
  canvas.setWidth(width - 20)
  canvas.setHeight(height - 20)
}

function addImageFromURL(url) {
  fabric.Image.fromURL(url, (img) => {
    let canvasImg = img.set({ left: 0, top: 0 ,width: img.width, height: img.height, hasRotatingPoint: false })
    canvasImg.scaleToWidth(maxImageWidth, false)
    canvas.add(canvasImg)
  });
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
  // result.sort((a, b) => {
  //   return (a.left - b.left) + (a.top - b.top)
  // })
  // console.log(result)
  return result
}

function addGrid() {
  for (var i = 0; i < (canvasWidth / grid); i++) {
    canvas.add(new fabric.Line([i * grid, 0, i * grid, canvasWidth], {
      stroke: '#ccc',
      selectable: false
    }));
    canvas.add(new fabric.Line([0, i * grid, canvasWidth, i * grid], {
      stroke: '#ccc',
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

// Unused
function toggleGrid() {
  if (showGrid) {
    removeGrid()
  } else {
    addGrid()
  }
  showGrid = !showGrid
}

function deleteSelectedImage() {
  if (canvas.getActiveObject()) {
    canvas.remove(canvas.getActiveObject())
  }
}
</script>

<style>
#layout-container {
  transition: height 400ms ease-in-out;
  overflow: hidden;
}
#layout-canvas-container {
  position: relative;
}
.remove {
  position: absolute;
  top: 0;
  left: 0;
}
</style>

<div>
  <h1>Layout Images</h1>
  {#if showLayout}
    <button on:click="{renderCanvas}">RenderCanvas</button>
  {:else}
    <button on:click="{() => dispatch('back', true)}">Back</button>
  {/if}
</div>
<div id="layout-container" bind:this="{container}">
  <div class="container-measure" bind:this="{measuringWrapper}">
    <ImportImages on:image="{importImage}">
      <div id="layout-canvas-container">
        <canvas id="layout" bind:this="{canvasElement}">
        </canvas>
        {#if showRemove}
          <div class="remove" transition:fade>
            <button on:click="{deleteSelectedImage}">Delete selected image</button>
          </div>
        {/if}
      </div>
    </ImportImages>
  </div>
</div>