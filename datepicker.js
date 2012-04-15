/**
 * @class
 * @name util.datepicker
 * @description Data for datepicker 
 */
util.datepicker = {
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
	 * @name util._datepicker
	 */
	util._datepicker = function()
	{
		return this
	}
	
	
	/**
	 * @field
	 * @name util.datepicker._init
	 */
	util.datepicker._init = function()
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
	     * to util.locale.datepickerHolidayFormat 
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
		 * 10 padddates Padd date values
		 * 11 storepaddeddates Store padded values
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

		 // Display as util.locale.datepickerHolidayFormat 
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
	     'allowtyping',
	     
	     // Padd dates to two chars
	     'padddates',
	     
	     // Store padded dates
	     'storepaddeddates'
	     
		  ].unum();
		  
		  
		 /**
		  * @field
		  * @type util.options
		  * 
		  */ 
		this.options = new util.struct([util.options], {value:0})
		
		util.datepicker.userSettings = new util.userSettings('localeSet')		

	}
	
	/**
	 * @function util.datepicker.getDatePickerDateFormat
	 * @description Get datePickerDateFormat from settings or default 
	 * to locale setting
	 */
	util.datepicker.getDatePickerDateFormat = function()
	{
		return  util.datepicker.userSettings.get('datePickerDateFormat') || 
				util.locale.datePickerDateFormat
	}
	
	/**
	 * @function util.datepicker.setDataFormat
	 * @param {String} format Format
	 * @description Sets datePickerDateFormat to format.
	 * @example
	 * 	"(W) d DD M YYYY" => (16) tu 17 april 2012
	 */
	util.datepicker.setDataFormat = function(format)
	{
		util.datepicker.dataFormat = format
	}
	
	/**
	 *  @function util.datepicker.valueToDate
	 *  @param node value
	 *  @returns {Date} 
	 *  @description return date object based on node value 
	 *  and util.datepicker.dataFormat
	 */
	util.datepicker.valueToDate = function(val)
	{
		var d = new Date(String(val).toDate(util.datepicker.dataFormat))
		if(isNaN(d.getMonth()))
			throw(util.error(util.defaultStrings.error.error_invalidnodevalue))
		return d
	}
	
	/**
	 * @function util._datepicker.prototype.valueToDate
	 * @description datepicker internal function to set 
	 * date by node value
	 */
	util._datepicker.prototype.valueToDate = function()
	{
		var val = this.data.date
		if( isNaN(this.data.date.getMonth()))
			throw(util.error(util.defaultStrings.error.error_invalidnodevalue))
		this.data.node.value = 	this.data.date.format(
									util.datepicker.getDatePickerDateFormat(), 
									this.data.options.get(util.datepicker.flags.padddates))
		this.data.format = util.datepicker.getDatePickerDateFormat()
	}
	
	/**
	 * @function util._datepicker.prototype.createMonthRow
	 * @param {Number} id
	 * @returns
	 * @description datepicker internal function. Creates a set 
	 * of interface related divs.
	 * A monthrow is when the datepicker expands and the month
	 * is written with adjacing plus/minus signs on non-touchdevices
	 */
	util._datepicker.prototype.createMonthRow = function(id)
	{
		var mdiv = util.createElement('div')
		mdiv.addClassName('datepickerSelectedMonth')
		if(!util.isTouchDevice)
		{
			var sp0 = util.createElement('span')
			var a1 = util.createElement('a')
			a1.setAttribute('href', 'javascript:util.datepicker.prevMonth(' + id + ')')
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
			a1.setAttribute('href', 'javascript:util.datepicker.nextMonth(' + id + ')')			
			a1.setHtml(">>")
			sp0.appendChild(a1)
			mdiv.appendChild(sp0)			
		}	
		return mdiv
	}
	
	/**
	 * @function util._datepicker.prototype.displayWeeks
	 * @param {Number} id
	 * @returns
	 * @description datepicker internal function Displays the 
	 * rows representing the weeks on expand. The function uses
	 * the Date extention getWeek.
	 */
	util._datepicker.prototype.displayWeeks = function(id)
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
		div.setHtml(this.data.date.format(	util.datepicker.getDatePickerDateFormat(), 
											this.data.options.get(util.datepicker.flags.padddates))
												.toUpperCase())
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
			util.datepicker.options.get(util.datepicker.flags.expandshowweeknumber)? start = 0 : start = 1;
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
						dday.getDate()
					)
						
					// is holiday?
					if(this.data.options.get(util.datepicker.flags.showholidays))
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
	
	/**
	 * @function util._datepicker.prototype.displayClickable 
	 * @param {Number} id
	 * @description datepicker internal function Used when expand 
	 * is not set. Creates interface related elements.
	 */
	util._datepicker.prototype.displayClickable = function(id)
	{
		var el = util.createElement('a')
		var im = util.createElement('img')
		im.setAttribute('src', util.getBaseUrl() + '../icons/medium/min.png')
		el.appendChild(im)
		el.setAttribute('href', 'javascript:util.datepicker.prevDay(' + id + ')')
		el.addClassName("datePickerMin")
		util.datepicker.dPickers[id].tnode.node.parentNode.insertBefore(
				 el.node,util.datepicker.dPickers[id].tnode.node
		)
		el = util.createElement('a')
		var im = util.createElement('img')
		im.setAttribute('src', util.getBaseUrl() + '../icons/medium/plus.png')		
		el.appendChild(im)
		el.setAttribute('href', 'javascript:util.datepicker.nextDay(' + id + ')')
		el.addClassName("datePickerPlus")		
		
		util.datepicker.dPickers[id].tnode.node.parentNode.insertBefore(
				 el.node, util.datepicker.dPickers[id].tnode.node.nextSibling)
	}
	
	/**
	 * @function util._datepicker.prototype.display
	 * @param {Number} id
	 * @description datepicker internal function Creates the expanded
	 * version of the interface
	 */
	util._datepicker.prototype.display = function(id)
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
				if(my.data.options.get(util.datepicker.flags.allowdatesbeforenow) || 
					dd > new Date())
				{
					my.data.date = dd
					_s("input[name=" + my.data.name + "]").val(dd.format(
								util.datepicker.datePickerDataFormat,
								my.data.options.get(util.datepicker.flags.storepaddeddates)))
					_s('body').node.removeChild(_s('body').node.lastChild)									
					my.display(id)
				}
			})
		})	
		if(util.datepicker.options.get(
				util.datepicker.flags.expandenabledrag))
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
							util.datepicker.prevMonth(id)
						}
						else if(xpos1 > xpos2)
						{
							util.datepicker.nextMonth(id)			
						}						
					}
					else
					{
						if(ypos1 > ypos2)
						{
							util.datepicker.nextWeek(id)
						}
						else if(ypos2 > ypos1)
						{
							util.datepicker.prevWeek(id)				
						}
					}
				})
			})
		}	
	}
	
	/**
	 * @function util._datepicker.prototype.hide
	 * @description datepicker internal function Hides expanded state
	 * when opend and calls valueToDate
	 */
	util._datepicker.prototype.hide = function()
	{
		if(this.data.state == 'open')
		{
			this.data.state = 'closed'
			this.valueToDate()
			_s('body').node.removeChild(_s('body').node.lastChild)
			this.data.node.setAttribute('style', 'display:inline;')
		}
	}
	
	/**
	 * @function util.datepicker.isHoliday
	 * @param {Date} day
	 * @description Iterates util.holidays.list and returns true if 
	 * day is a holiday 
	 */
	util.datepicker.isHoliday = function(day)
	{
		var r = util.forEach(util.holidays.list, function(holi)
		{
			if(holi.date.from.year == day.getFullYear() &&
				holi.date.from.month == day.getMonth() + 1 &&
				holi.date.from.day == day.getDate())
				return true
		})
		return r
	}

	/**
	 * @function util.datepicker.prevNextDay
	 * @param {util.datepicker} dp 
	 * @param {Number} offset
	 * @description Used when not expanded. Sets dp's date to +/- offset
	 */
	util.datepicker.prevNextDay = function(dp, offset)
	{
		var offset = util.datepicker.calcPlusWorkdays(dp.data.date, offset, this.options)
		
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
			dp.data.node.value = dp.data.date.format(
					dp.data.format, 
					dp.data.options.get(util.datepicker.flags.padddates))	
			_s("input[name=" + dp.data.name + "]").val(
				dp.data.date.format(
						util.datepicker.dataFormat, 
						dp.data.options.get(util.datepicker.flags.storepaddeddates)))
		}
	}
	
	/**
	 * @function util.datepicker.nextDay
	 * @param {Number} i datepicker id
	 * @description Wrapper around util.datepicker.prevNextDay
	 */
	util.datepicker.nextDay = function(i)
	{
		util.eventHandler(function()
		{
			var dp = util.datepicker.dPickers[i]
			util.datepicker.prevNextDay(dp, 1)
		})
	}
	/**
	 * @function util.datepicker.prevDay
	 * @param {Number} i datepicker id
	 * @description Wrapper around util.datepicker.prevNextDay
	 */
	util.datepicker.prevDay = function(i)
	{
		util.eventHandler(function()
		{
			var dp = util.datepicker.dPickers[i]
			util.datepicker.prevNextDay(dp, -1)
		})
	}	
	
	/**
	 * @function util.datepicker.nextWeek
	 * @param {Number} i datepicker id
	 * @description Used with expand
	 */	
	util.datepicker.nextWeek = function(i)
	{
		util.eventHandler(function()
		{
			var dp = util.datepicker.dPickers[i]
			dp.data.date = new Date(
					dp.data.date.getFullYear(),
					dp.data.date.getMonth(),
					Number(dp.data.date.getDate()) + 7
			)
			_s('body').node.removeChild(_s('body').node.lastChild)					
			dp.display(i)
		})
	}

	/**
	 * @function util.datepicker.prevWeek
	 * @param {Number} i datepicker id
	 * @description Used with expand
	 */
	util.datepicker.prevWeek = function(i)
	{
		util.eventHandler(function()
		{
			var dp = util.datepicker.dPickers[i]
			dp.data.date = new Date(
					dp.data.date.getFullYear(),
					dp.data.date.getMonth(),
					Number(dp.data.date.getDate()) - 7
			)
			_s('body').node.removeChild(_s('body').node.lastChild)					
			dp.display(i)
		})
	}
	
	/**
	 * @function util.datepicker.nextMonth
	 * @param {Number} i Datepicker id
	 * @description Used with expand
	 */	
	util.datepicker.nextMonth = function(i)
	{
		util.eventHandler(function()
		{
			var dp = util.datepicker.dPickers[i]
			dp.data.date = new Date(
					dp.data.date.getFullYear(), 
					(Number(dp.data.date.getMonth()) + 1),
					dp.data.date.getDate()
			)
			_s('body').node.removeChild(_s('body').node.lastChild)					
			dp.display(i)				
		})	
	}

	/**
	 * @function util.datepicker.prevMonth
	 * @param {Number} i datepicker id
	 * @description Used with expand
	 */	
	util.datepicker.prevMonth = function(i)
	{
		util.eventHandler(function()
		{		
			var dp = util.datepicker.dPickers[i]
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
	 * @function util.datepicker.refresh
	 * @param {Number} datepicker id
	 * @description Redraws a datepicker 
	 */
	util.datepicker.refresh = function(i)
	{
		var dp = util.datepicker.dPickers[i]
		dp.display(i)
	}
	
	/**
	 * @function util.datepicker.onResize
	 * @description On resize event handler
	 */
	util.datepicker.onResize = function()
	{
		util.forEach(util.datepicker.dPickers, function(dp, id)
		{
			if(dp.data.state == 'open')
			{
				_s('body').node.removeChild(_s('body').node.lastChild)									
				dp.data.state = 'closed'
				setTimeout("util.datepicker.refresh(" + id + ")", 200)
			}
		})
	}
	
	/**
	 * @function util.datepicker.calcPlusWorkdays
	 * @param {Date} date
	 * @param {Number} offset
	 * @param {util.options} options
	 * @description Calculate next day considering the options
	 * util.datepicker.flags.incrementworkday 
	 * and util.datepicker.flags.showholidays
	 */
	util.datepicker.calcPlusWorkdays = function(date, offset, options)
	{
		var now = date
		var realOffset = offset
		for(var c = 0; c < realOffset; c++)
		{
			var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + c + 1)
			if((options.get(util.datepicker.flags.incrementworkday) && 
				(d.getDay() == 0 || d.getDay() == 6)) || 
				(options.get(util.datepicker.flags.showholidays) && 
				util.datepicker.isHoliday(d)))
			{
				realOffset++
			}
		}
		return realOffset
	}
	
	/**
	 * @function util.datepicker.nowPlusWorkdays
	 * @param {Number} offset
	 * @param {util.options} options
	 * @description Calculates now plus one day considering the options
	 * util.datepicker.flags.incrementworkday 
	 * and util.datepicker.flags.showholidays
	 */
	util.datepicker.nowPlusWorkdays = function(offset, options)
	{
		var now = new Date()
		var realOffset = util.datepicker.calcPlusWorkdays(now, offset, options)		
		return new Date(now.getFullYear(), now.getMonth(), Number(now.getDate()) + Number(realOffset))
	}

	/**
	 * @name util.datepicker.initInputTypeDate
	 * @function
	 * @param {String} sel Selection
	 * @description Function to be called in ready-function initializing datepickers
	 * @example
	 * 	util.datepicker.options.set(
			[util.datepicker.flags.expand]
		)
		util.datepicker.initInputTypeDate('input[type=date]')
	 */
	util.datepicker.initInputTypeDate = function(sel)
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
			
			// initial offset workdays
			var _offset = obj.getAttribute('rel')
			var o = String(_offset).split(':')
			if(o[0] == 'offsetDays' && !util.isUndef(o[1]))
				var offset = o[1]
			
			var options = new util.struct([util.options], {value:util.datepicker.options.data.value})
			var dp = new util.struct(
				[util._datepicker], 
				{	node:obj,
					name:name,
					id:util.datepicker.dPickers.length,
					value:obj.value,
					dataValue:obj.value,
					state:'closed', 
					date:util.trim(obj.value).isEmpty()? 
							util.datepicker.nowPlusWorkdays(offset, options) : 
							new Date(util.datepicker.valueToDate(obj.value)), 
					options:options,
					format:util.datepicker.getDatePickerDateFormat(),
					formatshort:util.locale.datePickerDateFormatShort})
			
			dp.tnode = obj2
			el.val(dp.data.date.format(
					util.datepicker.dataFormat,
					dp.data.options.get(util.datepicker.flags.storepaddeddates)))
			
			if(	!String(obj2.value).isEmpty() && 
				dp.data.options.get(util.datepicker.flags.expand) && 
				!dp.data.options.get(util.datepicker.flags.expandonfocus))
				obj2.value = dp.data.date.format(
						dp.data.format,
						dp.data.options.get(util.datepicker.flags.padddates))
							.toUpperCase()
			else obj2.val(dp.data.date.format(
					util.datepicker.getDatePickerDateFormat(),
					dp.data.options.get(util.datepicker.flags.padddates)))
			util.datepicker.dPickers.push(dp)
			obj2.getNode().setAttribute('rel', util.datepicker.dPickers.length)

			if(!my.options.get(util.datepicker.flags.allowtyping))
				obj2.setAttribute('readonly', 'readonly')
	
			if(my.options.get(my.flags.expand))
			{
				obj2.addListener('focus', function()
				{
					util.forEach(util.datepicker.dPickers, function(dp)
					{
						dp.hide()
					})
		//			var my = this
					util.eventHandler(function()
					{
						var d = obj2.node.getAttribute('rel')
						var dp = util.datepicker.dPickers[d-1]
		
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
					window.attachEvent("onresize", util.datepicker.onResize)
				}
				else
				{
					window.addEventListener("resize", util.datepicker.onResize)				
				}
			}
			else
			{
				dp.displayClickable(dp.data.id)
			}
		})
	}
	
	/**
	 * @function util.datepicker.onUpdateLocale
	 * @description Iterates through datepickers and applies locale or 
	 * user settings
	 */
	util.datepicker.onUpdateLocale = function()
	{
		util.forEach(util.datepicker.dPickers, function(dp)
		{
			dp.data.format = util.datepicker.getDatePickerDateFormat()
			dp.data.node.value = dp.data.date.format(
				dp.data.format,
				dp.data.options.get(util.datepicker.flags.padddates))
			_s("input[name=" + dp.data.name + "]").val(dp.data.date.format(
				util.datepicker.datPickerDataFormat,
				dp.data.options.get(util.datepicker.flags.storepaddeddates)))		
		})
	}
})()

util.prepare(function()
{	
	util.datepicker.options.set(
		[util.datepicker.flags.incrementworkday,
		 util.datepicker.flags.expandenabledrag,
		 util.datepicker.flags.expandshowweeknumber,
		 util.datepicker.flags.showholidays,
		 util.datepicker.flags.padddates]
	)	
})

util.ready(function()
{

})