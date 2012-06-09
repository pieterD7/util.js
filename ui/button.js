/**
 * @class util.button
 * @description Button with overlay text
 */

util.button = {};

(function(){
	'use strict'
	
	/**
	 * @description Create button instance
	 * @param {String} name ID
	 * @param {String} icon Icon filename
	 * @param {Function} onclick Callback onclick
	 * @param {String} css CSS to apply
	 * @param {String} cssActive CSS to apply on active state
	 */
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
	
	/**
	 * @description Enables drag to this button instance
	 */
	util.button.Button.prototype.enableDrag = function()
	{
		this.draggable = true
	}
	
	/**
	 * @description Set button active
	 */
	util.button.Button.prototype.setActive = function()
	{
		if(this.o)
			this.o.addClassName(this.cssActive)
	}
	
	/**
	 * @description Reset button to normal state
	 */
	util.button.Button.prototype.resetActive = function()
	{
		if(this.o)
			this.o.removeClassName(this.cssActive)
	}
	
	/**
	 * @description Sets overlay text 
	 * @param {String} text Text to be shown
	 */
	util.button.Button.prototype.setOverlayText = function(text)
	{
		this.overlayText = text
	}
})()

