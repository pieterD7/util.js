/**
 * 
 */

util.css = {}


/**
 * @param {element} obj Element on page
 * @returns {object} {x:left, y:top}
 */

util.getCumulativeOffset = function(obj) 
{
    var left, top;
    left = top = 0;
    if (obj.offsetParent) 
    {
        do 
        {
            left += obj.offsetLeft;
            top  += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
    var ret = {x : left, y : top}
    return ret
}

/**
 * @description toggles visibility of element
 * @param  {string} sel Selection
 * @param {boolean} b (false => force hide) 
 */

util.toggle = function(sel, b)
{
	if(sel)
	{
		if(util.isBool(b) && b)
			_s(sel).style("display:block;")
		else if((util.isBool(b) && !b) || _s("#sitemap").node.style.display == 'block')
		// b = false or undef : force hide or toggle off			
			_s(sel).style("display:none;")
		else
		// toggle on
			_s(sel).style("display:block;")
	}
}

/**
 * @description gets computed style
 * @param {string} el object
 * @param {string} styleProp style property like 'width'
 * 
 */

util.getStyle = function(el,styleProp)
{
	var x = el;
	if (x.currentStyle)
		var y = x.currentStyle[styleProp];
	else if (window.getComputedStyle)
		var y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
	return y
}	

/**
 * @description get width of screen
 * @returns {Number} width
 */

util.getScreenX = function()
{
	return document.body.clientWidth || document.documentElement.clientWidth	
}

/**
 * @description get height of screen
 * @returns {Number} height
 */

util.getScreenY = function()
{
	return document.body.clientHeight || document.documentElement.clientHeight	
}

/**
 * @description adds space available to the right of the one element with 
 * 	the classname spreadColToMax applied
 * @param {string} sel
 */

util.css.initSpreadColToMax = function(sel)
{
	util.colSel = sel
	var o = _sa(sel)[0]
	if(o)
	{
		util.colWidth = util.getStyle(o, 'width')
		if(window.attachEvent)
			window.attachEvent("onresize", util.css.spreadColToMax)
		else
			window.addEventListener('resize', util.css.spreadColToMax)
		if(_s('.spreadColToMax'))
			util.css.spreadColToMax()
	}
}

util.css.spreadColToMax = function()
{
	var cols = _sa(util.colSel)
	if(cols && cols.length > 1)
	{
		_s('.spreadColToMax').style('width: ' + util.colWidth + ';')
		var _l = util.getScreenX() - (util.getCumulativeOffset(cols[1]).x - parseInt(util.getStyle(cols[0], 'width') || 0))
		var colWidth = util.getCumulativeOffset(cols[1]).x - util.getCumulativeOffset(cols[0]).x 
		
		for(var c = 0; c < cols.length; c++)
		{
			_l -= colWidth
		}
		
		if(_l > 0)
		{
			_s('.spreadColToMax').style(
					'width:' + (_l + colWidth) +  'px;' +
					'max-width:' +  (_l + colWidth ) +  'px;')
		}
	}
	else if(cols && cols.length == 1)
	{
		var _l = util.getScreenX() - util.getCumulativeOffset(cols[0]).x  
		if(_l > 0)
			_s('.spreadColToMax').style(
					'width:' + (_l) +  'px;' +
					'max-width:' +  (_l) +  'px;')
	}	
}

/**
 * @description Experimental
 */
util.css.initStickyTop = function()
{
	if(window.attachEvent)
		window.attachEvent("onresize", util.css.stickyTop)
	else
		window.addEventListener('resize', util.css.stickyTop)	
	util.css.stickyTop()
}

util.hasStickyTop = false
util.oldParentNode = null

util.css.stickyTop = function(e)
{
	var copy = null
	if(util.getScreenX() < 2 * parseInt(util.getStyle(_s('.stickyTop').getNode(), 'width') || 0) && !util.hasStickyTop)
	{
		util.oldParentNode = _s('.stickyTop').node.parentNode
		copy = _s('.stickyTop').node
		var to = document.getElementsByTagName('body')[0]
		to.removeChild(copy)
		to.insertBefore(copy, to.childNodes[0])
		util.hasStickyTop = true		
	}
	else if(util.getScreenX() > 2 * parseInt(util.getStyle(_s('.stickyTop').getNode(), 'width') || 0) && util.hasStickyTop)
	{
		var to = document.getElementsByTagName('body')[0]
		copy = _s('.stickyTop').node
		to.removeChild(_s('.stickyTop').node)
		util.oldParentNode.appendChild(copy)
		util.hasStickyTop = false
		util.css.spreadColToMax()
	}
}
