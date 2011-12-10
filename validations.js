/**
 *  Written for the V8 engine
 */
var util = util || {}
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
	return a instanceof Object
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

util.isNumber = function(a)
{
	return typeof a === 'number' && isFinite(a)
}
