<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

const designs = [
  {
    image: 'assets/square-placeholder.jpg',
    shadowColor: '#222831',
    shadowBlur: 30,
    shadowOffsetX: -5,
    shadowOffsetY: 20,
    transformMatrix: [1, -0.5, 1, 0.5, 0, 0],
    rotate: 0,
    imageSort: (images) => {
      images.sort((a, b) => {
        return (b.left - a.left) + (a.top - b.top)
      })
    }
  },
  {
    image: 'assets/square-placeholder.jpg',
    shadowColor: '#415145',
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    transformMatrix: [1,0,0,1,0,0],
    rotate: 20 * Math.PI / 180,
    imageSort: (images) => {
      images.sort((a, b) => {
        return (b.left - a.left) + (a.top - b.top)
      })
    }
  }
]

function selectDesign(design) {
  dispatch('design', design)
}

</script>

<style>
img {
  max-height: 100px;
}
</style>

<h2>Choose A Design</h2>
{#each designs as design}
  <img src={design.image} alt="Design Preview">
  <button on:click="{() => selectDesign(design)}">Select</button>
{/each}