/**
 * @class util.dnd
 */

util.dnd = {
	mimeType:'text',// used for drop can be 'URL'
	posx:null,		// X position used for drag
	posy:null,
	minSwipeDistance:300, // Minimal distance for a swipe
	flags:null,
	options:null,
	userSet:null, // Locale settings
	unpublishedFlags:[] // Flags not to be set by setman
}

util.dnd._init = function()
{
	// Unum some flags
	this.flags = [
	              'swipeleft'	// Option for lefthanded people
	              ].unum()
	// Init options object
	this.options = new util.struct([util.options], {value:0})
	// Locale storage
	this.userSet = new util.userSettings('dnd')
}

util.dnd.getMimeType = function()
{
	return util.dnd.mimeType
}

/**
 * @function util.dnd.isDrag
 * @param {Event} e Event or null for window.event
 * @param {Function} cb Callback with first param String set 
 * to direction of the drag
 * @param {Boolean} b Prefer swipe when move is horizontal, optional
 * @description Determines the direction of the drag
 * @returns Nothing
 * @example 
 * var div = util.createElement('div')
 * div.addListener("dragstart", function(e)
 *	{
 *		var pos = util.eventObjectToPos(e)
 *		util.dnd.posx = pos.x
 *		util.dnd.posy = pos.y
 *	})		
 *	div.addListener("dragend", function(e)
 *	{					
 *		util.dnd.isDrag(e, function(dir)
 *		{
 *			switch(dir)
 *			{
 *				case 'swipe':
 *					// Do stuff
 *					break
 *				case 'left':
 *			}
 *		}, true)
 *	})
 */
util.dnd.isDrag = function(e, cb, b)
{
	var posx = util.dnd.posx
	var posy = util.dnd.posy
	var m = util.eventObjectToPos(e)
	if(posx)
	{
		var dx = Math.abs(posx - m.x)
		var dy = Math.abs(posy - m.y)
		if(dx > dy)
		{
			// Check for swipe
			if(	b && 
				util.dnd.options.get(util.dnd.flags.swipeleft) &&
				posx > m.x &&
				(posx - m.x > util.dnd.minSwipeDistance))
				cb('swipe')
			
			// Check for move left
			if(posx > m.x)
				cb('left')
				
			// Check for swipe
			if(	b && 
				!util.dnd.options.get(util.dnd.flags.swipeleft) &&	
				posx < m.x && 
				(m.x - posx > util.dnd.minSwipeDistance))
				cb('swipe')
				
			// Check for move right	
			if(posx < m.x)
				cb('right')			
		}
		else
		{
			if(posy > m.y)
				cb('up')
			if(posy < m.y)
				cb('down')			
		}

	}	
	util.dnd.posx = m.x
	util.dnd.posy = m.y
}
/**
 * @function util.dnd.draggableElement
 * @example
 * var img1 = util.createElement('img')
 * var img2 = util.createElement('img')
 * util.dnd.draggableElement(img1, function()
 *	{
 *		my.startDragging = btn.id
 *	})
 *	util.dnd.dropArea(img2, function()
 *	{
 *		my.handleDrop(btn.id)
 *	})	
 */
util.dnd.draggableElement = function(el, cb)
{
	if(util.isTouchDevice && util.isFunction(cb))
	{
		el.addListener("touchstart", 	cb, true);
		el.addListener("touchmove", 	cb, true);
		el.addListener("touchend", 		cb, true);
		el.addListener("touchcancel", 	cb, true);
	}
	else if(util.isFunction(cb))
	{
		if(String(navigator.userAgent).match(/MSIE/))
		{
			var a = util.createElement('a')
			a.setAttribute('href', '#')
			a.setAttribute('style', 'text-decoration:none;')
			a.setAttribute('draggable', 'true')
			a.addListener('click', function(){return false})
			a.addListener('drag', function()
			{
				event.dataTransfer.setData(util.dnd.getMimeType(), 'pieter')
				cb()
			})
			a.addListener('selectstart', function(){return false;})
			a.appendChild(el)
			return a
		}
		else
		{
			el.setAttribute('draggable', 'true')
			el.addListener('dragstart',  function(e)
			{
				e.dataTransfer.setData (util.dnd.getMimeType(), 'safari')
				e.dataTransfer.effectAllowed = 'all'
			}, false)	
			el.addListener('drag',  function(event)
			{
				// FF heeft altijd event.pageX == event.pageY == 0
				if(util.isFunction(cb))
					util.eventHandler(function()
					{
						cb(event)						
					})
			}, false)
			el.addListener('dragleave',  function(event)
			{

			}, false)
			el.addListener('dragend',  function(event)
			{

			}, false)
			
			el.style('-webkit-user-drag:element;')
			
			return el			
		}
	}
}

util.dnd.dropArea = function(el, cb)
{
	if(util.isFunction(cb))
	{
		el.style("-webkit-user-drop: element;")		
		el.addListener('dragenter', function(e){
			if(!String(navigator.userAgent).match(/MSIE/))
			{
				e.dataTransfer.dropEffect = 'all';
				e.preventDefault();
			}
			return false;
		}, false)
		el.addListener('dragend', function(e){
			
			// Safari drop is here 
			if(String(navigator.userAgent).match(/AppleWebKit/) &&
				!String(navigator.userAgent).match(/Chrome/)	)
			{
				// Have rights to dataTransfer.getData() in 
				// ondrop but we never get there
				cb('Drop ' + util.dnd.getMimeType())
			}
			return false;
		})
		el.addListener('drop', function(e){
			var data = ''
			if(typeof event === 'object')
				data = event.dataTransfer.getData(util.dnd.getMimeType())
			else
				data = e.dataTransfer.getData(util.dnd.getMimeType())
			cb(data)
			if(e.preventDefault)
				e.preventDefault()
			return false
		}, false)		
		el.addListener('dragover', function(e){if(e.preventDefault) e.preventDefault();return false;}, true)
		
	}
}

util.prepare(function()
{
})
