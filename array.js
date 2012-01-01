/**
 * 
 */

Array.prototype.unique = function(id)
{
	var temp = []
	var _temp = []
	var id = util.isUndef(id) ? false : id
	this.forEach(function(t)
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
Array.prototype.joinEach = function(id, sep)
{
	var ret = ''
	var id = util.trim(id)
	var sep = util.trim(sep)
	var c = this.length
	this.forEach(function(t, i)
	{
		ret += t[id] + (i < c-1? sep : '')
	})
	return ret
}
if(! ('forEach' in Array.prototype))
{
	Array.prototype.forEach = function(action)
	{
		for(var c = 0; c < this.length; c++)
		{
			if(c in this)
			{
				action(this[c], c)
			}
		}
	}
}

/* @return Object */
Array.prototype.unum = function(from, to, opt)
{
	var ret = {}
	var c = 0
	if(util.isUndef(to) && util.isUndef(from) || ( util.isUndef(to) && from == 1))
	{
		var opt = opt || {}
		opt.optunumFlags = true
		from = 1
		to = Math.pow(this.length, 2)
	}
	else if(!util.isUndef(from) && util.isUndef(to) && from == 0)
	{
		to = this.length
	}
	var e = util.unum(from, to, opt)
	this.forEach(
		function(p)
		{
			ret[p] = e[c++]
		})
	return ret
}

Object.prototype.forEach = function(cb)
{
	if(util.isFunction(cb))
	{
		for(var c = 0; c < this.length; c++)
		{
			cb(this[c])
		}
	}
}

//alert([1, 2, 3, 3].unique().join())
//alert([{name:'ik'},{name:'ik'}, {name:'pieter'}].unique('name').joinEach('name', '|'))