import $ from 'jquery';
import DEFAULTS from './defaults';

const NAMESPACE = 'asGmap';
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
    let data = [this].concat(params);

    // event
    this.$element.trigger(`${NAMESPACE}::${eventType}`, data);

    // callback
    eventType = eventType.replace(/\b\w+\b/g, (word) => {
      return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
    let onFunction = `on${eventType}`;

    if (typeof this.options[onFunction] === 'function') {
      this.options[onFunction].apply(this, params);
    }
  }

  destroy() {
    this.$element.data(NAMESPACE, null);
    this._trigger('destroy');
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

export default AsGmap;
