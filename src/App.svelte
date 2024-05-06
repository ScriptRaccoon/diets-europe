<script>
	import Header from "./lib/components/Header.svelte"
	import Footer from "./lib/components/Footer.svelte"
	import Map from "./lib/components/Map.svelte"
</script>

<svelte:head>
	<title>Diets in Europe</title>
</svelte:head>

<Header />

<main>
	<Map />
</main>

<Footer />

<style>
	main {
		padding-inline: var(--pad);
	}
</style>
