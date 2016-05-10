/**
 * @param {String} id Unique property, can be omitted
 * @returns {Array}
 */

Array.prototype.unique = function(id)
{
	var temp = []
	var _temp = []
	var id = util.isUndef(id) ? false : id
	util.forEach(this, function(t)
	{
		if(id)
		{
			if(util.isUndef(_temp[t[id]]))
			{
				_temp[t[id]] = true
				temp.push(t)
			}
		}
		else
		{
			if(util.isUndef(_temp[t]))
			{
				_temp[t] = true
				temp.push(t)
			}
		}

	})
	return temp
}
/**
 * @param {String} id Identifier
 * @param {String} sep Separator
 * @returns {String}
 * 
 */
Array.prototype.joinEach = function(id, sep)
{
	var ret = ''
	id = util.trim(id)
	sep = util.trim(sep)
	var c = this.length
	util.forEach(this, function(t, i)
	{
		ret += t[id] + (i < c-1? sep : '')
	})
	return ret
}

Array.prototype.joinAll = function(cb)
{
	var ret = ''
	util.forEach(this, function(t)
	{
		ret += cb(t)
	})
	return ret
}

/**
 * @param {Number} from From, can be omitted
 * @param {Number} to To, can be omitted
 * @param {util.options} opt Options, can be omitted
 * @returns {Object}
 * @example
 * var option = ['optionFoo', 'optionBar', 'optionBaz'].unum()  
 */
Array.prototype.unum = function(from, to, opt)
{
	var ret = {}
	var c = 0
	if(util.isUndef(to) && util.isUndef(from) || ( util.isUndef(to) && from == 1))
	{
		var opt = opt || {}
		opt.optunumFlags = true
		from = 1
		to = Math.pow(2, this.length+1)
	}
	else if(!util.isUndef(from) && util.isUndef(to) && from == 0)
	{
		to = this.length
	}
	var e = util.unum(from, to, opt)
	util.forEach(this, 
		function(p)
		{
			ret[p] = e[c++]
		})
	return ret
}

/**
 * @param {object} ar Array of items 
 * @param {function} cb Function to be called per item
 */
util.forEach = function(ar, cb)
{
	var br = false
	if(util.isFunction(cb) && util.isObject(ar))
	{
		for(var c = 0; c < ar.length; c++)
		{
			var r = cb(ar[c], c)
			if(r === true)
			{
				br = true
				break;
			}
		}
	}
	return br
}

/**
 * @description Finds entries in array by id
 * @param {regexp} name Text to find
 * @param {string} id (Optional) Property to use for matching
 * @returns {Array} Array of objects
 */
Array.prototype.find = function(name, id, opt)
{
	var ret = new Array()
	var opt = opt || ''
	util.forEach(this, function(el)
	{
		if(util.isUndef(id))
		{
			if(String(el).match(RegExp(name, opt)))
				ret.push(el)
		}
		else if(el[id] && String(el[id]).match(RegExp(name, opt)))
		{
			ret.push(el)
		}
	})
	if(ret[0])
		return ret
	return null
}

/**
 * @description Finds entry by name
 * @param {String} name Name 
 * @param {String} id Property
 * @returns {Number} Index
 */
Array.prototype.indexOf = function(name, id)
{
	var ret = false
	util.forEach(this, function(el, i)
	{
		if(util.isUndef(id))
		{
			if(String(el).match(name))
				ret = i
		}
		else if(el[id] && String(el[id]).match(RegExp(name)))
		{
			ret = i
		}
	})
	return ret
}
