# [jQuery asGmap](https://github.com/amazingSurge/jquery-asGmap) ![bower][bower-image] [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![prs-welcome]](#contributing)

> A jquery plugin that help you add google map to page.

## Table of contents
- [Main files](#main-files)
- [Quick start](#quick-start)
- [Requirements](#requirements)
- [Usage](#usage)
- [Examples](#examples)
- [Options](#options)
- [Methods](#methods)
- [Events](#events)
- [No conflict](#no-conflict)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [Development](#development)
- [Changelog](#changelog)
- [Copyright and license](#copyright-and-license)

## Main files
```
dist/
├── jquery-asGmap.js
├── jquery-asGmap.es.js
├── jquery-asGmap.min.js
└── css/
    ├── asGmap.css
    └── asGmap.min.css
```

## Quick start
Several quick start options are available:
#### Download the latest build

 * [Development](https://raw.githubusercontent.com/amazingSurge/jquery-asGmap/master/dist/jquery-asGmap.js) - unminified
 * [Production](https://raw.githubusercontent.com/amazingSurge/jquery-asGmap/master/dist/jquery-asGmap.min.js) - minified

#### Install From Bower
```sh
bower install jquery-asGmap --save
```

#### Install From Npm
```sh
npm install jquery-asGmap --save
```

#### Install From Yarn
```sh
yarn add jquery-asGmap
```

#### Build From Source
If you want build from source:

```sh
git clone git@github.com:amazingSurge/jquery-asGmap.git
cd jquery-asGmap
npm install
npm install -g gulp-cli babel-cli
gulp build
```

Done!

## Requirements
`jquery-asGmap` requires the latest version of [`jQuery`](https://jquery.com/download/).

## Usage
#### Including files:

```html
<link rel="stylesheet" href="/path/to/asGmap.css">
<script src="/path/to/jquery.js"></script>
<script src="/path/to/jquery-asGmap.js"></script>
```

#### Required HTML structure

```html
<div class="example"></div>
```

#### Initialization
All you need to do is call the plugin on the element:

```javascript
jQuery(function($) {
  $('.example').asGmap(); 
});
```

## Examples
There are some example usages that you can look at to get started. They can be found in the
[examples folder](https://github.com/amazingSurge/jquery-asGmap/tree/master/examples).

## Options
`jquery-asGmap` can accept an options object to alter the way it behaves. You can see the default options by call `$.asGmap.setDefaults()`. The structure of an options object is as follows:

```
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
```

## Methods
Methods are called on asGmap instances through the asGmap method itself.
You can also save the instances to variable for further use.

```javascript
// call directly
$().asGmap('destroy');

// or
var instance = $().data('asGmap');
instance.destroy();
```

#### getMap()
Get the map api.
```javascript
var map = $().asGmap('getMap');
```

#### addMarker(options)
Add a marker to the map.
```javascript
$().asGmap('addMarker', options);
```

#### addMarkers(arr)
Add markers to the map.
```javascript
$().asGmap('addMarkers', arr);
```

#### destroy()
Destroy the gmap instance.
```javascript
$().asGmap('destroy');
```

## Events
`jquery-asGmap` provides custom events for the plugin’s unique actions. 

```javascript
$('.the-element').on('asGmap::ready', function (e) {
  // on instance ready
});

```

Event   | Description
------- | -----------
init    | Fires when the instance is setup for the first time.
ready   | Fires when the instance is ready for API use.
destroy | Fires when an instance is destroyed. 

## No conflict
If you have to use other plugin with the same namespace, just call the `$.asGmap.noConflict` method to revert to it.

```html
<script src="other-plugin.js"></script>
<script src="jquery-asGmap.js"></script>
<script>
  $.asGmap.noConflict();
  // Code that uses other plugin's "$().asGmap" can follow here.
</script>
```

## Browser support

Tested on all major browsers.

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/safari/safari_32x32.png" alt="Safari"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/chrome/chrome_32x32.png" alt="Chrome"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/firefox/firefox_32x32.png" alt="Firefox"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/edge/edge_32x32.png" alt="Edge"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/internet-explorer/internet-explorer_32x32.png" alt="IE"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/opera/opera_32x32.png" alt="Opera"> |
|:--:|:--:|:--:|:--:|:--:|:--:|
| Latest ✓ | Latest ✓ | Latest ✓ | Latest ✓ | 9-11 ✓ | Latest ✓ |

As a jQuery plugin, you also need to see the [jQuery Browser Support](http://jquery.com/browser-support/).

## Contributing
Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md). Make sure you're using the latest version of `jquery-asGmap` before submitting an issue. There are several ways to help out:

* [Bug reports](CONTRIBUTING.md#bug-reports)
* [Feature requests](CONTRIBUTING.md#feature-requests)
* [Pull requests](CONTRIBUTING.md#pull-requests)
* Write test cases for open bug issues
* Contribute to the documentation

## Development
`jquery-asGmap` is built modularly and uses Gulp as a build system to build its distributable files. To install the necessary dependencies for the build system, please run:

```sh
npm install -g gulp
npm install -g babel-cli
npm install
```

Then you can generate new distributable files from the sources, using:
```
gulp build
```

More gulp tasks can be found [here](CONTRIBUTING.md#available-tasks).

## Changelog
To see the list of recent changes, see [Releases section](https://github.com/amazingSurge/jquery-asGmap/releases).

## Copyright and license
Copyright (C) 2016 amazingSurge.

Licensed under [the LGPL license](LICENSE).

[⬆ back to top](#table-of-contents)

[bower-image]: https://img.shields.io/bower/v/jquery-asGmap.svg?style=flat
[bower-link]: https://david-dm.org/amazingSurge/jquery-asGmap/dev-status.svg
[npm-image]: https://badge.fury.io/js/jquery-asGmap.svg?style=flat
[npm-url]: https://npmjs.org/package/jquery-asGmap
[license]: https://img.shields.io/npm/l/jquery-asGmap.svg?style=flat
[prs-welcome]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[daviddm-image]: https://david-dm.org/amazingSurge/jquery-asGmap.svg?style=flat
[daviddm-url]: https://david-dm.org/amazingSurge/jquery-asGmap
