/**
 * 
 */

var selector = {};

(function () {
    "use strict";
    
	/**
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