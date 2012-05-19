/**
 * @description Fixed splitter splits screen on screen width > splitwidth
 */

util.fixedsplitter = {
	items:[],
	sel:null,
	splitwidth: 800,
	o:null,
	mode:null,
	currentItem:null,
	toolbar:null
};

(function () {
    "use strict";

	util.fixedsplitter._init = function()
	{
		util.extend(this, util.layout)
		this.toString = function(){return "[util.fixedsplitter] items=" + this.items.length}
	}
    
    /**
     * @param {String} sel Selection
     * @description Inits fixed splitter onresize function and calls 
     * the display function
     */
    util.fixedsplitter.init = function(sel)
    {
    	util.fixedsplitter.sel = sel
    	util.fixedsplitter.o = _s(sel) 
    }
    
    util.fixedsplitter.setMode = function()
    {
    	util.fixedsplitter.mode = 
    		document.documentElement.clientWidth < 
			util.fixedsplitter.splitwidth		
    }
    
    util.fixedsplitter.setToolbar = function(html)
    {
    	util.fixedsplitter.toolbar = html
    }
    
    /**
     * 
     */
    util.fixedsplitter.initDisplay = function(sel)
    {
    	util.fixedsplitter.init(sel)
    	util.fixedsplitter.o.setHtml('')
    	util.fixedsplitter.setMode()
		var div = util.createElement('div')
		if(util.fixedsplitter.mode)
			// Show only list
			div.addClassName('fixedSplitterListContainerOnly')
		else
			div.addClassName('fixedSplitterListContainer')		
		var div3 = util.createElement('div')
		
		var divT = util.createElement('div')
		if(util.fixedsplitter.toolbar)
			divT.setHtml(util.fixedsplitter.toolbar)
		div.appendChild(divT)
    	util.forEach(util.fixedsplitter.items, function(item)
		{
    		if(!util.trim(item.icon).isEmpty())
    		{
    			var ic = util.createElement('img')
    			ic.setAttribute('src', util.iconDir + '/medium/' + item.icon)
    			ic.addClassName('fixedSplitterListIcon')
    		}	
    		var div2 = util.createElement('div')
    		if(item.hidden)
    			div2.replaceStyle('display:none;')
    		
    		if(ic)
    			div2.appendChild(ic)
    		var a = util.createElement('a')
    		a.setAttribute('href', 'javascript:util.fixedsplitter.onListItemClick("' + item.name + '")')
   			a.setHtml(util.lang[item.header] || item.header)
   			var rdiv = util.createElement('div')
    		rdiv.addClassName('fixedSplitterListItemRight')
    		div2.appendChild(rdiv.getNode())
    		
   	    	div2.appendChild(a)
   	    	div2.addListener('click', function()
   	    	{
   	    		util.fixedsplitter.onListItemClick(item.name)
   	    	})
    
    		div2.addClassName('fixedSplitterListItem')
    		div2.addClassName('listItemHeader' + item.name)
			div.appendChild(div2)
			var div4 = util.createElement('div')
			div4.addClassName('fixedSplitterItemContainer')
			div4.setHtml(item.body)
			div4.setAttribute('id', item.name)
			div4.style('display:none;')
			div3.appendChild(div4)
		})
		util.fixedsplitter.o.appendChild(div)
		util.fixedsplitter.o.appendChild(div3)
		util.fixedsplitter.initOnResize()
    }
    
    util.fixedsplitter.hide = function()
    {
    	if(util.fixedsplitter.currentItem)
    	{
    		var o = _s(util.fixedsplitter.sel + ' #' + util.fixedsplitter.currentItem)
        	o.replaceStyle('display:none;')
    	}
    	util.fixedsplitter.currentItem = false
    }
    
    util.fixedsplitter.display = function(n)
    {
    	var fireCB = false
    	var i = util.fixedsplitter.getItem(n)
    	if(util.fixedsplitter.mode && util.isUndef(n))
    	{
        	util.fixedsplitter.hide()
    		util.fixedsplitter.displayList()
    	}
    	else if(util.fixedsplitter.mode && n)
    	{
        	util.fixedsplitter.hide()
    		util.fixedsplitter.displayItem(i.name)
    		fireCB = true
    	}
    	else if(n)
    	{
    		util.fixedsplitter.displayListPlusItem(i.name)
    		util.fixedsplitter.setListItemActive(i)
    		fireCB = true 		
    	}
    	else if(util.fixedsplitter.currentItem)
    	{
    		util.fixedsplitter.displayListPlusItem(util.fixedsplitter.currentItem)
    		util.fixedsplitter.setListItemActive(i)
    		fireCB = true  		
    	}
    	else if(i)
    	{
    		util.fixedsplitter.displayListPlusItem(i.name)
      		util.fixedsplitter.setListItemActive(i)  		
    		fireCB = true  		
    	}
    	util.fixedsplitter.o.replaceStyle('display:block;')
    	if(fireCB)
    	{
	    	util.forEach(util.fixedsplitter.cb, function(cb)
	    	{
	    		cb(i)
	    	})
    	}
    }
    
    util.fixedsplitter.displayList = function()
    {
    	util.fixedsplitter.hide()
  	
    	var o = _s(util.fixedsplitter.sel + ' div')
    	if(o)
    	{
			o.replaceStyle('display:block;')
    	}
    	util.fixedsplitter.currentItem = false
    }
    
    util.fixedsplitter.displayListPlusItem = function(n)
    {
    	var oldBut = _s('.backBtn')
    	if(oldBut)
    		oldBut.node.parentNode.removeChild(oldBut.node)
    	var o = _s(util.fixedsplitter.sel + ' div')
		if(o)
			o.replaceStyle('display:block;')
    	var o = _s(util.fixedsplitter.sel + ' #' + n)
    	if(o)
    	{
        	util.fixedsplitter.hide()    		
    		o.replaceStyle('display:block;')
        	util.fixedsplitter.currentItem = n 		
    	}    	
    }
    
    util.fixedsplitter.displayItem = function(n)
    {
    	util.fixedsplitter.currentItem = n 	
    	var o = _s(util.fixedsplitter.sel + ' #' + n)
    	if(o && o.node.childNodes[0])
    	{
    		o.node.insertBefore(util.fixedsplitter.showBackBtn(),o.node.childNodes[0])
    		o.replaceStyle('display:block;')
    	}
    }
    
    util.fixedsplitter.setListItemActive = function(i)
    {
		var o = _s('.fixedSplitterActiveListItem')
		if(o)
		{
			o.removeClassName('fixedSplitterActiveListItem')
			o.addClassName('fixedSplitterListItem')
		}
    	var oo = _s('.listItemHeader'+i.name)
    	oo.addClassName('fixedSplitterActiveListItem')
    	oo.removeClassName('fixedSplitterListItem')
    }
    
    util.fixedsplitter.onListItemClick = function(n)
    {
    	util.eventHandler(function()
    	{  	
			if(util.fixedsplitter.mode)
			{
				var o = _s(util.fixedsplitter.sel + ' div')
				if(o)
					o.replaceStyle('display:none;')
			}

    	   	var o = util.fixedsplitter.items.find(n, 'name')
        	if(o && o[0])
        		util.fixedsplitter.display(o[0].name)   		
    	})
    }
    
    util.fixedsplitter.showBackBtn = function()
    {
    	var oldBut = _s('.backBtnI')
    	if(oldBut)
    		oldBut.node.parentNode.removeChild(oldBut.node)
    	var div = util.createElement('div')
    	var o = util.createElement('a')
    	div.addClassName('backBtnI')
    	o.addClassName('backBtn')
    	o.setAttribute('href', 'javascript:util.fixedsplitter.display()')
    	o.setHtml(util.lang.btnBack.toFirstCharUppercase())
    	div.appendChild(o)
    	return div.getNode()
    }
    
    util.fixedsplitter.onresize = function(e)
    {
    	var m = util.fixedsplitter.mode
    	util.fixedsplitter.setMode()
    	if(m != util.fixedsplitter.mode)
    		util.fixedsplitter.display()
    }
    
    util.fixedsplitter.initOnResize = function()
    {
    	if(window.attachEvent)
    		window.attachEvent("onresize", 
    		util.fixedsplitter.onresize)
    	else if(window.addEventListener)
    		window.addEventListener('resize', 
    		util.fixedsplitter.onresize)	
    }
    
})()