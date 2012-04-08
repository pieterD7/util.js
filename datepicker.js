/**
 * @class
 * @name util.datePicker
 * @description Data for datePicker 
 */
util.datePicker = {
	offsetWorkdays:0,
	dPickers:[],
	tnode:null,
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
		 * 1 expand Drop down list or click to 
		 * increment/decrement
		 * 2 incrementworkday Only valid without 
		 * expand, skips holidays on increment 
		 * with showholidays
		 * 3 showholidays Show holidays in dropdown, 
		 * eg of util.holidays.list 
	     * 4 enableholidayformat Display as 
	     * to util.locale.datePickerHolidayFormat 
	     * if applicable
		 * 5 expandenabledrag Enables dropdown 
		 * list to be scrolled by dragging 
		 * 6 expandshowweeknumber Shows weeknumber 
		 * column in dropdown list
		 * 7 expandselectmultiple Select one or 
		 * more colon separated dates
		 * 8 allowdatesbeforenow Allow input of 
		 * dates before now 
		 * 9 allowtyping Allow user to type a 
		 * date value
		 */
		this.flags =
		[ 
		  // Drop down list or click to increment/decrement
		  'expand',
		  
		  // Only valid without expand, skips holidays on 
		  // increment with showholidays
		 'incrementworkday', 			

		 // Show holidays in dropdown, eg of util.holidays.list 
		 'showholidays',

		 // Display as util.locale.datePickerHolidayFormat 
		 // if applicable 
		 // 'enableholidayformat',	
		 
		 // Enables dropdown list to be scrolled by dragging 
		 'expandenabledrag',	 
		 
		 // Shows weeknumber column
	     'expandshowweeknumber',
	     
	     // Select one or more colon separated dates	     
	     // 'expandselectmultiple', 	

	     // Allow input of dates before now
	     'allowdatesbeforenow', 	// Fix holiday optelsom	
	     
	     // Allow text input as with type=text
	     'allowtyping'
	     
		  ].unum();
		  
		  
		 /**
		  * @field
		  * @type util.options
		  * 
		  */ 
		this.options = new util.struct([util.options], {value:0})
	}
	
	util.datePicker.valueToDate = function(val)
	{
		var d = new Date(String(val).toDate(util.datePicker.dataFormat))
		if(isNaN(d.getMonth()))
			throw(util.error(util.defaultStrings.error.error_invalidnodevalue))
		return d
	}
	
	util._datePicker.prototype.valueToDate = function()
	{
		var val = this.data.date
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
			a1.setHtml("<<")
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
			a1.setHtml(">>")
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
			if (e.preventDefault) e.preventDefault(); 
            if (e.stopPropagation) e.stopPropagation(); 
			selectVal.hide()
		})	
		div.setHtml(this.data.date.format(util.locale.datePickerSelectFormat).toUpperCase())
		var delAnc = util.createElement('span')
		delAnc.setHtml(" [X]")
		delAnc.addListener('click', function(e)
		{
			 if (e.preventDefault) e.preventDefault(); 
             if (e.stopPropagation) e.stopPropagation(); 
		})
		div.appendChild(delAnc)
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
					
					var day = null
					this.data.date.getDay() == 0? day = 7 : day = this.data.date.getDay()
					var offset =(c-1)*7+cc-day
					var dday = new Date(this.data.date.getFullYear(), this.data.date.getMonth(), this.data.date.getDate()+offset)
					dd.setAttribute('rel', dday.getMonth() + 1)
					dd.setHtml(
						dday.getDate())
						
					// is holiday?
					if(this.data.options.get(util.datePicker.flags.showholidays))
					{
						util.forEach(util.holidays.list, function(holi)
						{
							if(	dday.getFullYear() == holi.date.from.year && 
								dday.getMonth()+1 == holi.date.from.month &&
								dday.getDate() == holi.date.from.day)
							{	
								dd.addClassName("holiday")
								dd.setAttribute('title', holi.name.toFirstCharUppercase())
							}
						})	
					}
					if(offset == 0)
					{
						dd.addClassName('datePickerSelectedDay')
					}
					d.appendChild(dd.node)
				}
				else 
				{
					dd.addClassName('datePickerDaySelect datePickerDayBreak')
					dd.setHtml(new Date(this.data.date.getFullYear(), this.data.date.getMonth() - 1, this.data.date.getDate()+(c-1)*7).getWeek(1))
					d.appendChild(dd.node)
				}
			}
			ret.appendChild(d.node)		
		}
	
		return ret.node
	}
	
	util._datePicker.prototype.displayClickable = function(id)
	{
		var el = util.createElement('a')
		var im = util.createElement('img')
		im.setAttribute('src', util.getBaseUrl() + '../icons/medium/min.png')
		el.appendChild(im)
		el.setAttribute('href', 'javascript:util.datePicker.prevDay(' + id + ')')
		el.addClassName("datePickerMin")
		util.datePicker.dPickers[id].tnode.node.parentNode.insertBefore(
				 el.node,util.datePicker.dPickers[id].tnode.node
		)
		el = util.createElement('a')
		var im = util.createElement('img')
		im.setAttribute('src', util.getBaseUrl() + '../icons/medium/plus.png')		
		el.appendChild(im)
		el.setAttribute('href', 'javascript:util.datePicker.nextDay(' + id + ')')
		el.addClassName("datePickerPlus")		
		
		util.datePicker.dPickers[id].tnode.node.parentNode.insertBefore(
				 el.node, util.datePicker.dPickers[id].tnode.node.nextSibling)
	}
	
	util._datePicker.prototype.display = function(id)
	{
		var div = util.createElement('div')
		this.data.state = 'open'
		var pos = util.getCumulativeOffset(this.data.node)
	
		div.setHtml('')
		div.appendChild(this.displayWeeks(id))
		
		div.style("position:absolute;left:" + pos.x + "px;top:" + pos.y + 
				"px;width:" + window.getComputedStyle(this.data.node,"").getPropertyValue("width") +
				";min-height:" + window.getComputedStyle(this.data.node,"").getPropertyValue("height") + 
				";");
		div.setAttribute('class', 'datePickerBackground')
		div.setAttribute('draggable', "true")
		_s('body').appendChild(div.node)
	
		var my = this
		util.forEach(_sa(".datePickerDaySelect"), function(_el)
		{
			var el = new HTMLElement(_el)
			el.addListener("click", function()
			{
				// select day
				var dd = new Date(my.data.date.getFullYear(), el.node.getAttribute('rel') - 1, el.node.innerHTML)
				if(my.data.options.get(util.datePicker.flags.allowdatesbeforenow) || 
					dd > new Date())
				{
					my.data.date = dd
					_s('body').node.removeChild(_s('body').node.lastChild)									
					my.display(id)
				}
			})
		})	
		if(util.datePicker.options.get(
				util.datePicker.flags.expandenabledrag))
		{
			var my = this
			util.eventHandler(function()
			{
				var xpos1 = null, xpos2 = null
				var ypos1 = null, ypos2 = null
				div.addListener("dragstart", function(e)
				{
					var pos = util.eventObjectToPos(e)
					xpos1 = pos.x
					ypos1 = pos.y
				})		
				div.addListener("dragend", function(e)
				{
					var pos = util.eventObjectToPos(e)
					xpos2 = pos.x
					ypos2 = pos.y
					if(	Math.max(xpos2 - xpos1, xpos1 - xpos2) > 
						Math.max(ypos2 - ypos1, ypos1 - ypos2))
					{
						if(xpos2 > xpos1)
						{
							util.datePicker.prevMonth(id)
						}
						else if(xpos1 > xpos2)
						{
							util.datePicker.nextMonth(id)			
						}						
					}
					else
					{
						if(ypos1 > ypos2)
						{
							util.datePicker.nextWeek(id)
						}
						else if(ypos2 > ypos1)
						{
							util.datePicker.prevWeek(id)				
						}
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

	util.datePicker.prevNextDay = function(dp, offset)
	{
		if(this.options.get(this.flags.incrementworkday))
		{
			if(	offset == 1 && 
				dp.data.date.getDay() == 0)
				offset += 0
			else if(offset == 1 &&
					dp.data.date.getDay() == 5)
				offset += 2
			else if (offset == 1 &&
					dp.data.date.getDay() == 6)
				offset += 1
		}
		if(offset > 0 && this.options.get(this.flags.showholidays))
		{
			util.forEach(util.holidays.list, function(holi)
			{
				if(	holi.date.from.year == dp.data.date.getFullYear() &&
					holi.date.from.month == dp.data.date.getMonth() + 1  &&
					holi.date.from.day == dp.data.date.getDate() + offset)
				offset++
			})
		}
		var now = new Date()
		if(	(now < new Date(
			dp.data.date.getFullYear(),
			dp.data.date.getMonth(),
			dp.data.date.getDate() + offset)) ||
			(now.getDate() == dp.data.date.getDate() + offset &&
			now.getMonth() == dp.data.date.getMonth() &&
			now.getFullYear() == dp.data.date.getFullYear()) ||
			this.options.get(this.flags.allowdatesbeforenow))
		{
			dp.data.date = new Date(
				dp.data.date.getFullYear(),
				dp.data.date.getMonth(),
				dp.data.date.getDate() + offset
			)
			dp.data.node.value = dp.data.date.format(dp.data.format)	
			_s("input[name=" + dp.data.name + "]").val(
				dp.data.date.format(util.datePicker.dataFormat))
		}
	}
	
	util.datePicker.nextDay = function(i)
	{
		util.eventHandler(function()
		{
			var dp = util.datePicker.dPickers[i]
			util.datePicker.prevNextDay(dp, 1)
		})
	}

	util.datePicker.prevDay = function(i)
	{
		util.eventHandler(function()
		{
			var dp = util.datePicker.dPickers[i]
			util.datePicker.prevNextDay(dp, -1)
		})
	}	
	
	util.datePicker.nextWeek = function(i)
	{
		util.eventHandler(function()
		{
			var dp = util.datePicker.dPickers[i]
			dp.data.date = new Date(
					dp.data.date.getFullYear(),
					dp.data.date.getMonth(),
					Number(dp.data.date.getDate()) + 7
			)
			_s('body').node.removeChild(_s('body').node.lastChild)					
			dp.display(i)
		})
	}

	util.datePicker.prevWeek = function(i)
	{
		util.eventHandler(function()
		{
			var dp = util.datePicker.dPickers[i]
			dp.data.date = new Date(
					dp.data.date.getFullYear(),
					dp.data.date.getMonth(),
					Number(dp.data.date.getDate()) - 7
			)
			_s('body').node.removeChild(_s('body').node.lastChild)					
			dp.display(i)
		})
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
	util.datePicker.refresh = function(i)
	{
		var dp = util.datePicker.dPickers[i]
		dp.display(i)
	}
	
	util.datePicker.onResize = function()
	{
		util.forEach(util.datePicker.dPickers, function(dp, id)
		{
			if(dp.data.state == 'open')
			{
				_s('body').node.removeChild(_s('body').node.lastChild)									
				dp.data.state = 'closed'
				setTimeout("util.datePicker.refresh(" + id + ")", 200)
			}
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
		var my = this
		util.forEach(inps, function(obj)
		{
			var obj2 = new HTMLElement(obj)

			// Create the hidden field
			var el = util.createElement('input')
			el.setAttribute('type', 'hidden')
			var name = obj2.getNode().getAttribute('name')
			el.setAttribute('name', name)
			
			// and append it to the form
			obj2.getNode().parentNode.appendChild(el.node)
			obj2.setAttribute('name', '')

			var now = new Date()
			var options = new util.struct([util.options], {value:util.datePicker.options.data.value})
			var dp = new util.struct(
				[util._datePicker], 
				{	node:obj,
					name:name,
					id:util.datePicker.dPickers.length,
					value:obj.value,
					dataValue:obj.value,
					state:'closed', 
					date:util.trim(obj.value).isEmpty()? new Date(now.getFullYear(), now.getMonth(), now.getDate() + util.datePicker.offsetWorkdays) : new Date(util.datePicker.valueToDate(obj.value)), 
					options:options,
					offsetWorkdays:util.datePicker.offsetWorkdays,
					format:util.locale.datePickerDateFormat,
					formatshort:util.locale.datePickerDateFormatShort})
			
			dp.tnode = obj2
			el.val(dp.data.date.format(util.datePicker.dataFormat))
			
			if(	!String(obj2.value).isEmpty() && 
				dp.data.options.get(util.datePicker.flags.expand) && 
				!dp.data.options.get(util.datePicker.flags.expandonfocus))
				obj2.value = dp.data.date.format(dp.data.format).toUpperCase()
			else obj2.val(dp.data.date.format(util.locale.datePickerDateFormat))
			util.datePicker.dPickers.push(dp)
			obj2.getNode().setAttribute('rel', util.datePicker.dPickers.length)

			if(!my.options.get(util.datePicker.flags.allowtyping))
				obj2.setAttribute('readonly', 'readonly')
	
			if(my.options.get(my.flags.expand))
			{
				obj2.addListener('focus', function()
				{
					util.forEach(util.datePicker.dPickers, function(dp)
					{
						dp.hide()
					})
		//			var my = this
					util.eventHandler(function()
					{
						var d = obj2.node.getAttribute('rel')
						var dp = util.datePicker.dPickers[d-1]
		
						if(dp.data.state == 'closed')
						{
							if(String(dp.data.value).isEmpty())
							{
								if(!dp.data.date)
								{
									//dp.data.date = new Date()
								}
								
							}
							dp.display(dp.data.id)
						}
					})
				})
				if(window.attachEvent)
				{
					window.attachEvent("onresize", util.datePicker.onResize)
				}
				else
				{
					window.addEventListener("resize", util.datePicker.onResize)				
				}
			}
			else
			{
				dp.displayClickable(dp.data.id)
			}
		})
	}
	
	util.datePicker.onUpdateLocale = function()
	{
		util.forEach(util.datePicker.dPickers, function(dp)
		{
			dp.data.format = util.locale.datePickerDateFormat
			dp.data.node.value = dp.data.date.format(dp.data.format)
		})
	}
})()

util.prepare(function()
{	
	util.datePicker.options.set(
		[!util.datePicker.flags.expand, 
		 util.datePicker.flags.incrementworkday,
		 util.datePicker.flags.expandenabledrag,
		 util.datePicker.flags.expandshowweeknumber,
		 util.datePicker.flags.showholidays,
		 !util.datePicker.flags.allowdatesbeforenow]
	)	
})

util.ready(function()
{

})