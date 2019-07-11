<script>
	import LayoutImages from './LayoutImages.svelte'
	import RenderCanvas from './RenderCanvas.svelte'
	import { viewport } from './state/viewport.js'
	import { slide } from 'svelte/transition'

	const version = 'VERSION 1'
	let name = 'world'

	let images = []
	let showLayout = true
	let showRender = false

	function handleRender(event) {
		images = event.detail
		showRender = true
		showLayout = false
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
<div>
	<LayoutImages showLayout={showLayout} on:render="{handleRender}" on:back="{() => {
		showRender = false
		showLayout = true
	}}"/>
</div>
{#if showRender}
	<div transition:slide>
		<RenderCanvas images={images}/>
	</div>
{/if}
