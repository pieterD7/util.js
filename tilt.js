/**
 * @class util.tilt
 * @description Restores form data on loading the same page as 
 * last page. Forms need to have an attribute 'name' set to 
 * something. Form fields can have an attribute 'ontilt' set 
 * to 'no-restore' to prevent values to be restored from saved 
 * data. If a field has a value nothing is restored.
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
    	util.tilt.userSet.clear()
    	
    	// Set last url
    	util.tilt.userSet.store([{key:'lastUrl', value:document.location.href}])
    	
    	// Get all form data
      	var fd = util.tilt.getAllFormsData()
      	
      	// Store set
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
            		util.tilt.setValue(inp, data)

        		})
        		inps = _sa('form[name=' + f.name + '] select')
        		util.forEach(inps, function(inp)
        		{
            		var data = util.tilt.userSet.get(f.name + '_' + inp.name )
            		util.tilt.setValue(inp, data)
        		})       		
	    	})
    	}
    }
    
    util.tilt.setValue = function(inp, data)
    {
		var i = new HTMLElement(inp)      		   	
    	// Check ontilt attribute
		if(!util.isUndef(i.node.getAttribute('ontilt')) && 
			i.node.getAttribute('ontilt') != 'no-restore')
			
			// If no data
    		if(!util.trim(data).isEmpty())
    			
        		// Set value
    			if(String(i.val()).isEmpty())
        			i.val(data)   	
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
    		dataInp = _sa('form[name=' + f.getAttribute('name') + '] select')
    		util.forEach(dataInp, function(inp)
    		{
    			ar.push({key:f.getAttribute('name') + '_' + inp.name, value:inp.value})
    		})  		
    	})
    	return ar
    }

})()

util.prepare(function()
{
	util.tilt.onAfterLoad()
	if(window.attachEvent)
		window.attachEvent("onbeforeunload", util.tilt.onBeforeUnLoad)
	else if(window.addEventListener)
		window.addEventListener('beforeunload', util.tilt.onBeforeUnLoad)		
	
})