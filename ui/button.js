/**
 * 
 */

util.button = {};

(function(){
	'use strict'
	
	util.button.Button = function(name, icon, onclick, css, cssActive)
	{
		this.o = null
		this.id = name
		this.draggable = false
		this.icon = icon
		this.css = css || 'button'
		this.cssActive = cssActive || 'buttonActive'
		if(util.isFunction(onclick))
			this.onclick = onclick
		this.overlayText = null
	}	
	util.button.Button.prototype.enableDrag = function()
	{
		this.draggable = true
	}
	util.button.Button.prototype.setActive = function()
	{
		if(this.o)
			this.o.addClassName(this.cssActive)
	}
	util.button.Button.prototype.resetActive = function()
	{
		if(this.o)
			this.o.removeClassName(this.cssActive)
	}
	util.button.Button.prototype.setOverlayText = function(text)
	{
		this.overlayText = text
	}
})()

