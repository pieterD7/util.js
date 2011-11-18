/**
 * 	Written for the V8 engine
 */

function toJson(str)
{
	
	var inp = new String(str)
		inp = inp
				.replace(/{\s*'/g, '{"')
				.replace(/:\s*'/g, ':"')
				.replace(/'\s*:/g, '":')
				.replace(/'\s*}/g, '"}')
	var json = JSON.parse(inp)
	return json
}

function toXml(str)
{
   var p = new DOMParser();
   var xml = p.parseFromString(str, "text/xml");
   return xml;
}

Object.prototype.html = function(html)
{
	this.innerHTML = html
}

Object.prototype.val = function(value)
{
	this.value = value
}
util.io = {}
//alert(toXml("<tag>&amp;</tag>").getElementsByTagName('tag')[0].childNodes[0].nodeValue)

//alert(toJson("{'name':'pieter's'}").name)
//alert(toJson("[{'name':'pieter\'s'},{'name':'lo  \\\\  pi'},{'name':'Kilo zei:\\\"Hoera!\\\"'}]")[2].name)