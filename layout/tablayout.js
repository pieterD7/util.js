/**
 * @class tablayout
 * @name util.tablayout
 * @description Tab layout
 * @example
  		<div id='tablayout'>
  		<!-- Three sample tabs (one hidden) -->	
  			<div>INTRO</div>
			<div>DEMO</div>
			<div style='display:none'>someTab</div>
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
			util.tablayout.initFromHtml('#tablayout')
			util.tablayout.display(1)			
		})
		</script>
 */

util.tablayout = 
{
	sel:null,
	activeTab:0,
	items:[],
	cb:[]
};

(function()
{
	util.tablayout._init = function()
	{
		var m = new util.menu()
		m.registerMenuHandler(
				{name:'util.tablayout.display',
				cb:function(param){util.tablayout.display(param)}})		

		util.extend(this, util.layout)
		this.toString = function(){return "[util.tablayout] items=" + this.items.length}
	}

	util.tablayout.initDisplay = function(sel)
	{
		var o = _s(sel || util.tablayout.sel) 
		if(o)
		{
			util.tablayout.sel = sel || util.tablayout.sel
			o.setHtml('')

			var i = util.tablayout.getItem()
			_s(util.tablayout.sel)
				.appendChild(util.tablayout.displayHeader(i.name))
			util.forEach(util.tablayout.items, function(item)
			{
				var div = util.createElement('div')
				div.addClassName('itemBody')
				div.setAttribute('id', item.name)
				div.setHtml(item.body)
				div.style('display:none;')
				_s(util.tablayout.sel).appendChild(div)
			})
			_s(util.tablayout.sel).replaceStyle('display:block;')
		}
	}
	
	/**
	 * @description Displays a util.content.ContentItem 
	 */
	util.tablayout.display = function(id)
	{
		var i = util.tablayout.getItem(id)
		_s(util.tablayout.sel).removeChild(_s('.itemHeader').getNode())
		_s(util.tablayout.sel).getNode()
			.insertBefore(util.tablayout.displayHeader(i.name).getNode(), _s(util.tablayout.sel).getNode().firstChild)
		var ar = _sa(util.tablayout.sel + ' .itemBody')
		util.forEach(ar, function(d)
		{
			var dd = new HTMLElement(d)
			dd.replaceStyle('display:none;')
		})
		var ii = _s(util.tablayout.sel + ' div#' + i.name)
		ii.replaceStyle('display:block;')
		util.forEach(util.tablayout.cb, function(cb)
		{
				cb(i)
		})
	}
	
	util.tablayout.displayHeader = function(activeTab)
	{
		var div = util.createElement('div')
		div.addClassName('itemHeader')
		util.forEach(util.tablayout.items, function(item, i)
		{
			if(item.hidden) return
			
			var sp = util.createElement('span')
			var a = util.createElement('a')
			if(item.name.equals(activeTab))
			{
				a.setAttribute('href','javascript:void(0)')
			}
			else
			{
				a.setAttribute('href', 
					'javascript:util.follow("javascript:util.tablayout.display:' + (item.name) + '")')
			}
			if(!item.isFromHtml)
			{
				a.addClassName(item.cssItemHeader)
			}
			a.setHtml(item.header)
			sp.appendChild(a)
			div.appendChild(sp)
		})
		return div
	}
	
})()
