<script>
	import { geoPath, geoMercator, interpolateRgb, scaleLinear } from "d3"
	import { onMount } from "svelte"
	import Card from "./Card.svelte"

	const MAX_VEGAN_SCORE = 200
	const MIN_VEGAN_SCORE = 0

	const width = 750
	const height = 650

	let selectedCountry = null
	let countryData = []

	const colorInterpolator = interpolateRgb("red", "green")

	const EUROPE_GEO_JSON_PATH =
		"https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson"

	async function getCountryGeoData(pathGenerator) {
		try {
			const response = await fetch(EUROPE_GEO_JSON_PATH)
			const data = await response.json()
			return data.features.map((feature) => ({
				name: feature.properties.NAME,
				path: pathGenerator(feature),
			}))
		} catch (err) {
			console.error(err)
			return null
		}
	}

	function getVeganScore(countryDiet) {
		return (
			countryDiet.vegan * 2 +
			countryDiet.vegetarian * 1 +
			countryDiet.pescetarian * 0.5 +
			countryDiet.flexitarian * 0.25 +
			countryDiet.omnivore * 0
		)
	}

	function selectCountry(country) {
		selectedCountry = country
	}

	function unselectCountry() {
		selectedCountry = null
	}

	async function getDietData() {
		try {
			const response = await fetch("diets.json")
			const dietData = await response.json()
			return dietData
		} catch (err) {
			console.error(err)
			return null
		}
	}

	async function getCountryData() {
		const mercatorProjection = geoMercator()
			.center([12, 51])
			.scale(800)
			.translate([width / 2, height / 2])

		const pathGenerator = geoPath().projection(mercatorProjection)

		const countryGeoData = await getCountryGeoData(pathGenerator)
		const diets = await getDietData()
		if (!diets | !countryGeoData) return []
		return countryGeoData.map((countryGeo) => {
			const diet =
				diets.find((diet) => diet.country === countryGeo.name)?.diet ??
				null
			return { ...countryGeo, diet }
		})
	}

	function getCountryColor(country) {
		if (!country.diet) return "#ddd"
		const veganScore = getVeganScore(country.diet)
		let scale = scaleLinear()
			.domain([MIN_VEGAN_SCORE, MAX_VEGAN_SCORE])
			.range([0, 1])
		const hue = scale(veganScore)
		return colorInterpolator(hue)
	}

	onMount(async () => {
		countryData = await getCountryData()
	})
</script>

<div class="map">
	{#if countryData.length > 0}
		<svg width="100%" viewBox="0 0 {width} {height}">
			{#each countryData as country}
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<!-- svelte-ignore a11y-mouse-events-have-key-events -->
				<path
					d={country.path}
					fill={getCountryColor(country)}
					stroke="#222"
					on:mouseover={() => selectCountry(country)}
					on:mouseleave={unselectCountry}
					style:--color={getCountryColor(country)}
					class:hasData={Boolean(country.diet)}
				/>
			{/each}
		</svg>
	{:else}
		<p>Loading map...</p>
	{/if}
</div>

<Card country={selectedCountry} />

<style>
	.map {
		display: flex;
		justify-content: center;
		margin-block: 0.5rem;
		max-width: 52rem;
		margin-inline: auto;
		padding-inline: 1rem;
	}

	svg {
		border-radius: 0.5rem;
		transition: background-color 200ms linear;
		background-color: var(--water-color);
	}

	path {
		transition: opacity 200ms linear;
		cursor: pointer;
		fill: var(--country-color);
	}

	path:hover {
		fill: var(--color);
	}

	svg:has(path:hover) {
		background-color: transparent;
	}
</style>
