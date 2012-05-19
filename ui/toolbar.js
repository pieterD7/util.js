/**
 * @class util.toolbar
 * @description Creates a drop enabled toolbar with draggable buttons and info
 */

util.toolbar = {
	tbars:[]	// Curently there are no options but maybe for future use
};

(function(){
	util.toolbar.Toolbar = function()
	{
		this.sel = null
		this.btns = []
		this.draggable = false
		this.startDragging = null
		this.order = ""	// Not used yet 
	}
	util.toolbar.Toolbar.prototype.setButtons = function(btns)
	{
		var my = this
		util.forEach(btns, function(btn)
		{
			if(	btn instanceof util.button.Button &&
				! my.btns.find(btn.id, 'id'))
				my.btns.push(btn)
			else if(util.isDebug)
				throw new util.error("Instance is not a button or button ID not unique for buttons.")
		})		
	}
	util.toolbar.Toolbar.prototype.handleDrop = function(name)
	{
		var my = this
		util.eventHandler(function()
		{
			my.sort(my.startDragging, name)
			my.display(my.sel)			
		})
	}
	util.toolbar.Toolbar.prototype.sort = function(name, before)
	{
		if(name && before && !name.equals(before))
		{
			var leftToRight = 0
			var newBtns = this.btns
			
			var i = this.btns.indexOf(name, 'id')
			var ii = this.btns.indexOf(before, 'id')
			if(i > ii)
				leftToRight = 1
			
			var b = this.btns[i]
			newBtns[i] = b
			newBtns.splice(ii, 0, b)
			newBtns.splice(i+leftToRight, 1)	
			
			delete this.btns
			this.btns = newBtns
		}
	}
	util.toolbar.Toolbar.prototype.display = function(sel)
	{
		this.sel = sel
		var my = this
		
		_s(sel).setHtml('')
		
		util.forEach(this.btns, function(btn)
		{
			var div = util.createElement('div')
			btn.o = div
			div.addClassName(btn.css)
			var img = util.createElement('img')
			img.setAttribute('src', util.iconDir + btn.icon.getSrcActive())
			img.addClassName(btn.icon.css)
			if(my.draggable)
			{
				util.dnd.draggableElement(img, function()
				{
					my.startDragging = btn.id
				})
				util.dnd.dropArea(img, function()
				{
					my.handleDrop(btn.id)
				})						
			}
			div.addListener('click', function()
			{
				if(util.isFunction(btn.onclick))
				{
					util.eventHandler(function()
					{
						my.resetButtons()
						btn.onclick()	
						btn.setActive()
					})
				}
			})
			var sp = null
			if(	util.isString(btn.overlayText) &&
				! util.trim(btn.overlayText).isEmpty())
			{
				sp = util.createElement('span')
				sp.setAttribute('id', btn.id)
				sp.setHtml(btn.overlayText)
			}			
			div.appendChild(img)
			if(sp)
				div.appendChild(sp)
			_s(sel).appendChild(div)
		})
	}
	util.toolbar.Toolbar.prototype.resetButtons = function()
	{
		util.forEach(this.btns, function(btn)
		{
			btn.resetActive()
		})
	}
	util.toolbar.Toolbar.prototype.enableDragPositions = function()
	{
		this.draggable = true
	}
})()
