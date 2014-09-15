/*
 * jquery-asGmap
 * https://github.com/amazingSurge/jquery-asGmap
 *
 * Copyright (c) 2015 amazingSurge
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

        this._plugin = pluginName;
        this.namespace = this.options.namespace;

        this.classes = {
            // status
            disabled: this.namespace + '_disabled',

            // components -- for example
            wrapper: this.namespace + '-wrapper'
        };

        this.$element.addClass(this.namespace);

        // flag
        this.disabled = false;
        this.initialized = false;

        this._trigger('init');

        if (!(typeof window.google === 'object' && window.google.maps)) {
            instances.push(this);
            this.loadScript();
        } else {
            this.init();
        }
    };

    window.asGmapAfterScriptLoad = function(){
        console.info('loaded');
        for (var i in instances){
            instances[i].init();
        }
    }

    Plugin.prototype = {
        constructor: Plugin,
        loadScript: function(){
            var script = document.createElement("script");
              script.type = "text/javascript";
              script.src = document.location.protocol + "//maps.googleapis.com/maps/api/js?"+(this.options.api_key?"key="+this.options.api_key+"&":"")+"sensor=false&callback=asGmapAfterScriptLoad";
              document.body.appendChild(script);
        },
        init: function() {
            var options = this.options;
            var MapOptions = {
                backgroundColor: '',
                center: new google.maps.LatLng(options.latitude, options.longitude),
                disableDefaultUI: options.disableDefaultUI,
                disableDoubleClickZoom: !options.doubleClickZoom,
                draggable: true,
                keyboardShortcuts: true,
                mapTypeControl: options.mapTypeControl,
                mapTypeControlOptions: {},
                mapTypeId: google.maps.MapTypeId[options.mapType],
                maxZoom: options.maxZoom,
                minZoom: options.minZoom,
                panControl: options.panControl,
                panControlOptions: {},
                rotateControl: options.rotateControl,
                rotateControlOptions: {},
                scaleControl: options.scaleControl,
                scaleControlOptions: {},
                scrollwheel: options.scrollwheel,
                streetViewControl: options.streetViewControl,
                streetViewControlOptions: {},
                zoom: options.zoom,
                zoomControl: options.zoomControl,
                zoomControlOptions: {}
            }

            if (options.controlsPositions.mapType) {mapOptions.mapTypeControlOptions.position = options.controlsPositions.mapType;}
            if (options.controlsPositions.pan) {mapOptions.panControlOptions.position = options.controlsPositions.pan;}
            if (options.controlsPositions.rotate) {mapOptions.rotateControlOptions.position = options.controlsPositions.rotate;}
            if (options.controlsPositions.scale) {mapOptions.scaleControlOptions.position = options.controlsPositions.scale;}
            if (options.controlsPositions.streetView) {mapOptions.streetViewControlOptions.position = options.controlsPositions.streetView;}
            if (options.controlsPositions.zoom) {mapOptions.zoomControlOptions.position = options.controlsPositions.zoom;}

            if(options.styles) {
                MapOptions.styles = options.styles;
            }
            this.map = new google.maps.Map(this.element, MapOptions);

            this.geocoder = new google.maps.Geocoder();

            if(options.address){
                this.geocoder.geocode({
                    address: options.address
                }, function(result, state){
                    if(result && result.length) {
                        this.gmap.setCenter(result[0].geometry.location);
                    }
                });
            }

            this.addMarker({
                latitude: options.latitude,
                longitude: options.longitude,
                address: options.address,
                icon: options.icon,
                content: options.content
            });

            this.addMarkers(this.options.markers);      

            this.initialized = true;
            // after init end trigger 'ready'
            this._trigger('ready');
        },
        getMap: function(){
            return this.map;
        },
        addMarker: function(opts){
            var markerOptions = {}, self = this;

            if(opts.icon){
                markerOptions.icon = {
                    url: opts.url,
                    size: new google.maps.Size(opts.icon.size[0], opts.icon.size[1]),
                    anchor: new google.maps.Point(opts.icon.anchor[0], opts.icon.anchor[1]),
                }
            }

            function process(){
                var marker = new google.maps.Marker(markerOptions);
                marker.setMap(this.map);

                if(opts.content){
                    var infowindow = new google.maps.InfoWindow({
                        content: '<div class="'+this.options.namespace+'-content">' + opts.content + '</div>'
                    });
                }

                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(self.map, marker);
                });
            }

            if (opts.hasOwnProperty('latitude') && opts.hasOwnProperty('longitude') && opts.latitude && opts.longitude) {
                markerOptions.position = new google.maps.LatLng(opts.latitude, opts.longitude);

                process();
            } else if(opts.hasOwnProperty('address')){
                this.geocoder.geocode({
                    address: opts.address
                }, function(result, state){
                    if(result && result.length) {
                        markerOptions.position = result[0].geometry.location;
                        process();
                    }
                });
            }
        },
        addMarkers: function(array){
            for(var i = 0, maker; marker = array[i]; i++){
                this.addMarker(marker);
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
            // detached events first
            // then remove all js generated html
            this.$element.data(pluginName, null);
            this._trigger('destory');
        }
    };

    Plugin.defaults = {
        namespace: 'gmap',
        
        api_key: false,
        mapType: 'ROADMAP', // ROADMAP, SATELLITE, HYBRID, TERRAIN

        // map options
        disableDefaultUI: false, // Enables/disables all default UI.
        doubleClickZoom: false, // Enables/disables zoom and center on double click.
        mapTypeControl: true, // The initial enabled/disabled state of the Map type control.
        maxZoom: null, // The maximum zoom level which will be displayed on the map. If omitted, or set to null, the maximum zoom from the current map type is used instead.
        minZoom: null, // The minimum zoom level which will be displayed on the map. If omitted, or set to null, the minimum zoom from the current map type is used instead.
        panControl: true, // The enabled/disabled state of the Pan control.
        rotateControl: false, // The enabled/disabled state of the Rotate control.
        scaleControl: false,// The initial enabled/disabled state of the Scale control.
        scrollwheel: false, // If false, disables scrollwheel zooming on the map.
        streetViewControl: true, // The initial enabled/disabled state of the Street View Pegman control. 
        styles: false, // Styles to apply to each of the default map types.
        zoom: 3, // The initial Map zoom level
        zoomControl: true, // The enabled/disabled state of the Zoom control.

        controlsPositions: {
            mapType: null,
            pan: null,
            rotate: null,
            scale: null,
            streetView: null,
            zoom: null
        },

        // default marker
        latitude: null,
        longitude: null,
        address: '',

        icon: {
            url: "http://www.google.com/mapfiles/marker.png",
            iconsize: [20, 34],
            iconanchor: [9, 34]
        },

        content: '',

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
