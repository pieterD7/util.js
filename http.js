/**
 * 
 */

util.HttpStatus = function(uri, cb)
{
	var opt = {
		url: uri,
		onError: function(err)
		{
			cb(err.status)
		},
		onSuccess: function()
		{
			cb(200)
		}
	}
	this.ajax(opt)
}

util.ajax = function(obj)
{
	if(this.isUndef(obj)) return
		
	var url = obj.url
	var method = this.isString(obj.method) ? obj.method : 'GET'
		
	var http = new XMLHttpRequest();
	var vars = null
	
	if(!this.isUndef(obj.data))
	{
		vars = '';
		for(var i in obj.data)
		{
			vars += i + '=' + obj.data[i] + '&'
		}
	}
	if(method.match(/GET/i))
	{
		url += '?' + vars
	}
	http.open(method, url, true)
	http.onreadystatechange = function()
	{
		if(http.readyState == 4 &&  http.status == 200)
		{
			if(util.isFunction(obj.onSuccess))
				if(util.isUndef(obj.dataType) || obj.dataType.match(/text/i))
					obj.onSuccess(http.responseText)
				else if(obj.dataType.match(/json/i))
					obj.onSuccess(toJson(http.responseText))
				else if(obj.dataType.match(/xml/i))
					obj.onSuccess(toXml(http.responseText))
		}
		else if(http.readyState == 4)
		{
			if(isFunction(obj.onError))
				obj.onError({status:http.status})
		}
	}
	if(method.match(/GET/i))
	{
		http.send()
	}
	else
		http.send(vars)
}