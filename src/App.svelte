<script>
	import Header from './Header.svelte'
	import LayoutImages from './LayoutImages.svelte'
	import RenderCanvas from './RenderCanvas.svelte'
	import { slide } from 'svelte/transition'

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
	--grey: #f2eff8;
	--font: #98989a;
	--font-header: #242a61;
	--white: #ffffff;
}
:global(body) {
	background-color: var(--grey);
	color: var(--font);
	margin: 0;
	overflow-y: scroll;
}
:global(h1, h2, h3, h4) {
	color: var(--font-header);
}
:global(p) {
	margin: 0;
	/* color: var(--primary); */
}
:global(input) {
	width: 100px;
	height: 32px;
	border-radius: 50px;
	border: 1px solid var(--grey);
	padding: 0.5rem;
	margin: 0;
}
:global(label) {
	margin-bottom: 0.5rem;
}
:global(.btn) {
	border: none;
	background-color: var(--font);
	color: var(--white);
	border-radius: 50px;
	padding: 0.5rem 1rem;
	margin: 0.5rem 1rem;
	cursor: pointer;
	transition: all 500ms ease-in;
}
:global(.link) {
	color: var(--font-header);
	cursor: pointer;
}
:global(.link:hover) {
	color: var(--font-header);
	text-decoration: underline;
}
.main {
	padding: 0 4rem;
}
</style>

<div class="main">
	<Header/>
	<LayoutImages showLayout={showLayout} on:render="{handleRender}" on:back="{() => {
		showRender = false
		showLayout = true
	}}"/>
	<div style="display: {showRender ? 'block' : 'none'};">
		<RenderCanvas images={images}/>
	</div>
</div>
