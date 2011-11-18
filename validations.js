/**
 *  Written for the V8 engine
 */
String.prototype.isEmpty = function()
{
	return this.toString() == '' 
}

function isUndef(a)
{
	return typeof a === 'undefined'
}

function isObject(a)
{
	return typeof a === 'object'
}

function isString(a)
{
	return typeof a === 'string'
}

function isFunction(a)
{
	return typeof a === 'function'
}

function isBool(a)
{
	return typeof a === 'boolean'
}
