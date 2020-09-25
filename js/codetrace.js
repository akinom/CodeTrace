/**
 * CodeTrace JavaScript Library
 *
 * ideas based on
 * http://board.porizm.com/MIT.txt
 *
 */

function getUrlParams() {
	"use strict";
	var i, a, b, p, qs, fct;

	a = window.location.search.substr(1).split('&');
	if (a === "") {
		return {};
	}
	b = {};
	for ( i = 0; i < a.length; ++i) {
		p = a[i].split('=');
		if (p.length === 2) {
			b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
		}
	}
	return b;
}


var CodeBlock = new (function(){
    window.__CodeBlock_InstanceCounter = window.__CodeBlock_InstanceCounter || 0;
    
    return function(CodeContainer, CodeLines, LineVal){

        // Main Variables
        var me, i ;
        me = {};
        me.ID = window.__CodeBlock_InstanceCounter++;
        me.Wrapper = undefined;
        me.CodeLines = undefined;
             
		me.initLines = function() {
			var i;
			if ( typeof CodeLines == "number") {
				me.nLines = CodeLines;
				LineVal = LineVal || "";
				assert(me.nLines > 0);
				me.CodeLines = [];
				for ( i = 0; i < me.nLines; i++) {
					me.CodeLines.push(LineVal);
				}
			} else {
				me.CodeLines = CodeLines;
				me.nLines = CodeLines.length;
			}
			me.curLine = undefined;
			var wrapper = $('<div/>').addClass("codeBlock");
			me.lines = new Array()
			for (i = 0; i < me.nLines; i++) {
				me.lines[i] = $('<span/>').attr('id', i).addClass('line').text(me.CodeLines[i]);
				var txt = me.lines[i].html().replace(/\s/g, "&nbsp;");
				me.lines[i].html(txt);
				me.lines[i].appendTo(wrapper);
				$("<br/>").appendTo(wrapper);
			}
			return wrapper;
		}
		me.Wrapper = me.initLines();
		me.Wrapper.appendTo(CodeContainer);

	    me.appendLine = function(text) { 
	        me.CodeLines.push(text); 
	        var i = me.CodeLines.length-1; 
	        me.lines[i] = $('<span/>').attr('id', i).addClass('line').text(me.CodeLines[i]);
	        me.lines[i].appendTo(me.Wrapper);
			$("<br/>").appendTo(me.Wrapper);
			me.nLines++;
			return me.lines[i];
	    }
        me.setCurLine = function(i, line){
            if (undefined != me.curLine) {
                me.lines[me.curLine].removeClass("current").addClass("executed");
            	me.curline = undefined;
            }
            if (i >= 0 && i < me.nLines) {
                if (line) {
				   me.lines[i].text(line);
				   var txt = me.lines[i].html().replace(/\s/g, "&nbsp;");
			       me.lines[i].html(txt);
                }
                me.curLine = i;
				me.lines[me.curLine].addClass("current").removeClass('executed');
                return me.lines[me.curLine];
            }
            
            return undefined;
        }
        
        me.reset = function() {
        	me.curLine = undefined;
        	me.Wrapper.children(".current").removeClass("current"); 
        	me.Wrapper.children(".executed").removeClass("executed"); 
        }
        
        console.log("CodeBlock" + me.ID);
		return me;
    }
})();

var CodeStack = new (function(){
	window.__CodeStack_InstanceCounter = window.__CodeStack_InstanceCounter || 0;
	window.__CodeStack_NullCodeBlock = new CodeBlock(undefined, []);
    return function(CodeContainer, CodeLines, ColorPalette){
        // Main Variables
        var me = {}
        me.ID = window.__CodeStack_InstanceCounter++;
        me.Wrapper =  $('<div/>').addClass("codeStack")
        me.ColorPalette = ColorPalette;
        me.CodeBlocks =  new Array(); 
        me.top = 0;
        me.CodeBlocks[me.top] = new CodeBlock(me.Wrapper, CodeLines);
        var tp = me.CodeBlocks[0].Wrapper;
        tp.css("border-color", me.ColorPalette.children("div").eq(me.top).css("color")); 
        tp.addClass("codeStackTop level0"); 
        me.Wrapper.appendTo(CodeContainer); 
        
        me.getTopCodeBlock  = function() {
        	if (me.top >= 0) {
        		return me.CodeBlocks[me.top];
        	} else {
        		return undefined;
        	}
        	
        }
        
        me.pushCode = function(CodeLines) {
           me.CodeBlocks[me.top].Wrapper.removeClass("codeStackTop"); 
           me.top++;
		   console.log(me.top + " ", CodeLines[0]);

           me.CodeBlocks[me.top] = new CodeBlock(me.Wrapper, CodeLines);
           me.CodeBlocks[me.top].Wrapper.css("border-color", me.ColorPalette.children("div").eq(me.top).css("color")); 
           me.CodeBlocks[me.top].Wrapper.addClass("codeStackTop").addClass('level' + me.top); 
           return me.top;
        };
        
        me.pop = function() {
           me.CodeBlocks[me.top].Wrapper.remove(); 
		   me.CodeBlocks[me.top] = undefined;
		   me.top--; 
		   if (me.top >= 0) {
           		me.CodeBlocks[me.top].Wrapper.addClass("codeStackTop"); 
           }
		};
        
        console.log("CodeStack" + me.ID);
        return me;
      };
})();


/*!
 * ArrayChart;   using divs
 */
var ArrayChart = new (function(){
    window.__ArrayChart_InstanceCounter = window.__ArrayChart_InstanceCounter || 0;
    
    return function(ChartContainer,TheDataLength){

        // Main Variables
        var me = {}
        me.ID = window.__ArrayChart_InstanceCounter++;

		me.DataLength = TheDataLength;
		me.Columns = []; // array of divs
       	me.Wrapper =  $('<div/>').addClass("arrayChart");
		
		me.reset = function() {
			me.setDataZero();
		}
		
		me.setDataZero = function() {
			me.height = me.Wrapper.height();
			for (var i = 0, l = me.DataLength; i < l; i++) { 
                me.Columns[i].height(0).css("border-top-width", me.height);
            }
		}
		
        me.setData = function(max, start, data){
            assert(data.length + start <= me.DataLength, "data.length > me.DataLength"); 
            me.dataMax = max; 
            me.height = me.Wrapper.height();
            me.scale = me.height / me.dataMax; 
            for (i = 0, l = data.length; i < l; i++) { 
            	var h = Math.floor(me.scale * data[i]); 
			    me.Columns[start+i].height(h).css("border-top-width", me.height -h);
            }
        }
				
		me.Wrapper.appendTo(ChartContainer);
		
		// need width
		var w = Math.floor( me.Wrapper.width() / me.DataLength );
		for (var i = 0; i < me.DataLength; i++) {
			me.Columns[i] = $("<div/>").addClass("column").width(w).attr("id", "col" + i);
			me.Wrapper.append(me.Columns[i]);
		}
		me.Wrapper.width(w * me.DataLength);
        console.log("ArrayChart" + me.ID);
		return me;
    }
})();

/*!
 * ColoredBoxes 
 */
var ColoredBoxes = new (function(){
    window.__ColoredBoxes_InstanceCounter = window.__ColoredBoxes_InstanceCounter || 0;
    
    return function(ChartContainer){

        // Main Variables
        var me = {}
        me.ID = window.__ColoredBoxes_InstanceCounter++;

		me.Boxes = []; // array of divs
       	me.Wrapper =  $('<div/>').addClass("coloredBoxes");
		
		me.reset = function() {
			me.Wrapper.children().remove(); 
			me.Boxes = [];
		}
		        
		me.setBox = function(i, val, col) {
			if (!me.Boxes[i]) {
				me.Boxes[i] = $("<div/>").addClass("box").attr("id", "box" + i).appendTo(me.Wrapper);
			}
			if (col) {
				me.Boxes[i].css("border-color", col);
			} else {
				me.Boxes[i].css("border-color", '');
			}
			me.Boxes[i].html(val);
			return me.Boxes[i];
		}
		
		me.pushBox = function(val, col) {
			return me.setBox(me.Boxes.length, val, col);
		}

		me.popBox = function() {
			var lst = me.Boxes.pop(); 
			lst.remove(); 
			return lst;
		}
		
		me.Wrapper.appendTo(ChartContainer);
		
        console.log("ColoredBoxes" + me.ID);
		return me;
    }
})();


/*!
 * RangeBar;a div posing as a value bar 
 */
var RangeBar = new (function(){
    window.__RangeBar_InstanceCounter = window.__RangeBar_InstanceCounter || 0;
    
    return function(ChartContainer, TheDataLength, color, width){
        // Main Variables
        var me = {}
        me.ID = window.__RangeBar_InstanceCounter++;

		me.DataLength = TheDataLength;
		
       	me.Wrapper =  $('<div/>').addClass("rangeBar");
       	if (width != undefined) {
       	    me.Wrapper.width(width);
       	} 
       	
       	if (color == undefined) {
       		color= me.Wrapper.css("color");
       	}
       	me.Bar = $('<div/>').css("background-color", color).appendTo(me.Wrapper);
		
        me.setDataRange = function(from, len){
        	me.Range = { min : from, len: len};
        	var w = me.Wrapper.width();
        	var scale = w / me.DataLength;
        	/* we do but should not just assume that this is in px */
        	var pad = parseInt(me.Bar.css("padding-left").slice(0,-2));
        	me.Bar.css({ width: len * scale, left : 5 + from * scale });
        }
             
        me.Wrapper.appendTo(ChartContainer); 
        me.Bar.height(me.Wrapper.height());
        me.setDataRange(0,0); // show in background color 

        console.log("RangeBar" + me.ID);
		return me;
    }
})();

var ActionList = new (function(){
    window.__ActionList_InstanceCounter = window.__ActionList_InstanceCounter || 0;
    return function(){
        // Main Variables
        var me = {}
        me.ID = window.__ActionList_InstanceCounter++;
        me.steps = new Array();   // array of objects with obj.fct and obj.params array ;
        me.curStep = -1; 
		me.timeoutId = undefined; 
		
		// call back functions 
		me.stateChange = function(actionListObj) { }   
		
		me.actionAllowed = function(fct) {
			if (me.timeoutId)   { 
				return  (fct == me.doStop) 
			}
			if (me.curStep < (me.steps.length-1)) { 
				if ((fct == me.doMultiSteps) || (fct == me.doRun)) {
					return true;
				}
			}
			return (fct == me.reset);
		}    

		me.reset = function() {
			if (!me.actionAllowed(me.reset)) {
				return undefined;
			}
			me.curStep = -1;
			if (me.timeoutId) {
				window.clearTimeout(me.timeoutID);
				me.timeoutId = undefined;
			}
			me.running = false;
			me.stateChange(me);
		}

		me.pushStep = function(fct, duration, param_array){
        	var step = new Object(); 
        	step.fct = fct;
        	step.duration = duration; 
        	step.params = param_array; 
        	me.steps[me.steps.length] = step; 
        	return step;
        }
        		
        me._doNextStep = function(){
        	me.curStep++; 
        	if (me.curStep < me.steps.length) {
        		var step = me.steps[me.curStep]; 
        		step.fct.apply(undefined, step.params); 
        		return step.duration;
        	} else {
        		me.curStep--;
        		me.stateChange(me);
        		return undefined;
        	}
        }
        			
		me.doMultiSteps = function() {
			if (!me.actionAllowed(me.doMultiSteps)) {
				return undefined;
			}
			return me._doMultiSteps(); 
		}
	
		me.doRun = function() {
			if (!me.actionAllowed(me.doRun)) {
				return undefined;
			}
			me._doRunSteps();
			me.stateChange(me);
			return true;
		}
		
		me.doStop = function() {
			if (!me.actionAllowed(me.doStop)) {
				return undefined;
			}
			window.clearTimeout(me.timeoutId);
			me.timeoutId = undefined;
			me.stateChange(me);
			return true;
		}

		me._doMultiSteps = function() {
			var duration = me._doNextStep();
			while (duration != undefined && duration == 0) {
				duration = me._doNextStep();
			}
			if (me.curStep == (me.steps.length -1)) {
				me.stateChange(me);
			}
			return duration;
		}
				
        me._doRunSteps = function() {
        	var duration;
        	while (true) { 
        		duration = me._doMultiSteps(); 
        		if (duration == undefined) {
        			me.timeoutId = undefined; 
        			me.stateChange(me);
        		    window.setTimeout(function() { me.stateChange(me); }, 10);
        			break;
        		}
        		if (duration > 0) { 
	        		me.timeoutId = window.setTimeout(function() { ActionList._doRunSteps(me); }, duration);
	        		break;
	        	} 
        	}
		}
       
        
        console.log("ActionsList" + me.ID);
		return me; 
	}
})();

ActionList._doRunSteps = function(me) {
	me._doRunSteps(); 
}


/**
 * from: http://stackoverflow.com/questions/7390074/assertions-in-javascript
 * Log a message to console:
 *  either use jquery's console.error
 *  or a thrown exception.
 *
 *  call initDevMode(); before use to activate
 *  use with:
 *      assert(<condition>, "message");
 *      eg: assert(1 != 1, "uh oh!");
 *
 *  Log errors with:
 *       errorLog(message);
 *       eg: errorLog(xhr.status);
 */
assert = function(test, msg) {"use strict";
};

errorLog = function(msg) {"use strict";
};

initDevMode = function() {"use strict";
	assert = function(test, msg) {
		msg = msg || "(no error message)";
		if (!test) {
			try {
				throw new Error();
			} catch(e) {
				var foo = e, lines = e.stack.split('\n'), i;
				for (i in lines) {
					if (i > 2) {
						errorLog(msg + lines[i]);
					}
				}
			}
			throw ("Assertion failed with: " + msg);
		}
	};
};

initDevMode();
