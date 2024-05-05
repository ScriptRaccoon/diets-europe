export const MAX_VEGAN_SCORE = 200
export const MIN_VEGAN_SCORE = 0

export function getVeganScore(countryDiet) {
	return (
		countryDiet.vegan * 2 +
		countryDiet.vegetarian * 1 +
		countryDiet.pescetarian * 0.5 +
		countryDiet.flexitarian * 0.25 +
		countryDiet.omnivore * 0
	)
}
