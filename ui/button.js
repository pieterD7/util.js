/**
 * 
 */

util.button = {};

(function(){
	'use strict'
	
	util.button.Button = function(name, icon, onclick, css, cssActive)
	{
		this.id = name
		this.draggable = false
		this.icon = icon
		this.css = css || 'button'
		this.cssActive = cssActive || 'buttonActive'
		if(util.isFunction(onclick))
			this.onclick = onclick
	}	
	util.button.Button.prototype.enableDrag = function()
	{
		this.draggable = true
	}

})()

