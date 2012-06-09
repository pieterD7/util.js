/**
 * @class util.selector
 * @description Select DOM element(s)
 * @example
 * var el = _s('input[type=currency]')
 * el.focus()
 */

var selector = {};

(function () {
    "use strict";
    
	/**
	 * @description Select DOM element
	 * @param {String} CSS selector
	 * @returns {HTMLElement} 
	 */
	selector._s = function (sel)
	{
		if(typeof sel === 'string')
		{
			if(document.querySelector)
			{
				var e = document.querySelector(sel)
				if(e)
				{
					return new HTMLElement(e)	
				}
			}
			else
			{
				var el = Sizzle(sel)[0]
				return new HTMLElement(el)
			}
		}
	}
		
	/**
	 * @description Select DOM elements
	 * @param {String} CSS selector
	 * @returns {Array}
	 */
	selector._sa = function(sel)
	{
		if(document.querySelectorAll)
		{
			if(typeof sel === 'string')	
				return document.querySelectorAll(sel)
		}
		else if(typeof sel === 'string')
		{
			var els = Sizzle(sel)
			return els
		}
	}
})();

_s = selector._s
_sa = selector._sa