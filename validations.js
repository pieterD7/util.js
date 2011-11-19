/**
 *  Written for the V8 engine
 */
String.prototype.isEmpty = function()
{
	return this.toString() == '' 
}

util.isUndef = function(a)
{
	return typeof a === 'undefined'
}

util.isObject = function(a)
{
	return typeof a === 'object'
}

util.isString = function(a)
{
	return typeof a === 'string'
}

util.isFunction = function(a)
{
	return typeof a === 'function'
}

util.isBool = function(a)
{
	return typeof a === 'boolean'
}

