<input
  bind:this="{uploader}"
  type="file"
  accept="Image/*"
  class="image-input-upload"
  multiple="multiple"
  on:change="{inputImage}"
/>
<div class="info">
  <p>
    Add images by dragging them below or
    <span class="link" on:click="{clickImage}">Click Here</span>.
  </p>
  <slot name="info"/>
</div>
<div
  class="image-dropper {imageUploadActive ? 'active' : ''}"
  on:dragover|preventDefault="{() => imageUploadActive = true}"
  on:dragenter|preventDefault=""
  on:dragleave|preventDefault="{() => imageUploadActive = false}"
  on:drop|preventDefault="{dropImage}"
>
  <slot/>
</div>

<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()
let uploader
let imageUploadActive = false

function dropImage(e) {
  const files = [].slice.call(e.dataTransfer.files)
  files.forEach((file) => {
    processFile(file)
  })
  imageUploadActive = false
}

function clickImage() {
  uploader.click()
}

function inputImage() {
  const files = Object.values(uploader.files)
  files.forEach((file) => {
    processFile(file)
  })
}

function processFile(file){ 
  const reader = new FileReader()
  reader.onload = (event) => {
    upload(event.target.result)
  };
  reader.readAsDataURL(file)
}

function upload(data) {
  dispatch('image', data)
}
</script>

<style>
.info {
  text-align: center;
  padding: 1rem;
}
.image-input-upload {
  position: absolute;
  visibility: hidden;
  width: 0;
  height: 0;
}
.active {
  background-color: var(--base);
}
</style>
