/**
 * 
 */

util.datePicker = {
		dPickers:[]
}

function _datePicker(inp)
{
	this.node = inp
	this.value = null
	this.date = null
	this.format = null
	this.state = 'closed'
}

_datePicker.prototype.valueToDate = function()
{
	this.date = new Date(this.node.value)
	this.value = 0
	this.format = util.locale.datePickerDateFormat
}

_datePicker.prototype.displayWeeks = function()
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
	div.setHtml(this.date.format(util.locale.datePickerDateFormat).toUpperCase())
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
				var offset =(c-1)*7+cc-this.date.getDay()-7
				dd.setHtml(
						new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()+offset)
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
				dd.setHtml(new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()+(c-1)*7).getWeek(1))
				d.appendChild(dd.node)
			}
		}
		ret.appendChild(d.node)		
	}
	return ret.node
}

_datePicker.prototype.display = function()
{
	this.state = 'open'
	var pos = util.getCumulativeOffset(this.node)
	var div = util.createElement('div')

	div.setHtml('')
	div.appendChild(this.displayWeeks())
	div.style("position:absolute;left:" + pos.x + "px;top:" + pos.y + 
			"px;width:" + document.defaultView.getComputedStyle(this.node,"").getPropertyValue("width") +
			";min-height:" + document.defaultView.getComputedStyle(this.node,"").getPropertyValue("height") + 
			";");
	div.setAttribute('class', 'datePickerBackground')
	_s('body').appendChild(div.node)
}

_datePicker.prototype.hide = function()
{
	this.state = 'closed'
	_s('body').node.removeChild(_s('body').node.lastChild)
	this.node.setAttribute('style', 'display:inline;')
}

util.datePicker.initInputTypeDate = function()
{
	var inps = _sa('input[type=date]')
	inps.forEach(function(obj)
	{
		var dp = new _datePicker(obj)
		dp.value = obj.value
		dp.valueToDate()
		dp.format = util.locale.datePickerDateFormat
		if(!String(obj.value).isEmpty())
			obj.value = dp.date.format(dp.format).toUpperCase()
		util.datePicker.dPickers.push(dp)
		obj.setAttribute('rel', util.datePicker.dPickers.length)
		
		inps[0].addListener('click', function()
		{
			try
			{
				var d = this.getAttribute('rel')
				var dp = util.datePicker.dPickers[d-1]

				if(dp.state == 'closed')
				{
					if(String(dp.node.value).isEmpty())
					{
						dp.date = new Date()
						
					}
					dp.display()
				}
				else
				{
					dp.hide()
				}

			}
			catch(err)
			{
				util.debug.log(err)
			}

		})
	})
}

util.prepare(function()
{
	try{
		util.datePicker.initInputTypeDate()
	}
	catch(err)
	{
		util.debug.log(err)
	}	
})
