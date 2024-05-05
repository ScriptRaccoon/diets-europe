export const EUROPE_GEO_JSON_PATH =
	"https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson"

export const MAP_CONFIG = {
	WIDTH: 750,
	HEIGHT: 650,
	CENTER: [12, 51],
	SCALE: 800,
}

export const HAS_TOUCH_SCREEN =
	"ontouchstart" in window ||
	navigator.maxTouchPoints > 0 ||
	navigator.msMaxTouchPoints > 0
