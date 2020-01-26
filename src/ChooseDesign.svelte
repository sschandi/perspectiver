<div id="choose-design">
  <div class="designs">
    <button class="btn btn-gradient" class:disabled="{active <= 0}" on:click={previousDesign}>
      <img src="assets/arrow-up.svg" alt="Previous" class="arrow">
    </button>
    <div class="design">
      <img
        class="design-img"
        src={designs[active].image}
        alt="Design Preview"
      >
    </div>
    <button class="btn btn-gradient" class:disabled={active >= designs.length - 1} on:click={nextDesign}>
      <img src="assets/arrow-up.svg" alt="Previous" class="arrow arrow-down">
    </button>
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
  // active = design.id
  dispatch('design', design)
}

function previousDesign() {
  if (active > 0) {
    active--
  }
  selectDesign(designs[active])
}

function nextDesign() {
  if (active < designs.length - 1) {
    active++
  }
  selectDesign(designs[active])
}
</script>

<style>
#choose-design {
  padding: 1rem 1rem 0 0;
}
.designs {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.design {
  box-sizing: border-box;
  width: 190px;
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 0.25rem;
  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.1), inset -3px -3px 8px rgba(255, 255, 255, 0.8);
}
.design-img {
  width: 100%;
  height: 100%;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.5);
  border-radius: 0.25rem;
  background-color: var(--white);
}
.btn {
  padding: 0.5rem;
  display: flex;
  align-items: center;
  margin: 0;
}
.arrow {
  padding: 0;
  width: 20px;
}
.arrow-down {
  transform: rotate(180deg);
}
.disabled {
  background-color: var(--grey);
  cursor: default;
}
h2 {
  margin-top: 0;
}
</style>