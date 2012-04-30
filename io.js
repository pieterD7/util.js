/**
 * @constructor
 * @description 
 * IE doesn't allow prototype extensions for the 
 * built in Object so we need a crossbrowser workaround.
 * */
function HTMLElement(o)
{
	this.node = o
	return this
}
	
(function () {
    "use strict";
    
	/**@param {String} string Input String
	 * @returns {Object}
	 */
	util.toJson = function(str)
	{
		if(util.isString(str))
		{
			var inp = new String(str).replace(/\n|\r|\t/g, '')
			inp = inp
					.replace(/{\s*'/g, '{"')
					.replace(/:\s*'/g, ':"')
					.replace(/'\s*:/g, '":')
					.replace(/'\s*}/g, '"}')
					.replace(/,\s*'/g, ',"')
					.replace(/'\s*,/g, '",')
					.replace(/\]\s*'/g, ']"')
					.replace(/'\s*\]/g, '"]')
					.replace(/\[\s*'/g, '["')
					.replace(/\[\s*'/g, '["')
	
			var json = JSON.parse(inp)	
			return json
		}
		return str
	}
	/**
	 * @param {String} str Input String
	 * @returns {XMLObject}
	 */
	util.toXml = function(str)
	{
	   var p = null
	   var xml = ''
	   if(!util.isUndef(window.DOMParser))
	   {
		   p = new DOMParser()
		   xml = p.parseFromString(str, "text/xml");	   
	   }
	   else
	   {
			p = new ActiveXObject("Microsoft.XMLDOM");
			p.async = false
			p.loadXML(str)
			xml = p
	   }
	   return xml;
	}

	
	/**
	 * 
	 * 
	 * @returns {Object}
	 */
	HTMLElement.prototype.getNode = function()
	{
		return this.node
	}
	
	/**
	 * @description Sets innerHTML of object
	 * @param {String} html
	 */
	/*
	 * Could not use JQuery name (html) because 
	 * of conflicts with IE
	 * */
	HTMLElement.prototype.setHtml = function(html)
	{
		if(!util.isUndef(this.node) && !String(this.node.tagName).match(/TITLE/i))
		{
			this.node.innerHTML = html
		}
	}
	
	HTMLElement.prototype.placeholder = function(str)
	{
		if(!util.isUndef(this.node))
		{
			this.node.setAttribute('placeholder', str)
		}
	}
	
	/**
	 * @description Appends innerHTML of object
	 * @param {String} html
	 */
	
	HTMLElement.prototype.appendHtml = function(html)
	{
		this.setHtml(this.node.innerHTML + html)
	}
	
	/**
	 * @description Appends object as child element
	 * @param {Object} Object generated with util.createElement
	 */
	HTMLElement.prototype.appendChild = function(o)
	{
		if(o.node && this.node)
			this.node.appendChild(o.node)
		else if(this.node)
			this.node.appendChild(o)
	}
	
	/**
	 * @description Removes objects
	 * @param {Object} Object to be removed
	 */
	HTMLElement.prototype.removeChild = function(o)
	{
		if(this.node)
			this.node.removeChild(o)
	}
	
	/**
	 * @description Adds listener to object
	 * @param {String} evnt Event
	 * @param {function} l Callback function
	 */
	HTMLElement.prototype.addListener = function(evnt, l)
	{
	if(this.node && util.isFunction(this.node.addEventListener))
		this.node.addEventListener(evnt, l)
	// Weird FF workaround:
	else if(util.isFunction(this.addEventListener))
		this.addEventListener(evnt, l, false)
	else
		this.node.attachEvent("on"+evnt, l)
	}
	
	/**
	 * @description Sets value of object
	 * @param {String} val New Value
	 * @returns {String}
	 */
	HTMLElement.prototype.val = function(v)
	{
		if(!util.isUndef(v) && this.node)	
			this.node.value = v
		if(this.node)	
			return this.node.value
	}
	
	/**
	 * @description Sets css-style. Keeps existing definition, but
	 * overwrites style
	 * @param {String} style Css definitions for this element
	 * @returns {String}
	 */
	HTMLElement.prototype.style = function(style)
	{
		// For IE7 we need to do this
		if( String(navigator.userAgent).match(/MSIE 7/) && 
			util.isString(style) && this.node)
			this.node.style.setAttribute('cssText', style);
		// Decent browsers
		else if(util.isString(style) && this.node)
			this.node.setAttribute('style', style)
		if(this.node)	
			return this.node.getAttribute('style')
	}
	
	HTMLElement.prototype.replaceStyle = function(style)
	{
		var st = util.trim(this.style())
		var stEl = util.trim(style).split(":")
		var stElName = util.trim(stEl[0])
		var stR = false
		if(stR = st.match(RegExp(stElName.escapeRegExpSpecialChars() + '\s*:\w*;')))
		{
			st = st.replace(RegExp(String(stR).escapeRegExpSpecialChars()), style)
		}
		else
		{
			st += style
		}
		console.log("NEW STYLE ATTR=" + st)
		return this.style(st)
		
	}
	
	
	/**
	 * @description Sets attribute of element
	 * @param {String} attr Attribute
	 * @param {String} string New attribute value
	 */
	HTMLElement.prototype.setAttribute = function(attr, str)
	{
		if(this.node)
			this.node.setAttribute(attr, str)
	}
	
	/**
	 * @description Sets focus to this input element
	 */
	HTMLElement.prototype.focus = function()
	{
		if(this.node)
			this.node.focus()
	}
	
	/**
	 * @description Resets this form
	 * 
	 */
	HTMLElement.prototype.reset = function()
	{
		if(this.node)
			this.node.reset()
	}
	
	HTMLElement.prototype.hasClassName = function(cls)
	{
		var na = []
		var str = ''
		var _names = this.node.getAttribute('class')
		if(_names)
		{
			na = _names.split(' ')
		}
		util.forEach(na, function(name)
		{
			str += '.' + name 
		})
		if(String(str).match(RegExp('.' + cls)))
			return true
		return false
	}
	
	/**
	 * @description Adds classname(s) to this element. Keeps classnames and 
	 * checks if the classname is already applied
	 * @param {String} className Name of class 
	 */
	HTMLElement.prototype.addClassName = function(className)
	{
		var my = this
		var clsNames = String(className).split(' ')
		util.forEach(clsNames, function(className)
		{
			if(!my.hasClassName(className)) 
			{
				var class_ = util.trim(my.node.getAttribute('class'))
				my.node.setAttribute('class', util.trim(class_ + ' ' + className))
			}
		})
	}
	/**
	 * @description Gets class name
	 */
	HTMLElement.prototype.getClassName = function()
	{
		if(!util.isUndef(this.node))
			return this.node.getAttribute('class')
	}
	
	/**
	 * @description Removes class name from class attribute
	 * 
	 */
	
	HTMLElement.prototype.removeClassName = function(className)
	{
		var na = []
		var str = ''
		var _names = this.node.getAttribute('class')
		if(_names)
		{
			na = _names.split(' ')
		}
		util.forEach(na, function(name)
		{
			str += '.' + name 
		})
		str = str.replace(RegExp(String("." + className).escapeRegExpSpecialChars()), '')
			.replace(/[.]/g, ' ')
		this.node.setAttribute('class', util.trim(str))
	}
	
	/**
	 * @description Creates an HTML element
	 * @param {String} type Type of element
	 * @returns {HTMLElement}
	 */
	util.createElement = function(type)
	{
		return new HTMLElement(document.createElement(type))
	}
})();