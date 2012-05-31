/**
 * 
 */

util.theme = {
	themes:null,
	actualTheme:null, 
	userSet:null,
	options:null,
	flags:[]
}

util.theme.Theme = function(name, o)
{
	this.name = name
	util.extend(this, o)
	return this
}

util.theme._init = function()
{
	util.theme.flags = [].unum()
	util.theme.options = new util.struct([util.options], {value:0})	
	util.theme.userSet = new util.userSettings('theme')
	util.theme.themes = [util.theme.Theme.Android, 
	                     util.theme.Theme.iOS]
	util.theme.actualTheme = util.theme.userSet.get('name') || 'Android'	

	util.theme.Theme.Android = new util.theme.Theme(
	"Android",
	{
		labelBeforeCheckbox:false
	})

	util.theme.Theme.iOS = new util.theme.Theme(
	"iOS", 
	{
		labelBeforeCheckbox:true
	})	
	
}

util.theme.isValidTheme = function(str)
{
	if(String(str).match(RegExp(util.theme.themes.joinEach('name', '|'))))
		return true
	return false
}

util.theme.setTheme = function(str)
{
	return util.eventHandler(function()
	{
		if(util.theme.isValidTheme(str))
		{
			util.theme.actualTheme = str
			util.theme.userSet.store({key:'name', value:str})		
			return true
		}
		return false		
	})

}

util.theme.getTheme = function()
{
	var t = util.theme.themes.find(util.theme.actualTheme, 'name')
	return t[0] || false
}

util.theme.showSettings = function()
{
	var tt = util.theme.getTheme()
	var html = sprintf(
		"<select onchange='%s'>", 
		"util.theme.setTheme(this.value);document.location.reload()"
		)
	
	util.forEach(util.theme.themes, function(t)
	{
		var selected = ''
		if(t.name.equals(tt.name))
			selected = 'selected'

		html += sprintf(
			"<option value='%s' %s>%s</option>",
			t.name,
			selected,
			t.name
			)
	})
	html += '</select>'
	return html
}
