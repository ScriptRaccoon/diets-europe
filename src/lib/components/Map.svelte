<script>
	import { geoPath, geoMercator, interpolateRgb, scaleLinear } from "d3"
	import { onMount } from "svelte"
	import Card from "./Card.svelte"
	import {
		EUROPE_GEO_JSON_PATH,
		HAS_TOUCH_SCREEN,
		MAP_CONFIG,
	} from "../config.js"
	import {
		MAX_VEGAN_SCORE,
		MIN_VEGAN_SCORE,
		getVeganScore,
	} from "../score.js"

	const colorInterpolator = interpolateRgb("red", "green")

	let selectedCountry = null
	let countryData = []

	function selectCountry(country) {
		selectedCountry = country
	}

	function unselectCountry() {
		selectedCountry = null
	}

	async function getDietData() {
		try {
			const response = await fetch("diets.json")
			return await response.json()
		} catch (err) {
			console.error(err)
			return null
		}
	}

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

	async function getCountryData() {
		const mercatorProjection = geoMercator()
			.center(MAP_CONFIG.CENTER)
			.scale(MAP_CONFIG.SCALE)
			.translate([MAP_CONFIG.WIDTH / 2, MAP_CONFIG.HEIGHT / 2])

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

	async function setCountryData() {
		countryData = await getCountryData()
	}

	onMount(setCountryData)
</script>

<div class="map">
	{#if countryData.length > 0}
		<svg width="100%" viewBox="0 0 {MAP_CONFIG.WIDTH} {MAP_CONFIG.HEIGHT}">
			{#each countryData as country}
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<!-- svelte-ignore a11y-mouse-events-have-key-events -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<path
					d={country.path}
					fill={getCountryColor(country)}
					stroke="#222"
					on:mouseover={() => {
						if (!HAS_TOUCH_SCREEN) selectCountry(country)
					}}
					on:mouseleave={() => {
						if (!HAS_TOUCH_SCREEN) unselectCountry()
					}}
					on:click={() => {
						if (HAS_TOUCH_SCREEN) selectCountry(country)
					}}
					style:--color={getCountryColor(country)}
					class:selected={selectedCountry === country}
				/>
			{/each}
		</svg>
	{:else}
		<p>Loading map...</p>
	{/if}
</div>

<Card country={selectedCountry} {unselectCountry} />

<style>
	.map {
		display: flex;
		justify-content: center;
		margin-block: 0.5rem;
		max-width: 52rem;
		margin-inline: auto;
	}

	svg {
		border-radius: 0.5rem;
		background-color: var(--water-color);
	}

	path {
		cursor: pointer;
		transition: fill 200ms ease;
		fill: var(--country-color);
	}

	path.selected {
		fill: var(--color);
	}
</style>
