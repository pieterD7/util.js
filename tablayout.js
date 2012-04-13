/**
 * 
 */

util.tablayout = 
{
	sel:null	
};

(function()
{
	util.tablayout.init = function(sel)
	{
		util.tablayout.sel = sel
		util.tablayout.initHeader()
	}
	
	util.tablayout.initHeader = function()
	{
		var t = 0
		var n = _s(util.tablayout.sel).getNode().childNodes.length
		util.forEach(_s(util.tablayout.sel).getNode().childNodes, function(el, i)
		{
			var l = new HTMLElement(el)
			if(i <= n / 2)
			{
				if(el.nodeName == '#text')
				{
					return
				}
				else if(l.node.style.display != 'none')
				{
					var a = util.createElement('a')
					a.addClassName('tabLink')
					a.setHtml(el.innerHTML);
					a.setAttribute('href', 
						'javascript:util.tablayout.showTab(' + ++t + ')')
					l.setHtml('')
					l.appendChild(a)
					l.style('float:left;display:block')
				}
			}
		})
	}
	
	util.tablayout.showTab = function(which)
	{
		var ii = 0;
		var iii = 0;
		var ca = _s(util.tablayout.sel).getNode().childNodes
		var cl = ca.length
		util.forEach(ca, function(ch, i)
		{
			var child = new HTMLElement(ch)
			if(i < cl / 2)
			{
				if(ch.nodeName != '#text')
				{
					iii++
					if(iii == which)
					{
						child.addClassName("activeTab")
					}
					else
						child.removeClassName("activeTab")
				}
			}
			else if(ch.nodeName != '#text')
			{
				ii++
				if(ii == which)
				{
					child.style('display:block;clear:left;')
				}
				else
				{
					child.style('display:none')
				}				
			}
		})
		_s(util.tablayout.sel).style("display:block")
	}
})()
