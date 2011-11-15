/**
 *  Utility functions for validation and string formatting, 
 *  written for Chrome apps (and W3C recommendations)
 */

if(typeof sizzler === 'undefined')
{
	//@return Object
	function _s(sel)
	{
		if(typeof sel === 'object')
			return sel
		return document.querySelector(sel)
	}

	//@return Array
	function _sa(sel)
	{
		if(typeof sel === 'object')
			return [].push(sel)
		return document.querySelectorAll(sel)
	}
}

//@return String
function trim(str)
{	
	if(isUndef(str)) str = ''
		
	if(!isString(str))
		str = new String(str)
		
	// remove all double space
	var s = str.replace(/\s\s/g, ' ')
	
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
	return pre + this.toString().charAt(pos).toUpperCase() + this.slice(pos+1)
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

String.prototype.toFormattedText = function(doFormat)
{
	// makes sure phrases start with a capital based on '.' and are trimmed
	// Phrases are strings ending with a dot or end of string of at least two words
	
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
		if(trim(sentences[c]).indexOf(' ') > 0 && !inAbb && (isUndef(doFormat) || isBool(doFormat) && doFormat))
		{
			ftext += trim(sentences[c]).toFirstCharUppercase()
		}
		else
			ftext += trim(sentences[c])
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

var nodes = []

function collectChildNodes(el)
{
	nodes.push(el)
	for(var c = 0; c < el.childNodes.length; c++)
	{
		nodes.push(collectChildNodes(el.childNodes[c]))
	}
	return nodes
}

String.prototype.toLimitedFormattedHTML = function(limit, ending, doFormat)
{
	// Limits valid html markup to limit display chars 
	// adds ending or ' ...' when string is truncated
	
	var div = this.toString().toFormattedText(doFormat).parseAsHTML()
	var formatted = ''
	var text = ''
	var tags = []
	var finished = false
	var lastOpenTag = ''
		
	for(var c = 0; c < div.childNodes.length; c++)
	{	
		nodes = []
		var nodes = collectChildNodes(div.childNodes[c])
		for(var g = 0; g < nodes.length; g++)
		{
			if (g == 0)continue;
			if(nodes[g].tagName != null)
			{
				formatted += "<" + nodes[g].tagName
				if(nodes[g].attributes)
					for(var f = 0; f < nodes[g].attributes.length; f++)
					{
						formatted += ' ' + nodes[g].attributes[f].nodeName + 
						"='" + nodes[g].attributes[f].nodeValue + "' "
					}
				formatted += ">"
				tags.push(nodes[g].tagName)	
			}
			else if(nodes[g].nodeValue && !nodes[g].hasChildNodes())
			{
				if(nodes[g].nodeValue.length + text.length >= limit && !finished)
				{
					var left = limit - text.length
					var add = new String(nodes[g].nodeValue).toLimitedFormattedText(left, '', false)
					formatted += add
					text += add
					finished = true
					lastOpenTag = new String(tags.pop())
				}
				else if(text.length + nodes[g].nodeValue.length < limit)
				{
					text += nodes[g].nodeValue
					formatted += nodes[g].nodeValue
					lastOpenTag = new String(tags.pop())
				}
				else
				{
					finished = true
				}
				if(finished)
				{
					if(isUndef(ending))
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

String.prototype.toLimitedFormattedText = function(limit, ending, doFormat)
{
	// fits in as many words as possible when first word in string is shorter then limit
	// else truncates string by limit 
	// adds ending or ' ...' when string is truncated
	
	var limited = ''
	if(this.indexOf(' ') < limit)
	{
		var l = this.split(' ')
		for(var c = 0; c < l.length && limited.length + l[c].length < limit; c++)
		{
			if(c > 0) limited += ' '
			limited += l[c]
		}
	}
	else
	{	
		limited = this.slice(0, limit)	
	}
	if(isUndef(ending)) var ending = ' ...'
	var end = limit < this.length ? ending : ''
	return limited.toFormattedText(doFormat)+end
}

String.prototype.isEmpty = function()
{
	return this.toString() == '' 
}

function isUndef(a)
{
	return typeof a === 'undefined'
}

function isObject(a)
{
	return typeof a === 'object'
}

function isString(a)
{
	return typeof a === 'string'
}

function isFunction(a)
{
	return typeof a === 'function'
}

function isBool(a)
{
	return typeof a === 'boolean'
}

Object.prototype.addListener = function(event, cb)
{
	// W3C style 
	this.addEventListener(event, cb, false)
}

//alert('fits in as many words as possible when first word in string is shorter then limit'
//	.toLimitedFormattedText(23))

//alert('fits <a href="javascript:showPage()">in</a> as many b.v. words as. possible when first. <span>word in string </span> <div><p><span>is shorter then limit</span></p></div>'
//	.toLimitedFormattedHTML(120))	