/**
 * 
 */

util.struct = function(baseObject, data)
{
	this.data = data
	for(var c = 0; c < baseObject.length; c++)
	{
		if(baseObject[c].prototype)
			util.extend(this, baseObject[c].prototype)
		else
			util.extend(this, baseObject[c])
	}
	return this
}

util.mixin = function(baseObject, data)
{
	var b = util.extend(new baseObject, data)
	return b	
}

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
