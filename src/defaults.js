export default {
  namespace: 'gmap',

  apikey: '',
  mapType: 'ROADMAP', // ROADMAP, SATELLITE, HYBRID, TERRAIN

  // map options
  backgroundcolor: '#e5e3df', // Color used for the background of the Map div.
  defaultui: true, // Enables/disables all default UI.
  doubleclickzoom: false, // Enables/disables zoom and center on double click.
  maptypecontrol: true, // The initial enabled/disabled state of the Map type control.
  maxzoom: null, // The maximum zoom level which will be displayed on the map. If omitted, or set to null, the maximum zoom from the current map type is used instead.
  minzoom: null, // The minimum zoom level which will be displayed on the map. If omitted, or set to null, the minimum zoom from the current map type is used instead.
  pancontrol: false, // The enabled/disabled state of the Pan control.
  rotatecontrol: false, // The enabled/disabled state of the Rotate control.
  scalecontrol: false, // The initial enabled/disabled state of the Scale control.
  scrollwheel: false, // If false, disables scrollwheel zooming on the map.
  streetviewcontrol: false, // The initial enabled/disabled state of the Street View Pegman control.
  styles: false, // Styles to apply to each of the default map types.
  zoom: 3, // The initial Map zoom level
  zoomcontrol: true, // The enabled/disabled state of the Zoom control.

  controlspositions: {
    mapType: null,
    pan: null,
    rotate: null,
    scale: null,
    streetView: null,
    zoom: null
  },

  // position
  latitude: null,
  longitude: null,
  address: '',

  // markers
  markers: [],
  icon: {
    url: "http://www.google.com/mapfiles/marker.png",
    size: [20, 34],
    anchor: [9, 34]
  },

  // marker
  markercenter: true,
  content: '',
  popup: true,

  // callback
  onInit: null,
  onReady: null
};
