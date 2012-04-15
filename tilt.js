/**
 * @class util.tilt
 * @description Restores form data of its input fields of forms with an 
 * attribute name on page reload
 */

util.tilt = {
	userSet:null	
};

(function () {
    "use strict";
    
    util.tilt._init = function()
    {
    	util.tilt.userSet = new util.userSettings('lastPageData')
    }
    
    util.tilt.onBeforeUnLoad = function()
    {
    	// Clear old data
 //   	util.tilt.userSer.store()
    	// Set last url
    	util.tilt.userSet.store([{key:'lastUrl', value:document.location.href}])
    	
    	// Get all form data
      	var fd = util.tilt.getAllFormsData()
      	util.tilt.userSet.store(fd) 
    }
    
    util.tilt.onAfterLoad = function()
    {
    	var test = util.tilt.getAllFormsData()
    	// Is reload?
    	if(util.tilt.userSet.get('lastUrl') == document.location.href)
    	{
        	var fd = _sa('form') 		
        	util.forEach(fd, function(f, i)
	    	{
        		var inps = _sa('form[name=' + f.name + '] input')
        		util.forEach(inps, function(inp)
        		{
            		var data = util.tilt.userSet.get(f.name + '_' + inp.name )
            		// for date fields padd format
            		var i = new HTMLElement(inp)
            		if(i.node.getAttribute('type') != 'codate')
            			i.val(data)
        		})
	    	})
    	}
    }
    
    util.tilt.getAllFormsData = function()
    {
    	var ar = []
    	var fd = _sa('form')
    	util.forEach(fd, function(f, i)
    	{
    		var dataInp = _sa('form[name=' + f.getAttribute('name') + '] input')
    		util.forEach(dataInp, function(inp)
    		{
    			ar.push({key:f.getAttribute('name') + '_' + inp.name, value:inp.value})
    		})
    	})
    	return ar
    }

})()

util.ready(function()
{
	util.tilt.onAfterLoad()
	if(window.attachEvent)
		window.attachEvent("onbeforeunload", util.tilt.onBeforeUnLoad)
	else if(window.addEventListener)
		window.addEventListener('beforeunload', util.tilt.onBeforeUnLoad)		
	
})