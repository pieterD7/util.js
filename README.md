
	Obtain a copy of the source [here](http://github.com/pieterhoekstra/util.js/)

	Copyright (C) 2012 by pieter@nr8.nl

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
	
	
	
	Introduction:

	Because app interfaces are written for specific HTML5 browsers I felt the 
	need to write a lightweight js lib with page elements rather than pages. Utiljs
	has loading problems: a function of util can be called before being fully 
	initialized causing an error. It can be solved by putting the files you want 
	to use in one file and rewrite the loader.


	Util.js was tested w/ on :

	- jQuery
	- Google Maps
	
	- Android 2.2, 2.3.4, 4.0 native browser
	- Chrome 15-18
	- Safari 5
	- IE8-IE9	
	- Opera 11.60
	- Opera Mini Simulator 4.2
	- Opera Mobile Emulator 11.5


	Goals of util.js:
	
	simple, easy to learn, lightweight, lean & mean, powerfull 
	in an object oriented way, specially made for apps, multiple 
	languages & formats, string formatting, number & currency formatting 
		
	Implementation:
=====
	<script type="text/javascript">
	var utilConfig = {
		debug:true,
		defLocale: 'en',
		locales: ['it', 'nl']
	}
	
	/* enter ADAPT_CONFIG here as explained on http://adapt.960.gs */

	</script>
	<script type='text/javascript' src='pathToUtil/loader.js'></script>
======

	String formatting:
	
	1) Capitalizes first non-tag string character of string or dot terminated phrases
	2) Adds space after dot in a phrase
	3) Removes double space
	4) Removes space before dot
	5) Leaves abbreviations as they are
	6) Truncates to number of characters and tries to round up on space
	7) Adds an optional string or ' ...' (to the last open fitting tag) when the string 
	   has been truncated


	HTML5 datePicker:
	
	If you add the datepicker module to the loader, it will add datePicker behaviour
	to any html input tag with the attribute 'type' set to 'date'. The module is dependent
	on the date module and, to a lesser extend, on the current util.locale.

	A static meta-tag is required for util when not using sizzlejs:
	<pre>
	&lt;meta http-equiv="X-UA-Compatible" content="IE=8">
	</pre>	
	
	
	Examples:

	i. builtin elements
	
<pre>
	// Push 'home' breadcrumb
	// 'home' is a langId, eg. util.lang.home and util._lang['en'].home
	util.crumbs.push(new util.crumb('home', clientResume))
	// Assign selector
	util.crumbs.setSel('#crumbs')

	var langs = [{iso_code:'en', label:'english'},
	             {iso_code:'nl', label:'nederlands'},
	             {iso_code:'it', label:'italiano'}]
	util.langbar.setLanguages(langs)
	
	// Assign selector
	util.langbar.display('#langSelector')
	
	// Get locale on Android with the jsjbridge module	
	util.curLang = navigator.util.getLocale();
	util.langbar.selectLang(util.curLang)
	
	// Set what needs to be done when user selects language from langbar
	util.langbar.setOnUpdate(function()
	{
		util.hud.getDictionary(
				/* url */
				'data.json',
				/* selector for input */
				"#hud", 
				/* onclick */
				"javascript:util.menu.choose('%', '%')",
				/* on icon click */
				"javascript:util.menu.choose('%', '%')"				
			)	
	})
</pre>
	ii. utiljs runlevels
<pre>	
	1. load modules
	2. load locale dependant files
	3. execute function _init of all modules
	4. execute prepare callbacks
	5. execute ready callbacks 
	6. execute steady callbacks
</pre>	

	iii. util.js dev
	
<pre>
utilConfig={debug:true, locales: ['en'], defLocale:'en'}
util.ready(function() // If using the loader
	    {
	        util.debug.setGetAppState(function()
	        {
	        	/* return string for debug message */
	            return 'state=' 
	        })
	       
	        var x = util.extend(card, {value:1})
	         /* x is a card with property value=1 */
	         util.extend(x, {value:0})
	         /* x is a card with property value=0 */
	         
	        var x = util.struct([card, blackjack], {value:1})
	        /* x is a struct with property data.value=1 */ 
	    
	        var msg = 'fits in as many words as possible when first word in string is shorter then limit'
	            .toLimitedFormattedHTML(23)

	  	// msg now eq: 'Fits in as many words ...'
	  	// Consider css text-overflow: ellipse
	        
	    
	    // strip all dots and space:
	        util.trim('1000 AA', true)

	    // format numbers to type and locale
	        var res = 'average of &%'.format([1.5], 'precision:1', '&')

	    // handle input         
	        util.trim(null).isEmpty() // true
	        
	        util.isObject(null) // true
	        
	    // no parser, just the ones builtin (json and xml) (Not IE9)
	       alert(util.toJson("[
	       		{'name':'pieter\'s'},
	       		{'name':'lo  \\\\  pi'},
	       		{'name':'Kilo zei:\\\"Hoera!\\\"'}]")[2].name)       

	    // with a struct (but not "use strict" compatible):   
	        var msg = new util.struct([String], {msg1:'total %', msg2:'Bye '})
	        var d = msg.format.apply(msg.data.msg1, [[1.5], 'float:2'])
	        var m = msg.toLimitedFormattedText.apply(d, [15])

	    // example enum:
	        util.unum('1000', '1002').forEach(function(pnumber)
	        {
	            util.unum(pnumber + 'AZ', pnumber + 'BB', 
	            {
	                regexp:RegExp(/\d{4}[A-Z]{2}/),
	                onUnumNext:function(pcode)
	                {
	                    alert(pcode)
	                }
	            })
	        })  

	    // example options:
	    option = ['optionFoo', 'optionBar', 'optionBaz'].unum()
	                    
	    config = new util.struct([util.options], {value:option.optionBar})

	    config.set([option.optionFoo])

	    config.get() & option.optionFoo // True, or:
	    config.get(option.optionBar) // True
	    config.get(option.optionBaz) // False
	    
	    // toggle optionBar
	    config.set([option.optionBar])
	    config.get(option.optionBar) // False

})	
			
</pre>