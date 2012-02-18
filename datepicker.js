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
}

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
 * @name util.datePicker.init
 */
util.datePicker.init = function()
{
	/**
	 * @field
	 * @description Avalaible flags:
	 * 1 expand Drop down list or click to increment/decrement
	 * 2 incrementworkday Only valid without expand, skips holidays on increment with showholidays
	 * 3 showholidays Show holidays in dropdown, eg of util.holidays.list 
     * 4 expandvalueonfocus Expand node values to format on focus eg not on load
     * 5 expandtoholidayformat Expand to util.locale.datePickerHolidayFormat
	 * 6 expandenabledrag Enables dropdown list to be scrolled by dragging on mobile devices
	 */
	this.flags =
		
	[ 'expand',	// Drop down list or click to increment/decrement
	 'incrementworkday', // Only valid without expand, skips holidays on increment with showholidays
	 'showholidays', // Show holidays in dropdown, eg of util.holidays.list 
     'expandvalueonfocus', // Expand node values to format on focus eg not on load
     'expandtoholidayformat',	// Expand to util.locale.datePickerHolidayFormat
	 'expandenabledrag'	// Enables dropdown list to be scrolled by dragging on mobile devices
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
	var val = String(this.data.node.value)
	this.data.date = new Date(val)
	if( isNaN(this.data.date.getMonth()))
		throw(util.error(util.defaultStrings.error.error_invalidnodevalue))
	this.data.value = 0
	this.data.format = util.locale.datePickerDateFormat
}

util._datePicker.prototype.displayWeeks = function()
{
	var ret = util.createElement('div')
	ret.addClassName('datePickerContainer')
	
	div = util.createElement('div')
	div.addClassName('datePickerSelector')
	var selectVal = this
	div.addListener('click', function()
	{
		selectVal.hide()
	})	
	div.setHtml(this.data.date.format(util.locale.datePickerDateFormat).toUpperCase())
	ret.appendChild(div.node)
	
	ret.appendChild(div.node)
	
	for(var c = 0; c < 6; c++)
	{
		var d = util.createElement('div')
		d.setAttribute('class', 'datePickerRow')
		for(var cc = 0; cc < 8; cc++)
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

util._datePicker.prototype.display = function()
{
	this.data.state = 'open'
	var pos = util.getCumulativeOffset(this.data.node)
	var div = util.createElement('div')

	div.setHtml('')
	div.appendChild(this.displayWeeks())
	div.style("position:absolute;left:" + pos.x + "px;top:" + pos.y + 
			"px;width:" + document.defaultView.getComputedStyle(this.data.node,"").getPropertyValue("width") +
			";min-height:" + document.defaultView.getComputedStyle(this.data.node,"").getPropertyValue("height") + 
			";");
	div.setAttribute('class', 'datePickerBackground')
	_s('body').appendChild(div.node)
}

util._datePicker.prototype.hide = function()
{
	this.data.state = 'closed'
	_s('body').node.removeChild(_s('body').node.lastChild)
	this.data.node.setAttribute('style', 'display:inline;')
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
util.datePicker.initInputTypeDate = function()
{
	var inps = _sa('input[type=date]')
	util.forEach(inps, function(obj)
	{
		var options = new util.struct([util.options], {value:util.datePicker.options.data.value})
		var dp = new util.struct(
			[util._datePicker], 
			{	node:obj, 
				value:obj.value,
				state:'closed', 
				date:null, 
				options:options,
				format:util.locale.datePickerDateFormat,
				formatshort:util.locale.datePickerDateFormatShort})
		
		dp.valueToDate()
		if(	!String(obj.value).isEmpty() && 
			dp.data.options.get(util.datePicker.flags.expand) && 
			!dp.data.options.get(util.datePicker.flags.expandonfocus))
			obj.value = dp.data.date.format(dp.data.format).toUpperCase()
		util.datePicker.dPickers.push(dp)
		obj.setAttribute('rel', util.datePicker.dPickers.length)

		obj.addListener('blur', function()
		{
			var my = this
			util.eventHandler(function()
			{
				var d = my.getAttribute('rel')
				var dp = util.datePicker.dPickers[d-1]

				if(dp.data.state == 'open')
				{
					dp.hide()
				}								
			})
		})
		obj.addListener('focus', function()
		{
			var my = this
			util.eventHandler(function()
			{
				var d = my.getAttribute('rel')
				var dp = util.datePicker.dPickers[d-1]

				if(dp.data.state == 'closed')
				{
					if(String(dp.data.value).isEmpty())
					{
						dp.data.date = new Date()
						
					}
					dp.display()
				}
			})
		})
	})
}

util.prepare(function()
{
	util.datePicker.init()
})

util.ready(function()
{
	util.datePicker.options.set(
		[util.datePicker.flags.expand]
	)
	util.datePicker.initInputTypeDate()
})