<div id="choose-design">
  <h2>Design</h2>
  <div class="designs">
    {#each designs as design}
      <img
        src={design.image}
        class:active={design.id === active}
        alt="Design Preview"
        on:click="{() => selectDesign(design)}"
      >
    {/each}
  </div>
</div>

<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()
const designs = [
  {
    id: 0,
    image: 'assets/design-0.png',
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    shadowBlur: 30,
    shadowOffsetX: 0,
    shadowOffsetY: 15,
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
    image: 'assets/design-1.png',
    shadowColor: 'rgba(0, 0, 0, 0.6)',
    shadowBlur: 5,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    transformMatrix: [1,0,0,1,0,0],
    rotate: 45 * Math.PI / 180,
    imageSort: (images) => {
      images.sort((a, b) => {
        return (b.left - a.left) + (a.top - b.top)
      })
    }
  },
  {
    id: 2,
    image: 'assets/design-2.png',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowBlur: 50,
    shadowOffsetX: 0,
    shadowOffsetY: 10,
    transformMatrix: [1, -0.45, .5, 0.8, 0, 0],
    rotate: 0,
    imageSort: (images) => {
      images.sort((a, b) => {
        return (b.left - a.left) + (a.top - b.top)
      })
    }
  },
  {
    id: 3,
    image: 'assets/design-3.png',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowBlur: 20,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    transformMatrix: [1, 0, 0, 1, 0, 0],
    rotate: 0,
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
.designs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
img {
  box-sizing: border-box;
  width: 100px;
  cursor: pointer;
  padding: 1rem;
  border-radius: 0.5rem;
}
.active {
  border: 3px solid var(--primary);
}
h2 {
  margin-top: 0;
}
</style>