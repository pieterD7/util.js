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
			var e = document.querySelector(sel)
			if(e)
			{
				return new HTMLElement(e)	
			}
		}
	}
		
	/**
	 * @param {String} CSS selector
	 * @returns {Array}
	 */
	selector._sa = function(sel)
	{
		if(typeof sel === 'string')	
			return document.querySelectorAll(sel)
	}
})();

_s = selector._s
_sa = selector._sa