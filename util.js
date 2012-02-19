/**
 *  Utility functions for validation and string formatting, 
 *  written for the V8 engine
 */


/**
 * @returns {string}
 * @param {string} String
 * @param {boolean} eraseAllSpace
 */
util.trim = function(str, eraseAllSpace)
{	
	if(util.isUndef(str)) str = ''
		
	if(!util.isString(str))
		str = new String()
		
	// remove all double space
	var s = str.replace(/\s\s/g, ' ')
	
	// remove all space
	if(this.isBool(eraseAllSpace) && eraseAllSpace)
		s = s.replace(/\s|\./g, '')

	// remove trailing and leading space
	return s.replace(/^\s|\s$/, '')
}

String.prototype.findFirstNonTagChar = function()
{
	var pos = 0
	if(this.charAt(pos) == '<')
	while(this.indexOf('>', pos) != -1)
	{
		var pos = this.indexOf('>', pos)
		if(this.charAt(pos+1) != '<')
			return pos+1	
	}
	return 0
}

String.prototype.toFirstCharUppercase = function()
{
	var pos = this.findFirstNonTagChar()
	var pre = ''
	if(pos > 0)
		pre = this.slice(0,pos)
	return pre + this.toString().charAt(pos).toLocaleUpperCase() + this.slice(pos+1)
}

String.prototype.toAllFirstCharsUppercase = function()
{
	var words = this.split(' ')
	var sentence = ''
	for(var c =  0; c < words.length; c++)
	{
		if(c > 0) sentence += ' '
		sentence += new String(words[c]).toFirstCharUppercase()
	}
	return sentence
}

/**
 * @description Makes sure phrases start with a capital based on . and are trimmed
 * Phrases are strings ending with a dot or end of string of at least two words
 */
String.prototype.toFormattedText = function(doFormat)
{	
	var sentences = this.split(".")
	var ftext = ''
	var inAbb = false
	for(var c = 0; c < sentences.length; c++)
	{
		if(c > 0)
		{
			if(new String(sentences[c]).match(/(\s\w){1,}/)) 
			{
				ftext += '. '
			}
			else
			{
				inAbb = true
				ftext += '.'
			}
		}
		if(util.trim(sentences[c]).indexOf(' ') > 0 && !inAbb && 
			(util.isUndef(doFormat) || util.isBool(doFormat) && doFormat))
		{
			ftext += util.trim(sentences[c]).toFirstCharUppercase()
		}
		else
			ftext += util.trim(sentences[c])
		if(new String(sentences[c]).indexOf(' ') > -1)
			inAbb = false			
	}
	return ftext
}

String.prototype.parseAsHTML = function()
{
	var html = document.createElement('div')
	
	html.innerHTML = '<div>' + this.toString() + '</div>';
	return html
}

util.nodes = []

util.collectChildNodes = function(el)
{
	this.nodes.push(el)
	for(var c = 0; c < el.childNodes.length; c++)
	{
		this.nodes.push(this.collectChildNodes(el.childNodes[c]))
	}
	return this.nodes
}

/**
 * @description Limits valid html markup to limit display chars 
 * adds ending or  ... when string is truncated
 * 
 */
String.prototype.toLimitedFormattedHTML = function(limit, ending, doFormat)
{	
	var div = this.toString().toFormattedText(doFormat).parseAsHTML()
	var formatted = ''
	var text = ''
	var tags = []
	var finished = false
	var lastOpenTag = ''
		
	for(var c = 0; c < div.childNodes.length; c++)
	{	
		util.nodes = []
		util.nodes = util.collectChildNodes(div.childNodes[c])
		for(var g = 0; g < util.nodes.length; g++)
		{
			if (g == 0)continue;
			if(util.nodes[g].tagName != null)
			{
				formatted += "<" + util.nodes[g].tagName
				if(util.nodes[g].attributes)
					for(var f = 0; f < util.nodes[g].attributes.length; f++)
					{
						formatted += ' ' + util.nodes[g].attributes[f].nodeName + 
						"='" + util.nodes[g].attributes[f].nodeValue + "' "
					}
				formatted += ">"
				tags.push(util.nodes[g].tagName)	
			}
			else if(util.nodes[g].nodeValue && !util.nodes[g].hasChildNodes())
			{
				if(util.nodes[g].nodeValue.length + text.length >= limit && !finished)
				{
					var left = limit - text.length
					var add = new String(util.nodes[g].nodeValue).toLimitedFormattedText(left, '', false)
					formatted += add
					text += add
					finished = true
					lastOpenTag = new String(tags.pop())
				}
				else if(text.length + util.nodes[g].nodeValue.length < limit)
				{
					text += util.nodes[g].nodeValue
					formatted += util.nodes[g].nodeValue
					lastOpenTag = new String(tags.pop())
				}
				else
				{
					finished = true
				}
				if(finished)
				{
					if(util.isUndef(ending))
						var ending = ' ...'		
					formatted += ending
				}
			}
			if(lastOpenTag != '' && lastOpenTag != 'undefined' && g > 1)
				formatted += '</' + lastOpenTag + '>'
			lastOpenTag = ''
			if(finished) break
		}
	}
	
	while(t = tags.pop())
		formatted += '</' + t + '>'
		
	if(!formatted.isEmpty() && ending && formatted != ending)		
		return formatted
	else
		return this.toString()
}

/**
 * @description fits in as many words as possible when first word in string is shorter then limit
 * 	else truncates string by limit adds ending or ... when string is truncated
 * 
 */
String.prototype.toLimitedFormattedText = function(limit, ending, doFormat)
{	
	var limited = ''
		
	if(this.indexOf(' ') < limit && this.indexOf(' ') > 0)
	{
		var l = this.split(' ')
		for(var c = 0; c < l.length && limited.length + l[c].length < limit; c++)
		{
			if(c > 0) limited += ' '
			
				// replace dotspace with dot		
			var ll = String(l[c]).replace(/\s\\./g, '.')	
			limited += ll
		}
	}
	else
	{	
		limited = this.slice(0, limit)	
	}
	if(util.isUndef(ending)) var ending = ' ...'
	var end = limit < this.length ? ending : ''
	return limited.toFormattedText(doFormat)+end
}

