<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

const designs = [
  {
    id: 0,
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
    id: 1,
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
let active = 0

function selectDesign(design) {
  active = design.id
  dispatch('design', design)
}

</script>

<style>
#choose-design {
  background-color: var(--white);
  border-radius: 1rem;
  padding: 1rem;
  margin: 1rem 0;
}
img {
  box-sizing: border-box;
  max-height: 100px;
  max-width: 100px;
  cursor: pointer;
  padding: 1rem;
  border-radius: 0.5rem;
}
.active {
  border: 3px solid var(--font-header);
}
h2 {
  margin-top: 0;
}
</style>

<div id="choose-design">
  <h2>Design</h2>
  {#each designs as design}
    <img
      src={design.image}
      class:active={design.id === active}
      alt="Design Preview"
      on:click="{() => selectDesign(design)}"
    >
  {/each}
</div>