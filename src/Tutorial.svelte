<div class="tutorial" style="top: {$coordinates.y}px; left: {$coordinates.x}px;">
  {active}
  {#if active !== 0}
    <button on:click={() => go(-1)}>Prev</button>
  {/if}
  {#if active < steps.length - 1}
    <button on:click={() => go(1)}>Next</button>
  {/if}
  <!-- Add else done tutorial emit btn -->
</div>

<script>
import { onMount } from 'svelte'
import { spring } from 'svelte/motion'

let active = 0
let coordinates = spring({ x: 0, y: 0 }, {
  stiffness: 0.4,
  damping: 0.7
})
const steps = [
  {
    id: 0,
    text: 'Add images by dragging them here.',
    target: 'layout-container',
  },
  {
    id: 1,
    text: 'Add images by dragging them here.',
    target: 'render-canvas',
  },
  {
    id: 2,
    text: 'Add images by dragging them here.',
    target: 'choose-design',
  },
  {
    id: 3,
    text: 'Add images by dragging them here.',
    target: 'ui-controls',
  },
  {
    id: 4,
    text: 'Add images by dragging them here.',
    target: 'get-image',
  }
]

onMount(() => {
  moveToActiveTarget()
})

function moveToActiveTarget() {
  const target = document.getElementById(steps[active].target)
  const bounding = target.getBoundingClientRect()
  coordinates.set({ x: bounding.left + target.scrollLeft, y: bounding.top + target.scrollTop })
}

function go(number) {
  active = active + number
  moveToActiveTarget()
}

</script>

<style>
.tutorial {
  position: absolute;
  z-index: 2000;
  top: 0;
  left: 0;
  background-color: red;
}
</style>