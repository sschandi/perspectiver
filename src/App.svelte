<div class="main">
	<!-- <Header/> -->
	<Tutorial />
	<div class="main__layout">
		<LayoutImages on:render="{handleRender}" on:back="{handleBack}">
			<h1 class="gradient-text">Perspectiver</h1>
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
	let showLayout = true
	let showRender = false

	function handleRender(event) {
		images = event.detail
		showRender = true
		showLayout = false
	}

	function handleBack() {
		showRender = false
		showLayout = true
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
