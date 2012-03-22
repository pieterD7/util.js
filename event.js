(function () {
    "use strict";

	/**
	 * @description Abstract handler with try/catch
	 * @param {function} cb Callback
	 */
	util.eventHandler = function(cb)
	{
		if(util.isFunction(cb))
		{
			try
			{
				return cb()
			}
			catch(err)
			{
				util.debug.log(err)
			}
		}
	}
	
	util.fireEvent = function(element, event)
	{
	    if (document.createEventObject)
	    {
		    // dispatch for IE
		    var evt = document.createEventObject();
		    return element.fireEvent('on'+event,evt)
	    }
	    else
	    {
		    // dispatch for firefox + others
		    var evt = document.createEvent("HTMLEvents");
		    evt.initEvent(event, true, true ); // event type,bubbling,cancelable
		    return !element.dispatchEvent(evt);
	    }
	}
	
	util.eventObjectToPos = function(e)
	{
		if(e.pageX && e.pageY)
		{
			return {x:e.pageX, y:e.pageY}
		}
		else
		{
			var x = e.clientX + document.body.scrollLeft - document.body.clientLeft
			var y = e.clientY + document.body.scrollTop - document.body.clientTop
			return {x:x, y:y}
		}
	}
	
})()