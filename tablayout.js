/**
 * @class tablayout
 * @name util.tablayout
 * @description Tab layout
 * @example
  		<div id='tablayout'>
  		<!-- Three sample tabs (one hidden) -->	
  			<div>INTRO</div>
			<div>DEMO</div>
			<div style='display:none'><a>someTab</a></div>
			<div>
				<div><p>Sample text1</p></div>
			</div>
			<div>
				<div><p>Sample text2</p></div>
			</div>
			<div>
				<!-- hidden tab shown by util.tablayout.showTab(3) -->
				<div id='someID'></div>
			</div>
		</div>
		<script type='text/javascript'>
		util.ready(function()
		{
			util.tablayout.init('#tablayout')
			util.tablayout.showTab(1)			
		})
		</script>
 */

util.tablayout = 
{
	sel:null,
	numberOfTabs:0, // Hidden tabs (tab itself not visible 
					// when tab is hidden) excluded
	activeTab:0
};

(function()
{
	/**
	 * @function til.tablayout.init
	 * @param {String} sel Selection
	 * @description init class and show tabs without tab content
	 * 
	 */
	util.tablayout.init = function(sel)
	{
		util.tablayout.sel = sel
		util.tablayout.initHeader()
	}
	
	/**
	 * @function util.tablayout.initHeader
	 * @description init tabs from html and calculates number of tabs
	 */
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
						"javascript:util.follow('javascript:util.tablayout.showTab:" + ++t + "')")
					l.setHtml('')
					l.appendChild(a)
					l.style('float:left;display:block')
				}
			}
		})
		util.tablayout.numberOfTabs = t	
	}
	
	/**
	 * @function util.tablayout.showTab
	 * @param {Number} which Tab to be shown
	 * @description Iterates through the html divs and shows 
	 * one of the divs of the second half and assigns css 
	 * class activeTab to one div of the first part and shows 
	 * this one.  
	 */
	util.tablayout.showTab = function(which)
	{
		// Hide hidden tab
		if(util.tablayout.activeTab > util.tablayout.numberOfTabs)
		{
			if(util.tablayout.activeTab > 0)
			{
				var t = _s(util.tablayout.sel).getNode()
					.childNodes[(util.tablayout.activeTab - 1) * 2 + 1]
				var ch = new HTMLElement(t)
				ch.style('display:none')
			}
		}	
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
						util.tablayout.activeTab = iii
						child.addClassName("activeTab")
						child.style("display:block;float:left;")
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
