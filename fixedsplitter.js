/**
 * @description Fixed splitter splits screen on screen width > splitwidth
 */

util.fixedsplitter = {
	items:[],
	sel:null,
	splitwidth: 800,
	o:null,
	mode:null,
	currentItem:1,
	onDisplayItem:[]
};

(function () {
    "use strict";
    
    util.fixedsplitter.OnDisplayItem = function(cb)
    {
    	this.cb = cb
    }
    
    util.fixedsplitter.Item = function(id, icon, header, html)
    {
    	this.id = id
    	this.icon = icon
    	this.header = header
    	this.html = html
    }
    
    /**
     * @description Example function for assigning data to the fixed splitter
     */
    util.fixedsplitter.initData = function()
    {
    	var myO = util.extend(new util.fixedsplitter.Item(1, '', 'Amsterdam', 'Mooi weertje'), {wheaterUrl:'test.com'})
    	var myO2 = util.extend(new util.fixedsplitter.Item(2, '', 'Londen', 'Raining'), {wheaterUrl:'yahoo.com'})

    	util.fixedsplitter.items.push(myO)
    	util.fixedsplitter.items.push(myO2)
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
    	if(util.fixedsplitter.o)
    	{
    		util.fixedsplitter.display()  			
        	util.fixedsplitter.initOnResize()   	
    	}  
    }
    
    util.fixedsplitter.setMode = function()
    {
    	util.fixedsplitter.mode = 
    		document.documentElement.clientWidth < 
			util.fixedsplitter.splitwidth		
    }
    
    /**
     * @param {Number} nn Id of util.fixedsplitter.Item to be displayed
     * @description Sets display mode and displays the fixed splitter.
     */
    util.fixedsplitter.display = function(nn)
    {
    	var n = nn || util.fixedsplitter.currentItem
    	if(!util.isUndef(nn))
    		util.fixedsplitter.currentItem = n
    	util.fixedsplitter.setMode()
		    	
    	if(util.fixedsplitter.mode && util.isUndef(nn))
		{
    		// List only 
    		var o = util.fixedsplitter.displayList(1, true)
    		util.fixedsplitter.o.setHtml('')
    		util.fixedsplitter.o.appendChild(o.getNode())
		}
		else if(!util.fixedsplitter.mode)
		{
			// List + item
			var o = util.fixedsplitter.displayList(n)   		
    		var oi = util.fixedsplitter.displayItem(n)
    		oi.addClassName('fixedSplitterAnimation')
    		util.fixedsplitter.o.setHtml('')
    		util.fixedsplitter.o.appendChild(o.getNode())
    		util.fixedsplitter.o.appendChild(oi.getNode())
    		setTimeout(function() {
    			oi.style('opacity:1');
    		}, 10);
		}  
		else if(!util.isUndef(nn))
		{
			// Item only		
    		var oi = util.fixedsplitter.displayItem(n, true)
    		util.fixedsplitter.o.setHtml('')
    		util.fixedsplitter.o.appendChild(
    				util.fixedsplitter.showBackButton())
    		util.fixedsplitter.o.appendChild(oi.getNode())			
		}
    }
    
    util.fixedsplitter.onListItemClick = function(n)
    {
    	util.eventHandler(function()
    	{
    	   	var o = util.fixedsplitter.items.find(n, 'id')
        	if(o[0])
        		util.fixedsplitter.display(o[0].id)   		
    	})
    }
    
    util.fixedsplitter.showBackButton = function()
    {
    	var div = util.createElement('div')
    	var o = util.createElement('a')
    	o.setAttribute('href', 'javascript:util.fixedsplitter.display()')
    	o.setHtml(util.lang.btnBack.toFirstCharUppercase())
    	div.appendChild(o)
    	return div.getNode()
    }
    
    util.fixedsplitter.displayList = function(n, b)
    {
    	var o = util.createElement('div')
		if(b)
			// Show inly list
			o.addClassName('fixedSplitterListContainerOnly')
		else
			o.addClassName('fixedSplitterListContainer')			
		util.fixedsplitter.displayListItems(o, n)
		return o
    }
    
    util.fixedsplitter.displayListItems = function(o, n)
    {
    	util.forEach(util.fixedsplitter.items, function(item)
    	{    			
    		var div = util.createElement('div')
      		if(item.id == n)
      		{
      			div.addClassName('fixedSplitterListAnimation')
      			div.addClassName('fixedSplitterActiveListItem')
      			setTimeout(function() {
        			div.style('opacity:1');
        		}, 10);
      		}
      		else
      			div.addClassName('fixedSplitterListItem')
    		var a = util.createElement('a')
    		var ic = null
    		if(!util.trim(item.icon).isEmpty())
    		{
    			ic = util.createElement('img')
    			ic.setAttribute('src', 'uicons/medium/' + item.icon)
    			ic.addClassName('fixedSplitterListIcon')
    		}	
    		a.setHtml(item.header)
    		div.addListener('click', function(){
    			util.fixedsplitter.onListItemClick(item.id)
    		})
    		if(ic)
    			div.appendChild(ic.getNode())
    		div.appendChild(a.getNode())
    		o.appendChild(div)
    	})
   }
    
    util.fixedsplitter.displayItem = function(n, b)
    {
    	var o = util.createElement('div')
    	if(b)
    		o.addClassName('fixedSplitterItemContainerOnly')
    	else
    		o.addClassName('fixedSplitterItemContainer')
		util.fixedsplitter.displayItemContent(o, n)		
		return o 
    }
    
    util.fixedsplitter.displayItemContent = function(o, n)
    {
    	var oo = util.createElement('div')
    	var i = util.fixedsplitter.items.find(n, 'id')
    	if(i)
    		oo.setHtml(i[0].html)
    	o.appendChild(oo.getNode())
    	
    	util.forEach(util.fixedsplitter.onDisplayItem, function(cb)
    	{
    		if(i)
    		{
    			var html = cb(i[0])
    			if(html)
    				o.setHtml(html)
    		}
    		else
    			cb()
    		var br = util.createElement('br')
    		o.appendChild(br.getNode())
    	})
    }
    
    util.fixedsplitter.onresize = function(e)
    {
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
    
	/**
	 * @param {function} cb
	 * @description Sets callback to be called on display item
	 * with an util.fixedsplitter.Item object. The callback can return
	 * an html string to be displayed instead of the deafault.
	 */    
    util.fixedsplitter.setOnDisplayItem = function(cb)
    {
    	if(util.isFunction(cb))
    		util.fixedsplitter.onDisplayItem.push(cb)
    }
})()