/**
 * @class
 * @name util.datePicker
 * @description Data for datePicker 
 */
util.datePicker = {
	dPickers:[],
	dataFormat:'YYYY-MM-DD',
	flags:[],
	options:null
};

(function () {
    "use strict";

	/**
	 * @constructor
	 * @name util._datePicker
	 */
	util._datePicker = function()
	{
		return this
	}
	
	
	/**
	 * @field
	 * @name util.datePicker._init
	 */
	util.datePicker._init = function()
	{
		/**
		 * @field
		 * @description Avalaible flags:
		 * 1 expand Drop down list or click to increment/decrement
		 * 2 incrementworkday Only valid without expand, skips holidays on increment with showholidays
		 * 3 showholidays Show holidays in dropdown, eg of util.holidays.list 
	     * 4 expandtoholidayformat Expand to util.locale.datePickerHolidayFormat if applicable
		 * 5 expandenabledrag Enables dropdown list to be scrolled by dragging on mobile devices
		 * 6 expandshowweeknumber Shows weeknumber column in dropdown list
		 */
		this.flags =
			
		[ 'expand',	// Drop down list or click to increment/decrement
		 'incrementworkday', // Only valid without expand, skips holidays on increment with showholidays
		 'showholidays', // Show holidays in dropdown, eg of util.holidays.list 
	     'expandtoholidayformat',	// Expand to util.locale.datePickerHolidayFormat if applicable
		 'expandenabledrag',	// Enables dropdown list to be scrolled by dragging on mobile devices
	     'expandshowweeknumber' // Shows weeknumber column
		  ].unum()
		 /**
		  * @field
		  * @type util.options
		  * 
		  */ 
		this.options = new util.struct([util.options], {value:0})
	}
	
	util._datePicker.prototype.valueToDate = function()
	{
		var val = this.data.date
		if(String(val).isEmpty())
			this.data.date = new Date()
		
		if( isNaN(this.data.date.getMonth()))
			throw(util.error(util.defaultStrings.error.error_invalidnodevalue))
		this.data.node.value = this.data.date.format(util.locale.datePickerDateFormat)
		this.data.format = util.locale.datePickerDateFormat
	}
	
	util._datePicker.prototype.createMonthRow = function(id)
	{
		var mdiv = util.createElement('div')
		mdiv.addClassName('datePickerSelectedMonth')
		if(!util.isTouchDevice)
		{
			var sp0 = util.createElement('span')
			var a1 = util.createElement('a')
			a1.setAttribute('href', 'javascript:util.datePicker.prevMonth(' + id + ')')
			a1.setHtml("[-]")
			sp0.appendChild(a1)
			mdiv.appendChild(sp0)
		}
		var sp1 = util.createElement('span')
		sp1.setHtml(this.data.date.format("M").toUpperCase())
		mdiv.appendChild(sp1)
		if(!util.isTouchDevice)
		{
			var sp0 = util.createElement('span')
			var a1 = util.createElement('a')
			a1.setAttribute('href', 'javascript:util.datePicker.nextMonth(' + id + ')')			
			a1.setHtml("[+]")
			sp0.appendChild(a1)
			mdiv.appendChild(sp0)			
		}	
		return mdiv
	}
	
	util._datePicker.prototype.displayWeeks = function(id)
	{
		var ret = util.createElement('div')
		ret.addClassName('datePickerContainer')
		
		var div = util.createElement('div')
		div.addClassName('datePickerSelector')
		var selectVal = this
		div.addListener('click', function(e)
		{
			e.preventDefault()
			selectVal.hide()
		})	
		div.setHtml(this.data.date.format(util.locale.datePickerSelectFormat).toUpperCase())
		ret.appendChild(div.node)
		
		ret.appendChild(div.node)
		
		var mdiv = this.createMonthRow(id)
		ret.appendChild(mdiv)
		
		for(var c = 0; c < 6; c++)
		{
			var d = util.createElement('div')
			d.setAttribute('class', 'datePickerRow')
			var start = null
			util.datePicker.options.get(util.datePicker.flags.expandshowweeknumber)? start = 0 : start = 1;
			for(var cc = start; cc < 8; cc++)
			{
				var dd = util.createElement('div')
				dd.setAttribute('class', 'datePickerDay')
				if(c == 0)
				{
					if(cc > 0)
					{
						dd.setHtml(util.defaultStrings.daysshort[cc-1].toUpperCase())
					}
					else
					{
						dd.setHtml('&nbsp;')
						dd.addClassName('datePickerDayBreak')			
					}
					dd.addClassName('datePickerHeaderDay')
					d.appendChild(dd.node)
				}
				else if(cc > 0)
				{
					dd.addClassName('datePickerDaySelect')
					var offset =(c-1)*7+cc-this.data.date.getDay()-7
					dd.setHtml(
							new Date(this.data.date.getFullYear(), this.data.date.getMonth(), this.data.date.getDate()+offset)
						.getDate())
					if(offset == 0)
					{
						dd.addClassName('datePickerSelectedDay')
					}
					d.appendChild(dd.node)
				}
				else 
				{
					dd.addClassName('datePickerDaySelect datePickerDayBreak')
					dd.setHtml(new Date(this.data.date.getFullYear(), this.data.date.getMonth(), this.data.date.getDate()+(c-1)*7).getWeek(1))
					d.appendChild(dd.node)
				}
			}
			ret.appendChild(d.node)		
		}
	
		return ret.node
	}
	
	util._datePicker.prototype.display = function(id)
	{
		var div = util.createElement('div')
		this.data.state = 'open'
		var pos = util.getCumulativeOffset(this.data.node)
	
		div.setHtml('')
		div.appendChild(this.displayWeeks(id))
		
		div.style("position:absolute;left:" + pos.x + "px;top:" + pos.y + 
				"px;width:" + document.defaultView.getComputedStyle(this.data.node,"").getPropertyValue("width") +
				";min-height:" + document.defaultView.getComputedStyle(this.data.node,"").getPropertyValue("height") + 
				";");
		div.setAttribute('class', 'datePickerBackground')
		div.setAttribute('draggable', "true")
		_s('body').appendChild(div.node)
	
		var my = this
		util.forEach(_sa(".datePickerDaySelect"), function(el)
		{
			el.addEventListener("click", function()
			{
				// select day
				my.data.date = new Date(my.data.date.getFullYear(), my.data.date.getMonth(), el.innerHTML)
				_s('body').node.removeChild(_s('body').node.lastChild)									
				my.display()
			})
		})	
		if(util.datePicker.options.get(
				util.datePicker.flags.expandenabledrag))
		{
			var my = this
			util.eventHandler(function()
			{
				var xpos1 = null, xpos2 = null
				div.addListener("dragstart", function(e)
				{
					var pos = util.eventObjectToPos(e)
					xpos1 = pos.x
				})		
				div.addListener("dragend", function(e)
				{
					var pos = util.eventObjectToPos(e)
					xpos2 = pos.x
					if(xpos2 > xpos1)
					{
						my.data.date = new Date(
								my.data.date.getFullYear(), 
								(Number(my.data.date.getMonth()) - 1),
								my.data.date.getDate()
						)
						_s('body').node.removeChild(_s('body').node.lastChild)					
						my.display()
					}
					else if(xpos1 > xpos2)
					{
						my.data.date = new Date(
								my.data.date.getFullYear(), 
								(Number(my.data.date.getMonth()) + 1),
								my.data.date.getDate()
						)
						_s('body').node.removeChild(_s('body').node.lastChild)					
						my.display()					
					}
				})
			})
		}	
	}
	
	util._datePicker.prototype.hide = function()
	{
		if(this.data.state == 'open')
		{
			this.data.state = 'closed'
			this.valueToDate()
			_s('body').node.removeChild(_s('body').node.lastChild)
			this.data.node.setAttribute('style', 'display:inline;')
		}
	}

	util.datePicker.nextMonth = function(i)
	{
		util.eventHandler(function()
		{
			var dp = util.datePicker.dPickers[i]
			dp.data.date = new Date(
					dp.data.date.getFullYear(), 
					(Number(dp.data.date.getMonth()) + 1),
					dp.data.date.getDate()
			)
			_s('body').node.removeChild(_s('body').node.lastChild)					
			dp.display(i)				
		})	
	}
	
	util.datePicker.prevMonth = function(i)
	{
		util.eventHandler(function()
		{		
			var dp = util.datePicker.dPickers[i]
			dp.data.date = new Date(
					dp.data.date.getFullYear(), 
					(Number(dp.data.date.getMonth()) - 1),
					dp.data.date.getDate()
			)
			_s('body').node.removeChild(_s('body').node.lastChild)					
			dp.display(i)
		})
	}

	/**
	 * @name util.datePicker.initInputTypeDate
	 * @function
	 * @description Function to be called in ready-function initializing datepickers
	 * @example
	 * 	util.datePicker.options.set(
			[util.datePicker.flags.expand]
		)
		util.datePicker.initInputTypeDate()
	 */
	util.datePicker.initInputTypeDate = function(sel)
	{
		var inps = _sa(sel)
		util.forEach(inps, function(obj)
		{
			var obj2 = new HTMLElement(obj)
			var options = new util.struct([util.options], {value:util.datePicker.options.data.value})
			var dp = new util.struct(
				[util._datePicker], 
				{	node:obj, 
					id:util.datePicker.dPickers.length,
					value:obj.value,
					state:'closed', 
					date:null, 
					options:options,
					format:util.locale.datePickerDateFormat,
					formatshort:util.locale.datePickerDateFormatShort})
			
			//dp.valueToDate()
			if(	!String(obj2.value).isEmpty() && 
				dp.data.options.get(util.datePicker.flags.expand) && 
				!dp.data.options.get(util.datePicker.flags.expandonfocus))
				obj2.value = dp.data.date.format(dp.data.format).toUpperCase()
			util.datePicker.dPickers.push(dp)
			obj2.getNode().setAttribute('rel', util.datePicker.dPickers.length)
	
			obj2.addListener('focus', function()
			{
				util.forEach(util.datePicker.dPickers, function(dp)
				{
					dp.hide()
				})
				var my = this
				util.eventHandler(function()
				{
					var d = my.getAttribute('rel')
					var dp = util.datePicker.dPickers[d-1]
	
					if(dp.data.state == 'closed')
					{
						if(String(dp.data.value).isEmpty())
						{
							if(!dp.data.date)
							{
								dp.data.date = new Date()
							}
							
						}
						dp.display(dp.data.id)
					}
				})
			})
		})
	}
})()

util.prepare(function()
{	
	util.datePicker.options.set(
		[util.datePicker.flags.expand, 
		 util.datePicker.flags.expandenabledrag,
		 util.datePicker.flags.expandshowweeknumber]
	)	
})

util.ready(function()
{

})