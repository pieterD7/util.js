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

Object.prototype.html = function(html)
{
	if(!util.isUndef(this.innerHTML))
		this.innerHTML = html
	else
		this.text = html
}

Object.prototype.val = function(value)
{
	this.value = value
}

// TESTS
//alert(util.toXml("<tag>&amp;</tag>").getElementsByTagName('tag')[0].childNodes[0].nodeValue)

//alert(util.toJson("{'name':'pieter's'}").name)
//alert(util.toJson("[{'name':'pieter\'s'},{'name':'lo  \\\\  pi'},{'name':'Kilo zei:\\\"Hoera!\\\"'}]")[2].name)