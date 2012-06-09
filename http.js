(function () {
    "use strict";
 	
	/**
	 * @constructor
	 * @property {function} onSuccess 	Function called on http data
	 * @property {function} onError 	Function called on no http connection
	 * @property {String} 	method 		Type of http connection (GET/POST/PUT/DELETE/HEAD)
	 * @property {Array} 	data 		Object with properties to be sent
	 * @property {String} 	dataType 	Parse data as (xml, json, text)
	 */
	util.ajaxParams = function()
	{
		this.onSuccess = null
		this.onError = null
		this.method = 'GET'
		this.data = null
		this.dataType = 'text'
	}
	
	/**
	 * @param {util.ajaxParams} obj
	 */
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
		if(method.match(/GET|PUT|DELETE|HEAD/i) && vars)
		{
			url += '?' + vars
		}
		var as =  obj.async ? obj.async : false
		http.open(method, url, as)
		http.onreadystatechange = function()
		{
			if(http.readyState == 4 &&  http.status == 200)
			{
				if(util.isFunction(obj.onSuccess))
					if(util.isUndef(obj.dataType) || obj.dataType.match(/text/i))
						obj.onSuccess(http.responseText)
					else if(obj.dataType.match(/json/i))
						obj.onSuccess(util.toJson(http.responseText))
					else if(obj.dataType.match(/xml/i))
						obj.onSuccess(util.toXml(http.responseText))
			}
			else if(http.readyState == 4)
			{
	
				if(util.isFunction(obj.onError))
					obj.onError({status:http.status})
			}
	
		}
		if(method.match(/GET|PUT|DELETE|HEAD/i))
		{
			http.send()
		}
		else
			http.send(vars)
	}
})()
