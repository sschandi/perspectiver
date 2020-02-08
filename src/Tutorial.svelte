<div class="tutorial-container" style="top: {$coordinates.y}px; left: {$coordinates.x}px;">
  <div class="tutorial">
    <div class="tutorial-step" style="left: {steps[active].left ? 'calc(100% - 2rem)' : '-1rem'}">
      {currStep}
    </div>
    <div class="tutorial-content-container">
      <div class="tutorial-content">
        {steps[active].text}
        <div class="tutorial-actions">
          {#if active !== 0}
            <button class="btn btn-sm" on:click={() => go(-1)}>
              <span class="gradient-text">Prev</span>
            </button>
          {/if}
          {#if active < steps.length - 1}
            <button class="btn btn-sm" on:click={() => go(1)}>
              <span class="gradient-text">Next</span>
            </button>
          {:else}
            <button class="btn btn-sm" on:click={() => dispatch('done')}>
              <span class="gradient-text">Done</span>
            </button>
          {/if}
          <!-- Add else done tutorial emit btn -->
        </div>
      </div>
    </div>
  </div>
</div>

<script>
import { onMount, createEventDispatcher } from 'svelte'
import { spring } from 'svelte/motion'

const dispatch = createEventDispatcher()

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
    text: 'Results will be shown here, drag to pan and scroll/click to zoom. Everything in the box will be rendered.',
    target: 'render-canvas',
  },
  {
    id: 2,
    text: 'Choose from preset perspective designs.',
    target: 'choose-design',
    left: true,
  },
  {
    id: 3,
    text: 'Adjust the photo size and shadow properties.',
    target: 'ui-controls',
    left: true,
  },
  {
    id: 4,
    text: 'Get image. The result will open in a new window, right click to save! (You can also right click directly on the canvas).',
    target: 'get-image',
    left: true,
  }
]

$: currStep = active + 1

onMount(() => {
  moveToActiveTarget()
})

function moveToActiveTarget() {
  const target = document.getElementById(steps[active].target)
  const bounding = target.getBoundingClientRect()
  const x = steps[active].left ? bounding.left + target.scrollLeft - 300 : bounding.left + target.scrollLeft
  const y = bounding.top + target.scrollTop 
  coordinates.set({ x, y })
}

function go(number) {
  active = active + number
  moveToActiveTarget()
}

</script>

<style>
.tutorial-container {
  position: absolute;
  z-index: 4;
}
.tutorial {
  position: relative;
  margin: 1.5rem;
}
.tutorial-step {
  position: absolute;
  top: -1rem;
  left: -1rem;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: var(--base);
  background: linear-gradient(45deg, #fd6b58, #f2e75a);
  border-radius: 30px;
  box-shadow: var(--shadow);
}
.tutorial-content-container {
  padding: 1rem;
  border-radius: 0.25rem;
  background-color: #eff1f9;
  box-shadow: var(--shadow);
}
.tutorial-content {
  max-width: 200px;
  padding: 1rem;
  border-radius: 0.25rem;
  text-align: center;
  background-color: #eff1f9;
  box-shadow: var(--inset-shadow);
}
.tutorial-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.5rem;
}
.tutorial-actions .btn {
  margin: 0 0.25rem;
}
</style>