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
.image-input-upload {
  position: absolute;
  visibility: hidden;
  width: 0;
  height: 0;
}
.image-dropper {
  height: 100px;
  cursor: pointer;
  background-color: grey;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.image-dropper:hover {
  background-color: azure;
}
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
  class="image-dropper {imageUploadActive ? 'secondary' : ''}"
  on:dragover|preventDefault="{imageUploadActive = true}"
  on:dragenter|preventDefault=""
  on:dragleave|preventDefault="{imageUploadActive = false}"
  on:drop|preventDefault="{dropImage}"
  on:click|preventDefault="{clickImage}"
>
  <div>
    <p>Drop Image Here</p>
    <p>click to open dialog</p>
  </div>
</div>
