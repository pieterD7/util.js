/**
 * 
 */

util.struct = function(baseObject, data)
{
	this.data = data
	for(var c = 0; c < baseObject.length; c++)
	{
		util.extend(this,baseObject[c].prototype)
	}
	return this
}

//util.struct.prototype = new String()
util.extend = function(destination, source) 
{
	for (var k in source) 
	{
		if (source.hasOwnProperty(k)) 
		{
			destination[k] = source[k];
		}
	}
	return destination; 
}
