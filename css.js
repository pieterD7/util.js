/**
 * 
 */

util.css = {};

(function () {
    "use strict";

	/**
	 * @param {element} obj Element on page
	 * @returns {object} {x:left, y:top}
	 */
	
	util.getCumulativeOffset = function(obj) 
	{
	    var left, top;
	    left = top = 0;
	    if (obj.offsetParent) 
	    {
	        do 
	        {
	            left += obj.offsetLeft;
	            top  += obj.offsetTop;
	        } while (obj = obj.offsetParent);
	    }
	    var ret = {x : left, y : top}
	    return ret
	}
	
	/**
	 * @description toggles visibility of element
	 * @param  {string} sel Selection
	 * @param {boolean} b (false => force hide) 
	 */
	
	util.toggle = function(sel, b)
	{
		if(sel)
		{
			if(util.isBool(b) && b)
				_s(sel).style("display:block;")
			else if((util.isBool(b) && !b) || _s(sel).node.style.display != 'none')
			// b = false or undef : force hide or toggle off			
				_s(sel).style("display:none;")
			else
			// toggle on
				_s(sel).style("display:block;")
		}
	}
	
	/**
	 * @description gets computed style
	 * @param {string} el object
	 * @param {string} styleProp style property like 'width'
	 * 
	 */
	
	util.getStyle = function(el,styleProp)
	{
		var x = el;
		if (x.currentStyle)
			var y = x.currentStyle[styleProp];
		else if (window.getComputedStyle)
			var y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
		return y
	}	
	
	/**
	 * @description get width of screen
	 * @returns {Number} width
	 */
	
	util.getScreenX = function()
	{
		return document.body.clientWidth || document.documentElement.clientWidth	
	}
	
	/**
	 * @description get height of screen
	 * @returns {Number} height
	 */
	
	util.getScreenY = function()
	{
		return document.body.clientHeight || document.documentElement.clientHeight	
	}
})();

