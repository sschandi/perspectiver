<div class="main">
	<Welcome on:tutorial={() => showTutorial = true} />
	{#if showTutorial}
	<Tutorial on:done={() => showTutorial = false} />
	{/if}
	<div class="main__layout">
		<LayoutImages on:render="{handleRender}">
			<div class="header">
				<div class="logo">P</div>
				<h1 class="gradient-text">Perspectiver</h1>
				<button class="btn btn-icon" on:click={() => showTutorial = true}>
					<span class="gradient-text">?</span>
				</button>
			</div>
			<p class="well">
				Created by
				<a href="https://github.com/sschandi/" target="_blank" class="link">SS Chandi</a>
			</p>
		</LayoutImages>
	</div>
	<div class="main__render">
		<RenderCanvas images={images}/>
	</div>
</div>

<script>
import { slide } from 'svelte/transition'
import LayoutImages from './LayoutImages.svelte'
import RenderCanvas from './RenderCanvas.svelte'
import Tutorial from './Tutorial.svelte'
import Welcome from './Welcome.svelte'

let images = []
let showTutorial = false

function handleRender(event) {
	images = event.detail
}
</script>

<style>
.main {
	display: flex;
	flex-wrap: wrap;
}
.main__layout {
	width: 100%;
}
.main__render {
	width: 100%;
}
@media (min-width: 900px) {
	.main__layout {
		width: 50%;
		height: 100vh;
	}
	.main__render {
		width: 50%;
		height: 100vh;
	}
}
.header {
	display: flex;
	align-items: center;
}
.header h1 {
	margin-right: 0.5rem;
}
.well {
	font-size: 16px;
}
.logo {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  border-radius: 0.25rem;
  font-size: 36px;
  font-weight: bold;
  color: var(--white);
	box-shadow: var(--shadow);
	margin-right: 1rem;
}
</style>
