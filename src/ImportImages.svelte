<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

let uploader
let imageUploadActive = false

function dropImage(e) {
  const files = [].slice.call(e.dataTransfer.files)
  files.forEach((file) => {
    processFile(file)
  });
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
</style>
<input
  bind:this="{uploader}"
  type="file"
  accept="Image/*"
  class="image-input-upload"
  multiple="multiple"
  on:change="{inputImage}"
/>

<div
  class="image-dropper grey lighten-2 {imageUploadActive ? 'secondary' : ''}"
  row
  mb-3
  mx-0
  align-center
  justify-center
  on:dragover|preventDefault="{imageUploadActive = true}"
  on:dragenter|preventDefault=""
  on:dragleave|preventDefault="{imageUploadActive = false}"
  on:drop|preventDefault="{dropImage}"
  on:click|preventDefault="{clickImage}"
>
  <div class="text-xs-center">
    <div class="headline">Drop Image Here</div>
    <div class="body">click to open dialog</div>
  </div>
</div>
