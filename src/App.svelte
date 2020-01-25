<div class="main">
	<!-- <Header/> -->
	<div class="main__layout">
		<LayoutImages on:render="{handleRender}" on:back="{handleBack}"/>
	</div>
	<div class="main__render">
		<RenderCanvas images={images}/>
	</div>
</div>

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

	function handleBack() {
		showRender = false
		showLayout = true
	}
</script>

<style>
:global(:root) {
	--primary: #7D47F0;
	--secondary: #0FD3C8;
	--grey: #dae1ef;
	--font: #7286B3;
	--font-header: #262939;
	--white: #ffffff;
}
:global(body) {
	background-color: var(--white);
	color: var(--font);
	font-family: 'Didact Gothic', sans-serif;
	margin: 0;
	padding: 0;
	min-width: 768px;
	overflow-y: scroll;
}
:global(h1, h2, h3, h4) {
	color: var(--font-header);
}
:global(p) {
	margin: 0;
}
:global(input) {
	width: 100px;
	height: 32px;
	border-radius: 50px;
	border: 1px solid var(--grey);
	padding: 0.5rem;
	margin: 0;
}
:global(input:focus) {
	outline: none;
}
:global(label) {
	margin-bottom: 0.5rem;
}
:global(.btn) {
	border: none;
	background-color: var(--secondary);
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
	}
	.main__render {
		width: 50%;
	}
}
</style>
