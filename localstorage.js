/**
 * @class util.userSettings
 */

(function () {
    "use strict";
    
    /**
     * @description User settings in local storage
     * @param {String} prefix Prefix items with this string
     * @returns {Object}
     */
    util.userSettings = function(prefix)
    {
    	this.prefix = prefix
    	return this
    }

    /**
     * @description Clears all items of this object from local storage
     */
    util.userSettings.prototype.clear = function()
    {
    	for(var i in localStorage)
    	{
    		if(i.match("^" + this.prefix.escapeRegExpSpecialChars()))
    		{
    			delete localStorage[i]
    		}
    	}
    }
    
    /**
     * @description Stores a key with a value
     * @param {Array} ar Array of objects or object with a 'key' and 
     * 'value' property
     */
    util.userSettings.prototype.store = function(ar)
    {
    	var my = this
    	if(ar.length > 0)
    	{
	    	util.forEach(ar, function(a)
	    	{
	    		localStorage.setItem(my.prefix + "." + a.key, a.value)
	    	})
    	}
	    else if(!util.isUndef(ar.key))
	    {
	    	localStorage.setItem(my.prefix + "." + ar.key, ar.value)
	    }
    }
    
    /**
     * @description Get the stored value of a key
     * @param {String} key
     * @returns {String}
     */
    util.userSettings.prototype.get = function(key)
    {
    	return localStorage.getItem(this.prefix + "." + key)
    }
})()