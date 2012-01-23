/**
 * @param {String} string Input String
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
   var p = new DOMParser();
   var xml = p.parseFromString(str, "text/xml");
   return xml;
}
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

/**
 * @description Appends object as child element
 * @param {Object} Object generated with util.createElement
 */
HTMLElement.prototype.appendChild = function(o)
{
	if(this.node)
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
if(this.node && util.isFunction(this.node.addListener))
	this.node.addListener(evnt, l)
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
	if(util.isString(style) && this.node)
		this.node.setAttribute('style', style)
	if(this.node)	
		return this.node.style
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

/**
 * @description Adds classname to this element. Keeps classnames and 
 * checks if the classname is already applied
 * @param {String} className Name of class 
 */
HTMLElement.prototype.addClassName = function(className)
{
	var na = []
	var str = ''
	var _names = this.node.getAttribute('class')
	if(_names)
	{
		na = _names.split(' ')
	}
	na.forEach(function(name)
	{
		str += '.' + name 
	})
	if(!String(str).match(RegExp('.' + className)))
	{
		var class_ = na.join(' ') + ' ' + className
		this.node.setAttribute('class', class_)
	}
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

// TESTS
//alert(util.toXml("<tag>&amp;</tag>").getElementsByTagName('tag')[0].childNodes[0].nodeValue)

//alert(util.toJson("{'name':'pieter's'}").name)
//alert(util.toJson("[{'name':'pieter\'s'},{'name':'lo  \\\\  pi'},{'name':'Kilo zei:\\\"Hoera!\\\"'}]")[2].name)