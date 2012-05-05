/**
 * 
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
		this.order = ""
	}
	util.toolbar.Toolbar.prototype.setButtons = function(btns)
	{
		var my = this
		util.forEach(btns, function(btn)
		{
			if(btn instanceof util.button.Button)
				my.btns.push(btn)
		})		
	}
	util.toolbar.Toolbar.prototype.handleDrop = function(name)
	{
		var my = this
		util.eventHandler(function()
		{
			my.sort(my.startDragging, name)
			_s(my.sel).setHtml('')
			my.display(my.sel)			
		})
	}
	util.toolbar.Toolbar.prototype.sort = function(name, before)
	{
		if(name && before)
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
			this.btns = newBtns
		}
	}
	util.toolbar.Toolbar.prototype.display = function(sel)
	{
		this.sel = sel
		var my = this
		util.forEach(this.btns, function(btn)
		{
			var div = util.createElement('div')
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
			img.addListener('click', function()
			{
				if(util.isFunction(btn.onclick))
					return btn.onclick()
			})
			div.appendChild(img)
			_s(sel).appendChild(div)
		})
	}
	
	util.toolbar.Toolbar.prototype.enableDragPositions = function()
	{
		this.draggable = true
	}
})()
