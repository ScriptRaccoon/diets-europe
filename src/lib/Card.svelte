<script>
	import { fade } from "svelte/transition"

	export let country = null

	const LABELS = {
		vegan: "Vegans",
		vegetarian: "Vegetarians",
		pescetarian: "Pescetarians",
		flexitarian: "Flexitarians",
		omnivore: "Omnivores",
	}

	let mousePos = { x: 0, y: 0 }

	function handleMouseMove(e) {
		mousePos.x = e.clientX
		mousePos.y = e.clientY
	}
</script>

<svelte:window on:mousemove={handleMouseMove} />

{#if country}
	<div
		class="card"
		style:--top={mousePos.y + "px"}
		style:--left={mousePos.x + 15 + "px"}
		transition:fade={{ duration: 200 }}
	>
		<h2 class="title">{country.name}</h2>
		<div class="content">
			{#if country.diet}
				<ul class="list">
					{#each Object.keys(country.diet) as dietKey}
						<li>
							{LABELS[dietKey]}:
							<span class="percentage">
								{country.diet[dietKey]}%
							</span>
						</li>
					{/each}
				</ul>
			{:else}
				<p>No data about dietary preferences.</p>
			{/if}
		</div>
	</div>
{/if}

<style>
	.card {
		position: absolute;
		top: var(--top);
		left: var(--left);
		background-color: var(--bg-color);
		padding: 1rem 1.5rem 1rem 1rem;
		border-radius: 0.25rem 0.25rem 1rem 0.25rem;
		box-shadow: 0.2rem 0.2rem 1rem #0007;
	}

	.title {
		margin-bottom: 0.25rem;
		font-size: 1.5rem;
	}

	.content {
		font-size: 1.125rem;
	}

	.list {
		margin-left: 1.25rem;
		line-height: 1.25;
	}

	.percentage {
		font-weight: bold;
	}
</style>
