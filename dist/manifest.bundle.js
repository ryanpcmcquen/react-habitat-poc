webpackJsonp([4],{22:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n,u=r(3),o=r(49),a=(n=o)&&n.__esModule?n:{default:n};var i=(0,u.combineReducers)({cartReducer:a.default});t.default=i,e.exports=t.default},28:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.addedToCart=function(e){return{quantity:1,sku:e.sku,type:"ADD_TO_CART"}}},29:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a(r(11)),u=a(r(33)),o=(a(r(22)),r(51));function a(e){return e&&e.__esModule?e:{default:e}}var i=function(e){function t(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var e=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this)),a=new n.default.ContainerBuilder;return a.factory=new o.ReduxDomFactory(u.default),a.registerAsync(function(){return r.e(1).then(r.bind(null,69))}).as("Button"),a.registerAsync(function(){return r.e(0).then(r.bind(null,70))}).as("Card"),a.registerAsync(function(){return r.e(3).then(r.bind(null,71))}).as("Cart"),a.registerAsync(function(){return r.e(2).then(r.bind(null,72))}).as("ProductCard"),e.setContainer(a.build()),window.updateHabitat=e.update.bind(e),e}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,n.default.Bootstrapper),t}();t.default=new i,e.exports=t.default},33:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n,u=r(3),o=r(22),a=(n=o)&&n.__esModule?n:{default:n},i=r(50);t.default=function(){var e=(0,i.loadState)(),t=(0,u.createStore)(a.default,e);return t.subscribe(function(){(0,i.saveState)({cart:t.getState().cart})}),t},e.exports=t.default},49:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e};!function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);t.default=e}(r(28));t.default=function(){var e,t,r,u=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{cart:[]},o=arguments[1];switch(o.type){case"ADD_TO_CART":return n({},u,{cart:[].concat(function(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)}(u.cart),[(e={},t=o.sku,r=o.quantity,t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e)])});default:return u}},e.exports=t.default},50:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.loadState=function(){try{var e=localStorage.getItem("state");if(null===e)return;return JSON.parse(e)}catch(e){return}},t.saveState=function(e){try{var t=JSON.stringify(e);localStorage.setItem("state",t)}catch(e){}}},51:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ReduxDomFactory=void 0;var n,u=r(52),o=(n=u)&&n.__esModule?n:{default:n};t.ReduxDomFactory=o.default,t.default=o.default},52:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),u=r(10),o=i(r(2)),a=i(r(15));function i(e){return e&&e.__esModule?e:{default:e}}var c=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.store=t}return n(e,[{key:"inject",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=arguments[2];r&&a.default.render(o.default.createElement(u.Provider,{store:this.store},o.default.createElement(e,t)),r)}},{key:"dispose",value:function(e){e&&a.default.unmountComponentAtNode(e)}}]),e}();t.default=c}},[29]);