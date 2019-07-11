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
:global(:root) {
	--primary: #aaa333;
}
:global(p) {
	margin: 0;
	color: var(--primary);
}
h1 {
	color: var(--primary);
}
</style>

<h1>Hello {name}! {version}</h1>
<p>{$viewport.width} {$viewport.height}</p>
<LayoutImages on:render="{handleRender}"/>
{#if images.length > 0}
	<RenderCanvas images={images}/>
{/if}
