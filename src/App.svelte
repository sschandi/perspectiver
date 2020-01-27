<div class="main">
	<!-- <Header/> -->
	{#if showTutorial}
	<Tutorial on:done={() => showTutorial = false} />
	{/if}
	<div class="main__layout">
		<LayoutImages on:render="{handleRender}">
			<h1 class="gradient-text">Perspectiver</h1>
			<button on:click={() => showTutorial = true}>Tutorial</button>
		</LayoutImages>
	</div>
	<div class="main__render">
		<RenderCanvas images={images}/>
	</div>
</div>

<script>
	import { slide } from 'svelte/transition'
	import Header from './Header.svelte'
	import LayoutImages from './LayoutImages.svelte'
	import RenderCanvas from './RenderCanvas.svelte'
	import Tutorial from './Tutorial.svelte'

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
</style>
