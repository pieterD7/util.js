/**
 * 	Written for the V8 engine
 */

util.toJson = function(str)
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

util.toXml = function(str)
{
   var p = new DOMParser();
   var xml = p.parseFromString(str, "text/xml");
   return xml;
}
/* IE doesn't allow prototype extensions for the 
 * built in Object so we need a crossbrowser workaround.
 * */
function HTMLElement(o)
{
	this.node = o
	return this
}
/*
 * Could not use JQuery name (html) because 
 * of conflicts with IE
 * */
HTMLElement.prototype.setHtml = function(html)
{
	if(this.node && !String(this.node.tagName).match(/TITLE/i))
		this.node.innerHTML = html
}

HTMLElement.prototype.appendChild = function(o)
{
	this.node.appendChild(o)
}

HTMLElement.prototype.removeChild = function(o)
{
	this.node.removeChild(o)
}

HTMLElement.prototype.addListener = function(evnt, l)
{
	this.node.addListener(evnt, l)
}

HTMLElement.prototype.val = function(v)
{
	if(!util.isUndef(v))	
		this.node.value = v
	return this.node.value
}

HTMLElement.prototype.setAttribute = function(attr, str)
{
	this.node.setAttribute(attr, str)
}

HTMLElement.prototype.focus = function()
{
	this.node.focus()
}

HTMLElement.prototype.reset = function()
{
	this.node.reset()
}

util.createElement = function(type)
{
	return new HTMLElement(document.createElement(type))
}
/* 
Object.prototype.setHtml = function(html)
{
	if(!String(this.tagName).match(/TITLE/i))
		this.innerHTML = html
	else
		this.nodeValue = html
}

Object.prototype.val = function(value)
{
	this.value = value
}
*/
// TESTS
//alert(util.toXml("<tag>&amp;</tag>").getElementsByTagName('tag')[0].childNodes[0].nodeValue)

//alert(util.toJson("{'name':'pieter's'}").name)
//alert(util.toJson("[{'name':'pieter\'s'},{'name':'lo  \\\\  pi'},{'name':'Kilo zei:\\\"Hoera!\\\"'}]")[2].name)