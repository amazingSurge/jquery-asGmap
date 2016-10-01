/**
* jQuery asGmap v0.3.3
* https://github.com/amazingSurge/jquery-asGmap
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/
import $ from 'jquery';

var DEFAULTS = {
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

const NAMESPACE$1 = 'asGmap';
let instances = [];
let googleMapsApiLoaded = false;

class AsGmap {
  constructor(element, options) {
    this.element = element;
    this.$element = $(element);

    this.options = $.extend(true, {}, DEFAULTS, options, this.$element.data());

    this.namespace = this.options.namespace;

    this.$element.addClass(this.namespace);

    // flag
    this.initialized = false;

    this._trigger('init');

    if (!(typeof window.google === 'object' && window.google.maps)) {
      instances.push(this);
      this.loadScript();
    } else {
      this.init();
    }
  }

  loadScript() {
    if (googleMapsApiLoaded) {
      return;
    }
    googleMapsApiLoaded = true;
    const script = document.createElement("script");
    script.type = "text/javascript";
    const key = this.options.apikey? `&key=${this.options.apikey}`: "";
    script.src = `${document.location.protocol}//maps.googleapis.com/maps/api/js?callback=asGmapOnScriptLoaded${key}`;
    document.body.appendChild(script);
  }

  init() {
    const options = this.options;

    const mapOptions = {
      backgroundColor: options.backgroundcolor,
      center: new window.google.maps.LatLng(options.latitude, options.longitude),
      disableDefaultUI: !options.defaultuI,
      disableDoubleClickZoom: !options.doubleclickzoom,
      draggable: true,
      keyboardShortcuts: true,
      mapTypeControl: options.maptypecontrol,
      mapTypeControlOptions: {},
      mapTypeId: window.google.maps.MapTypeId[options.maptype],
      maxZoom: options.maxzoom,
      minZoom: options.minzoom,
      panControl: options.pancontrol,
      panControlOptions: {},
      rotateControl: options.rotatecontrol,
      rotateControlOptions: {},
      scaleControl: options.scalecontrol,
      scaleControlOptions: {},
      scrollwheel: options.scrollwheel,
      streetViewControl: options.streetviewcontrol,
      streetViewControlOptions: {},
      zoom: options.zoom,
      zoomControl: options.zoomcontrol,
      zoomControlOptions: {}
    };

    if (options.controlspositions.mapType) {
      mapOptions.mapTypeControlOptions.position = options.controlspositions.mapType;
    }
    if (options.controlspositions.pan) {
      mapOptions.panControlOptions.position = options.controlspositions.pan;
    }
    if (options.controlspositions.rotate) {
      mapOptions.rotateControlOptions.position = options.controlspositions.rotate;
    }
    if (options.controlspositions.scale) {
      mapOptions.scaleControlOptions.position = options.controlspositions.scale;
    }
    if (options.controlspositions.streetView) {
      mapOptions.streetViewControlOptions.position = options.controlspositions.streetView;
    }
    if (options.controlspositions.zoom) {
      mapOptions.zoomControlOptions.position = options.controlspositions.zoom;
    }
    if (options.styles) {
      mapOptions.styles = options.styles;
    }

    let process = () => {
      this.map = new window.google.maps.Map(this.element, mapOptions);

      if (this.options.markercenter) {
        this.addMarker({
          latitude: options.latitude,
          longitude: options.longitude,
          address: options.address,
          content: options.content,
          popup: options.popup
        });
      }

      this.addMarkers(this.options.markers);

      this.initialized = true;
      this._trigger('ready');
    };

    this.geocoder = new window.google.maps.Geocoder();

    if (options.address) {
      this.geocoder.geocode({
        address: options.address
      }, result => {
        if (result && result.length) {
          mapOptions.center = result[0].geometry.location;
        }
        process();
      });
    } else {
      process();
    }
  }

  getMap() {
    return this.map;
  }

  addMarker(opts) {
    const markerOptions = {};

    opts = $.extend({
      icon: this.options.icon,
      content: '',
      popup: false
    }, opts);

    markerOptions.icon = {
      url: opts.icon.url,
      size: new window.google.maps.Size(opts.icon.size[0], opts.icon.size[1]),
      anchor: new window.google.maps.Point(opts.icon.anchor[0], opts.icon.anchor[1])
    };

    let process = () => {
      const marker = new window.google.maps.Marker(markerOptions);
      marker.setMap(this.map);

      if (opts.content) {
        const infowindow = new window.google.maps.InfoWindow({
          content: `<div class="${this.namespace}-content">${opts.content}</div>`
        });

        window.google.maps.event.addListener(marker, 'click', () => {
          infowindow.open(this.map, marker);
        });

        if (opts.popup) {
          infowindow.open(this.map, marker);
        }
      }
    };

    if (opts.hasOwnProperty('latitude') && opts.hasOwnProperty('longitude') && opts.latitude && opts.longitude) {
      markerOptions.position = new window.google.maps.LatLng(opts.latitude, opts.longitude);

      process();
    } else if (opts.hasOwnProperty('address')) {
      this.geocoder.geocode({
        address: opts.address
      }, result => {
        if (result && result.length) {
          markerOptions.position = result[0].geometry.location;
          process();
        }
      });
    }
  }

  addMarkers(array) {
    for (let i = 0; i < array.length; i++) {
      this.addMarker(array[i]);
    }

    return this.markers;
  }

   _trigger(eventType, ...params) {
    let data = [this].concat(...params);

    // event
    this.$element.trigger(`${NAMESPACE$1}::${eventType}`, data);

    // callback
    eventType = eventType.replace(/\b\w+\b/g, (word) => {
      return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
    let onFunction = `on${eventType}`;

    if (typeof this.options[onFunction] === 'function') {
      this.options[onFunction].apply(this, ...params);
    }
  }

  destory() {
    this.$element.data(NAMESPACE$1, null);
    this._trigger('destory');
  }

  static setDefaults(options) {
    $.extend(true, DEFAULTS, $.isPlainObject(options) && options);
  }
}

window.asGmapOnScriptLoaded = () => {
  for (const instance of instances) {
    instance.init();
  }
};

var info = {
  version:'0.3.3'
};

const NAMESPACE = 'asGmap';
const OtherAsGmap = $.fn.asGmap;

const jQueryAsGmap = function(options, ...args) {
  if (typeof options === 'string') {
    const method = options;

    if (/^_/.test(method)) {
      return false;
    } else if ((/^(get)/.test(method))) {
      const instance = this.first().data(NAMESPACE);
      if (instance && typeof instance[method] === 'function') {
        return instance[method](...args);
      }
    } else {
      return this.each(function() {
        const instance = $.data(this, NAMESPACE);
        if (instance && typeof instance[method] === 'function') {
          instance[method](...args);
        }
      });
    }
  }

  return this.each(function() {
    if (!$(this).data(NAMESPACE)) {
      $(this).data(NAMESPACE, new AsGmap(this, options));
    }
  });
};

$.fn.asGmap = jQueryAsGmap;

$.asGmap = $.extend({
  setDefaults: AsGmap.setDefaults,
  noConflict: function() {
    $.fn.asGmap = OtherAsGmap;
    return jQueryAsGmap;
  }
}, info);
