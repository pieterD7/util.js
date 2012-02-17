/**
 * 
 */

util.dnd = {
	isTouchDevice:null,	
	_init: function()
	{
		this.isTouchDevice = util.dnd._isTouchDevice()			
	}
}

util.dnd.draggableElement = function(el, cb)
{
	if(util.dnd.isTouchDevice && util.isFunction(cb))
	{
		el.addListener("touchstart", 	cb, true);
		el.addListener("touchmove", 	cb, true);
		el.addListener("touchend", 		cb, true);
		el.addListener("touchcancel", 	cb, true);
	}
	else if(util.isFunction(cb))
	{
		el.setAttribute('draggable', 'true')		
		el.addListener('dragstart', cb)
	}
}

util.dnd.dropArea = function(el, cb)
{
	if(util.isFunction(cb))
	{
		el.addListener('dragover', function(e){e.preventDefault()}, true)
		el.addListener("drop", function(e){e.preventDefault(); cb()}, true)
	}
}

util.dnd._isTouchDevice = function()
{
	return "ontouchstart" in document.documentElement
}

util.prepare(function()
{
})
