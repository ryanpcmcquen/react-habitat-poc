webpackJsonp([8],{199:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=r(n(84)),c=r(n(9)),l=n(44);n(186);function r(e){return e&&e.__esModule?e:{default:e}}var u={color:"#E57D24"},o=function(e){var t=e.cart||[];return c.default.createElement("div",null,c.default.createElement("i",{className:"glyphicon glyphicon-shopping-cart",style:t.length?u:null}),c.default.createElement("span",{className:"shopping-cart-count"},"(",t.length||0,")"))};o=(0,l.connect)(function(e,t){return(0,a.default)({cart:e.cartReducer.cart},t)})(o),t.default=o,e.exports=t.default}});