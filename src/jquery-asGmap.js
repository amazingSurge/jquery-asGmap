/*
 * jquery-asGmap
 * https://github.com/amazingSurge/jquery-asGmap
 *
 * Copyright (c) 2014 amazingSurge
 * Licensed under the MIT license.
 */
(function($, document, window, undefined) {
    "use strict";

    var pluginName = 'asGmap';
    var instances = [];

    var Plugin = $[pluginName] = function(element, options) {
        this.element = element;
        this.$element = $(element);

        this.options = $.extend({}, Plugin.defaults, options, this.$element.data());

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
    };

    window.asGmapOnScriptLoaded = function() {
        for (var i in instances) {
            instances[i].init();
        }
    };

    Plugin.prototype = {
        constructor: Plugin,
        loadScript: function() {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = document.location.protocol + "//maps.googleapis.com/maps/api/js?" + (this.options.apikey ? "key=" + this.options.api_key + "&" : "") + "sensor=false&callback=asGmapOnScriptLoaded";
            document.body.appendChild(script);
        },
        init: function() {
            var options = this.options,
                mapOptions = {
                    backgroundColor: options.backgroundcolor,
                    center: new google.maps.LatLng(options.latitude, options.longitude),
                    disableDefaultUI: !options.defaultuI,
                    disableDoubleClickZoom: !options.doubleclickzoom,
                    draggable: true,
                    keyboardShortcuts: true,
                    mapTypeControl: options.maptypecontrol,
                    mapTypeControlOptions: {},
                    mapTypeId: google.maps.MapTypeId[options.maptype],
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
                },
                self = this;

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


            function process() {
                self.map = new google.maps.Map(self.element, mapOptions);

                if (self.options.markercenter) {
                    self.addMarker({
                        latitude: options.latitude,
                        longitude: options.longitude,
                        address: options.address,
                        content: options.content,
                        popup: options.popup
                    });
                }


                self.addMarkers(self.options.markers);

                self.initialized = true;
                self._trigger('ready');
            }

            this.geocoder = new google.maps.Geocoder();

            if (options.address) {
                this.geocoder.geocode({
                    address: options.address
                }, function(result) {
                    if (result && result.length) {
                        mapOptions.center = result[0].geometry.location;
                    }
                    process();
                });
            } else {
                process();
            }
        },
        getMap: function() {
            return this.map;
        },
        addMarker: function(opts) {
            var markerOptions = {},
                self = this;

            opts = $.extend({
                icon: this.options.icon,
                content: '',
                popup: false
            }, opts);

            markerOptions.icon = {
                url: opts.icon.url,
                size: new google.maps.Size(opts.icon.size[0], opts.icon.size[1]),
                anchor: new google.maps.Point(opts.icon.anchor[0], opts.icon.anchor[1])
            };

            function process() {
                var marker = new google.maps.Marker(markerOptions);
                marker.setMap(self.map);

                if (opts.content) {
                    var infowindow = new google.maps.InfoWindow({
                        content: '<div class="' + self.namespace + '-content">' + opts.content + '</div>'
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                        infowindow.open(self.map, marker);
                    });

                    if (opts.popup) {
                        infowindow.open(self.map, marker);
                    }
                }
            }

            if (opts.hasOwnProperty('latitude') && opts.hasOwnProperty('longitude') && opts.latitude && opts.longitude) {
                markerOptions.position = new google.maps.LatLng(opts.latitude, opts.longitude);

                process();
            } else if (opts.hasOwnProperty('address')) {
                this.geocoder.geocode({
                    address: opts.address
                }, function(result) {
                    if (result && result.length) {
                        markerOptions.position = result[0].geometry.location;
                        process();
                    }
                });
            }
        },
        addMarkers: function(array) {
            for (var i = 0; i < array.length; i++) {
                this.addMarker(array[i]);
            }

            return this.markers;
        },
        _trigger: function(eventType) {
            var method_arguments = Array.prototype.slice.call(arguments, 1),
                data = [this].concat(method_arguments);

            // event
            this.$element.trigger(pluginName + '::' + eventType, data);

            // callback
            eventType = eventType.replace(/\b\w+\b/g, function(word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            var onFunction = 'on' + eventType;
            if (typeof this.options[onFunction] === 'function') {
                this.options[onFunction].apply(this, method_arguments);
            }
        },
        destory: function() {
            this.$element.data(pluginName, null);
            this._trigger('destory');
        }
    };

    Plugin.defaults = {
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

    $.fn[pluginName] = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = Array.prototype.slice.call(arguments, 1);

            if (/^\_/.test(method)) {
                return false;
            } else if ((/^(get)/.test(method))) {
                var api = this.first().data(pluginName);
                if (api && typeof api[method] === 'function') {
                    return api[method].apply(api, method_arguments);
                }
            } else {
                return this.each(function() {
                    var api = $.data(this, pluginName);
                    if (api && typeof api[method] === 'function') {
                        api[method].apply(api, method_arguments);
                    }
                });
            }
        } else {
            return this.each(function() {
                if (!$.data(this, pluginName)) {
                    $.data(this, pluginName, new Plugin(this, options));
                }
            });
        }
    };
})(jQuery, document, window);
