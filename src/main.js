import $ from 'jquery';
import AsGmap from './asGmap';
import info from './info';

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
