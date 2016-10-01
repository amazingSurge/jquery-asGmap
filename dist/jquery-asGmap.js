/**
* jQuery asGmap v0.3.2
* https://github.com/amazingSurge/jquery-asGmap
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/
(function(global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('jquery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.jQuery);
    global.jqueryAsGmapEs = mod.exports;
  }
})(this,

  function(_jquery) {
    'use strict';

    var _jquery2 = _interopRequireDefault(_jquery);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ?

      function(obj) {
        return typeof obj;
      }
      :

      function(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
      };

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    var _createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;

          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);

        if (staticProps)
          defineProperties(Constructor, staticProps);

        return Constructor;
      };
    }();

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

    var NAMESPACE$1 = 'asGmap';
    var instances = [];
    var googleMapsApiLoaded = false;

    var AsGmap = function() {
      function AsGmap(element, options) {
        _classCallCheck(this, AsGmap);

        this.element = element;
        this.$element = (0, _jquery2.default)(element);

        this.options = _jquery2.default.extend(true, {}, DEFAULTS, options, this.$element.data());

        this.namespace = this.options.namespace;

        this.$element.addClass(this.namespace);

        // flag
        this.initialized = false;

        this._trigger('init');

        if (!(_typeof(window.google) === 'object' && window.google.maps)) {
          instances.push(this);
          this.loadScript();
        } else {
          this.init();
        }
      }

      _createClass(AsGmap, [{
        key: 'loadScript',
        value: function loadScript() {
          if (googleMapsApiLoaded) {

            return;
          }
          googleMapsApiLoaded = true;
          var script = document.createElement("script");
          script.type = "text/javascript";
          var key = this.options.apikey ? '&key=' + this.options.apikey : "";
          script.src = document.location.protocol + '//maps.googleapis.com/maps/api/js?callback=asGmapOnScriptLoaded' + key;
          document.body.appendChild(script);
        }
      }, {
        key: 'init',
        value: function init() {
          var _this = this;

          var options = this.options;

          var mapOptions = {
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

          var process = function process() {
            _this.map = new window.google.maps.Map(_this.element, mapOptions);

            if (_this.options.markercenter) {
              _this.addMarker({
                latitude: options.latitude,
                longitude: options.longitude,
                address: options.address,
                content: options.content,
                popup: options.popup
              });
            }

            _this.addMarkers(_this.options.markers);

            _this.initialized = true;
            _this._trigger('ready');
          };

          this.geocoder = new window.google.maps.Geocoder();

          if (options.address) {
            this.geocoder.geocode({
              address: options.address
            },

              function(result) {
                if (result && result.length) {
                  mapOptions.center = result[0].geometry.location;
                }
                process();
              }
            );
          } else {
            process();
          }
        }
      }, {
        key: 'getMap',
        value: function getMap() {
          return this.map;
        }
      }, {
        key: 'addMarker',
        value: function addMarker(opts) {
          var _this2 = this;

          var markerOptions = {};

          opts = _jquery2.default.extend({
            icon: this.options.icon,
            content: '',
            popup: false
          }, opts);

          markerOptions.icon = {
            url: opts.icon.url,
            size: new window.google.maps.Size(opts.icon.size[0], opts.icon.size[1]),
            anchor: new window.google.maps.Point(opts.icon.anchor[0], opts.icon.anchor[1])
          };

          var process = function process() {
            var marker = new window.google.maps.Marker(markerOptions);
            marker.setMap(_this2.map);

            if (opts.content) {
              (function() {
                var infowindow = new window.google.maps.InfoWindow({
                  content: '<div class="' + _this2.namespace + '-content">' + opts.content + '</div>'
                });

                window.google.maps.event.addListener(marker, 'click',

                  function() {
                    infowindow.open(_this2.map, marker);
                  }
                );

                if (opts.popup) {
                  infowindow.open(_this2.map, marker);
                }
              })();
            }
          };

          if (opts.hasOwnProperty('latitude') && opts.hasOwnProperty('longitude') && opts.latitude && opts.longitude) {
            markerOptions.position = new window.google.maps.LatLng(opts.latitude, opts.longitude);

            process();
          } else if (opts.hasOwnProperty('address')) {
            this.geocoder.geocode({
              address: opts.address
            },

              function(result) {
                if (result && result.length) {
                  markerOptions.position = result[0].geometry.location;
                  process();
                }
              }
            );
          }
        }
      }, {
        key: 'addMarkers',
        value: function addMarkers(array) {
          for (var i = 0; i < array.length; i++) {
            this.addMarker(array[i]);
          }

          return this.markers;
        }
      }, {
        key: '_trigger',
        value: function _trigger(eventType) {
          var _ref;

          for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            params[_key - 1] = arguments[_key];
          }

          var data = (_ref = [this]).concat.apply(_ref, params);

          // event
          this.$element.trigger(NAMESPACE$1 + '::' + eventType, data);

          // callback
          eventType = eventType.replace(/\b\w+\b/g,

            function(word) {
              return word.substring(0, 1).toUpperCase() + word.substring(1);
            }
          );
          var onFunction = 'on' + eventType;

          if (typeof this.options[onFunction] === 'function') {
            var _options$onFunction;

            (_options$onFunction = this.options[onFunction]).apply.apply(_options$onFunction, [this].concat(params));
          }
        }
      }, {
        key: 'destory',
        value: function destory() {
          this.$element.data(NAMESPACE$1, null);
          this._trigger('destory');
        }
      }], [{
        key: 'setDefaults',
        value: function setDefaults(options) {
          _jquery2.default.extend(DEFAULTS, _jquery2.default.isPlainObject(options) && options);
        }
      }]);

      return AsGmap;
    }();

    window.asGmapOnScriptLoaded = function() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {

        for (var _iterator = instances[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var instance = _step.value;

          instance.init();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {

          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
    ;

    var info = {
      version: '0.3.2'
    };

    var NAMESPACE = 'asGmap';
    var OtherAsGmap = _jquery2.default.fn.asGmap;

    var jQueryAsGmap = function jQueryAsGmap(options) {
      var _this3 = this;

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      if (typeof options === 'string') {
        var _ret2 = function() {
          var method = options;

          if (/^_/.test(method)) {

            return {
              v: false
            };
          } else if (/^(get)/.test(method)) {
            var instance = _this3.first().data(NAMESPACE);

            if (instance && typeof instance[method] === 'function') {

              return {
                v: instance[method].apply(instance, args)
              };
            }
          } else {

            return {
              v: _this3.each(

                function() {
                  var instance = _jquery2.default.data(this, NAMESPACE);

                  if (instance && typeof instance[method] === 'function') {
                    instance[method].apply(instance, args);
                  }
                }
              )
            };
          }
        }();

        if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object")

          return _ret2.v;
      }

      return this.each(

        function() {
          if (!(0, _jquery2.default)(this).data(NAMESPACE)) {
            (0, _jquery2.default)(this).data(NAMESPACE, new AsGmap(this, options));
          }
        }
      );
    };

    _jquery2.default.fn.asGmap = jQueryAsGmap;

    _jquery2.default.asGmap = _jquery2.default.extend({
      setDefaults: AsGmap.setDefaults,
      noConflict: function noConflict() {
        _jquery2.default.fn.asGmap = OtherAsGmap;

        return jQueryAsGmap;
      }
    }, info);
  }
);