/**
 * 
 */

(function () {
    "use strict";
    
    util.userSettings = function(prefix)
    {
    	this.prefix = prefix
    	return this
    }

    util.userSettings.prototype.store = function(ar)
    {
    	var my = this
    	util.forEach(ar, function(a)
    	{
    		localStorage.setItem(my.prefix + "." + a.key, a.value)
    	})
    }
    util.userSettings.prototype.get = function(key)
    {
    	return localStorage.getItem(this.prefix + "." + key)
    }
})()