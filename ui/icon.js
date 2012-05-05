/**
 * 
 */

util.icon = {};

(function(){
	
	'use strict'
	
	util.icon.Icon = function(nameActive, namePassive, type, css)
	{
		this.nameActive = nameActive
		this.namePassive = namePassive
		this.type = type || 'medium'
		this.css = css || 'icon'
	}
	
	util.icon.Icon.prototype.getSrcActive = function()
	{
		return this.type + '/' + this.nameActive
	}
	
})()