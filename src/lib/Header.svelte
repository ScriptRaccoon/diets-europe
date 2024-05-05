<script>
	import { HAS_TOUCH_SCREEN } from "./config"

	$: action = HAS_TOUCH_SCREEN ? "Tab on " : "Hover over"
</script>

<header>
	<h1>Diets in Europe</h1>
	<p>{action} a country to find out its dietary preferences*.</p>
</header>

<style>
	header {
		padding-block: 1.75rem 1rem;
		padding-inline: 1rem;
		text-align: center;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
	}

	p {
		color: var(--secondary-font-color);
	}
</style>
