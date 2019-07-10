<script>
	import LayoutImages from './LayoutImages.svelte'
	import RenderCanvas from './RenderCanvas.svelte'
	import { viewport } from './state/viewport.js'

	const version = 'VERSION 1'
	let name = 'world'

	let images = []

	function handleRender(event) {
		images = event.detail
	}
</script>

<style>
	h1 {
		color: purple
	}
</style>

<h1>Hello {name}! {version}</h1>
<p>{$viewport.width} {$viewport.height}</p>
<LayoutImages on:render="{handleRender}"/>
{#if images.length > 0}
	<RenderCanvas images={images}/>
{/if}
