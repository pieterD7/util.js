/**
 * @param {Object} baseObject 
 * @data {Array} Put these objects in structure
 * @returns {util.struct}
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

/**
 * @param {Object} baseObject Base object
 * @param {Object} data Data object
 * @returns {Object} 
 */
util.mixin = function(baseObject, data)
{
	var b = util.extend(new baseObject, data)
	return b	
}
/**
 * @private
 */
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
