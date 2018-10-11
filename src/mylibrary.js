(function (global, factory) {
    typeof exports === 'object' && 
    typeof module !== 'undefined' ? module.exports = factory() : typeof define ==='function' && 
    define.amd ? define(factory) : (global.mymy = factory());
}(this, (function() {
    'use strict';

    var sqr = function(x) {
        return x * x;
    };

})));