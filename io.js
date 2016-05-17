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
})();
