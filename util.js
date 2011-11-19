/**
 *  Utility functions for validation and string formatting, 
 *  written for the V8 engine
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
util.trim = function(str, eraseAllSpace)
{	
	if(util.isUndef(str)) str = ''
		
	if(!util.isString(str))
		str = new String(str)
		
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

String.prototype.toLimitedFormattedText = function(limit, ending, doFormat)
{
	// fits in as many words as possible when first word in string is shorter then limit
	// else truncates string by limit 
	// adds ending or ' ...' when string is truncated
	
	var limited = ''
	if(this.indexOf(' ') < limit && this.indexOf(' ') > 0)
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
	if(util.isUndef(ending)) var ending = ' ...'
	var end = limit < this.length ? ending : ''
	return limited.toFormattedText(doFormat)+end
}

//CUT  ///////////////////////////////////////////////////////////////////
/* This license and copyright apply to all code until the next "CUT"
http://github.com/jherdman/javascript-relative-time-helpers/

The MIT License

Copyright (c) 2009 James F. Herdman

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


 * Returns a description of this past date in relative terms.
 * Takes an optional parameter (default: 0) setting the threshold in ms which
 * is considered "Just now".
 *
 * Examples, where new Date().toString() == "Mon Nov 23 2009 17:36:51 GMT-0500 (EST)":
 *
 * new Date().toRelativeTime()
 * --> 'Just now'
 *
 * new Date("Nov 21, 2009").toRelativeTime()
 * --> '2 days ago'
 *
 * // One second ago
 * new Date("Nov 23 2009 17:36:50 GMT-0500 (EST)").toRelativeTime()
 * --> '1 second ago'
 *
 * // One second ago, now setting a now_threshold to 5 seconds
 * new Date("Nov 23 2009 17:36:50 GMT-0500 (EST)").toRelativeTime(5000)
 * --> 'Just now'
 *
 */
Date.prototype.toRelativeTime = function(now_threshold) {
  var delta = new Date() - this;

  now_threshold = parseInt(now_threshold, 10);

  if (isNaN(now_threshold)) {
    now_threshold = 0;
  }

  if (delta <= now_threshold) {
    return 'Just now';
  }

  var units = null;
  var conversions = {
    millisecond: 1, // ms    -> ms
    second: 1000,   // ms    -> sec
    minute: 60,     // sec   -> min
    hour:   60,     // min   -> hour
    day:    24,     // hour  -> day
    month:  30,     // day   -> month (roughly)
    year:   12      // month -> year
  };

  for (var key in conversions) {
    if (delta < conversions[key]) {
      break;
    } else {
      units = key; // keeps track of the selected key over the iteration
      delta = delta / conversions[key];
    }
  }

  // pluralize a unit when the difference is greater than 1.
  delta = Math.floor(delta);
  if (delta !== 1) { units += "s"; }
  return [delta, units].join(" ");
};

/*
 * Wraps up a common pattern used with this plugin whereby you take a String
 * representation of a Date, and want back a date object.
 */
Date.fromString = function(str) {
  return new Date(Date.parse(str));
};

//  CUT  ///////////////////////////////////////////////////////////////////

Object.prototype.addListener = function(event, cb)
{
	// W3C style 
	this.addEventListener(event, cb, false)
}

//alert(util.trim('fits in.as many words as possible when first word in string is shorter then limit')
//	.toLimitedFormattedText(23))

//alert('fits <a href="javascript:showPage()">in</a> as many b.v. words as. possible when first. <span>word in string </span> <div><p><span>is shorter then limit</span></p></div>'
//	.toLimitedFormattedHTML(120))

