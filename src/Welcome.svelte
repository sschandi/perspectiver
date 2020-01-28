{#if show}
  <div class="welcome-container">
    <div class="welcome">
      <div class="welcome-header">
        <div class="logo">
          P
        </div>
        <h1 class="title gradient-text">Perspectiver</h1>
      </div>
      <div class="welcome-body">
        <p>Create quick perspective presentations from your images</p>
        <div class="actions">
          <button class="btn" on:click={() => tutorial()}>
            <span class="gradient-text">Tutorial</span>
          </button>
          <p class="link" on:click={() => show = false}>I've been here before.</p>
        </div>
      </div>
    </div>
  </div>
{/if}

<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

let show = true

function tutorial() {
  dispatch('tutorial')
  show = false
}
</script>

<style>
.welcome-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
}
.welcome {
  max-width: 500px;
  border-radius: 0.25rem;
  background: var(--body-bg-gradient);
  box-shadow: var(--shadow);
  text-align: center;
  overflow: hidden;
}
.welcome-header {
  padding: 3rem 3rem 2rem 3rem;
  background-image: url('assets/design-0.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.welcome-body {
  padding: 2rem 3rem 3rem 3rem;
}
.logo {
  width: 75px;
  height: 75px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  border-radius: 0.25rem;
  font-size: 48px;
  font-weight: bold;
  color: var(--white);
  box-shadow: var(--shadow);
  margin: 0 auto;
}
.title {
  margin-top: 1rem;
}
.actions {
  margin-top: 1rem;
}
.actions .btn {
  margin-bottom: 0.5rem;
}
</style>