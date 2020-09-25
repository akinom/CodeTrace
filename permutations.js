/*global $, assert, CodeBlock, CodeStack, ColoredBoxes, getUrlParams */
/*global AboutAlgo */

var TheTrace;
var TheLineCounter;
var LineCounter;
var TheStackTrace;

var TheGlobalAvail;
var TheGlobalPerm;

var TheLevelCounter;
var LevelCounter;

var TheActionList = new ActionList();

var AlgoIndex;
var TheAlgo;
var TheColors = [];

function doRun() {"use strict";
	var isStep = TheActionList.doNextStep();
	while (isStep !== undefined) {
		isStep = TheActionList.doNextStep();
	}
	return isStep;
}

function doStep(action_obj) {"use strict";
	var level, topBlock, stackTop, color, i, l;

	// TheStackTrace.getTopCodeBlock().Wrapper.css("background-color")
	if (action_obj.action === "step") {
		return;
	}
	if (action_obj.action === "pop") {
		// TheRangeCharts[TheStackTrace.top].Wrapper.remove();
		TheStackTrace.pop();
		TheTrace.setCurLine(undefined);
		topBlock = TheStackTrace.getTopCodeBlock();
		if (topBlock) {
			topBlock.setCurLine(undefined);
		}
		return;
	}
	if (action_obj.action === "push") {
		level = TheStackTrace.pushCode(TheAlgo.code);
		if (LevelCounter.length <= level) {
			LevelCounter[level] = 1;
			TheLevelCounter.appendLine("1");
		} else {
			LevelCounter[level]++;
			TheLevelCounter.setCurLine(level, LevelCounter[level].toString());
		}
	}
	if (action_obj.action === "curline" || action_obj.action === "push") {
		TheTrace.setCurLine(action_obj.line);
		LineCounter[action_obj.line] = LineCounter[action_obj.line] + 1;
		TheLineCounter.setCurLine(action_obj.line, LineCounter[action_obj.line].toString());
		TheStackTrace.getTopCodeBlock().setCurLine(action_obj.line, action_obj.text);
		return;
	}
	if (action_obj.action === "globalval")  {
		if (action_obj.name === "avail")  {
			for (i = 0; i < TheAlgo[AlgoIndex].n; i++) {
				if (action_obj.val.indexOf(i) >= 0) {
					TheGlobalAvail.setBox(i, i, TheColors[i]);
				} else {
					TheGlobalAvail.setBox(i, i, "rgba(0,0,0,0)");
				}
			}
			return;
		}
		if (action_obj.name === "perm")  {
			for (i=0, l = action_obj.val.length; i < l; i++) {
				TheGlobalPerm.setBox(i, action_obj.val[i], TheColors[action_obj.val[i]] );
			}
			for (i = l; i < TheAlgo[AlgoIndex].n; i++) {
				TheGlobalPerm.setBox(i, "&nbsp;", "rgba(0,0,0,0)");
			}
			return;
		}
	}
	if (action_obj.action === "printperm")  {
		TheGlobalPerm.Wrapper.clone().appendTo($("#Permutations"));
		return;
	}
	if (action_obj.action === "localval")  {
		/* we'll see */
		return;
	}
	assert(false, "should never get here");
	return;
}

function resetButtons(actionList) {"use strict";
	var nxt, run, stop, reset, opacity;
	
	nxt = $("#next");
	run = $("#run");
	stop = $("#stop"); 
	reset = $("#reset");

	opacity = (actionList.actionAllowed(actionList.doMultiSteps)) ? 1.0 : 0.5;
	nxt.css("opacity", opacity);
	opacity = (actionList.actionAllowed(actionList.doRun)) ? 1.0 : 0.5;
	run.css("opacity", opacity);
	opacity = (actionList.actionAllowed(actionList.doStop)) ? 1.0 : 0.5;
	stop.css("opacity", opacity);
	opacity = (actionList.actionAllowed(actionList.reset)) ? 1.0 : 0.5;
	reset.css("opacity", opacity);
}

function animate(fct) {"use strict";
	var suc = fct();
}

function chooseProblem(algo, index) {"use strict";
	var action, i, l;

	if (!TheActionList.actionAllowed(TheActionList.reset)) {
		return undefined;
	}

	if (TheTrace) {
		TheTrace.Wrapper.remove();
	}
	TheTrace = new CodeBlock($("#TheCode"), algo.code);

	if (TheStackTrace) {
		TheStackTrace.Wrapper.remove();
	}
	TheStackTrace = new CodeStack($("#TheStackTrace"), algo.code, $("#ColorPalette"));

	if (TheLineCounter) {
		TheLineCounter.Wrapper.remove();
	}
	TheLineCounter = new CodeBlock($("#TheLineCounter"), algo.code.length, "0");
	LineCounter = [];
	for ( i = 0; i < algo.code.length; i++) {
		LineCounter.push(0);
	}

	if (TheLevelCounter) {
		TheLevelCounter.Wrapper.remove();
	}
	LevelCounter = [];
	LevelCounter.push(1);
	TheLevelCounter = new CodeBlock($("#TheLevelCounter"), 1, "1");

	if (TheGlobalAvail) {
		TheGlobalAvail.Wrapper.remove();
	} 
	TheGlobalAvail = new ColoredBoxes($("#TheGlobalAvail"));
	
	if (TheGlobalPerm) { 
		TheGlobalPerm.Wrapper.remove(); 
	}
	TheGlobalPerm = new ColoredBoxes($("#TheGlobalPerm"));
	for (i=0; i < algo[index].n; i++) {
		TheGlobalPerm.setBox(i, "&nbsp;", "rgba(0,0,0,0)");
	}
	$("#Permutations").children().remove(); 
	
	$("#data").html(algo[index].n);
	//$("#log").html("LOG");

	if (TheAlgo === algo && AlgoIndex === index) {
		TheActionList.reset();
	} else {
		TheActionList = new ActionList();
		for (i = 0, l = algo[index].steps.length; i < l; i++) {
			action = algo[index].steps[i];
			TheActionList.pushStep(doStep, (action.action === "step") ? 200 : 0, [action]);
		}
	}

	$('#TheStackTrace').width($("#TheCode").width());
	AlgoIndex = index;
	TheAlgo = algo;
	TheActionList.doMultiSteps();
	resetButtons(TheActionList);
	TheActionList.stateChange = resetButtons;
	return true;
}

function onLoad() {"use strict";
	var colorDivs, i, l, params, n;
	
	colorDivs = $("#PermutationColors div");
	for (i =0, l = colorDivs.length; i < l; i++) {
		TheColors[i] = colorDivs.eq(i).css("color");
	}

	params = getUrlParams();
	n = parseInt(params.n, 10);
	if (isNaN(n)) { n = 3; }
	if (n < 1) { n = 1; } 
	if (n > 4) { n = 4; } 
	chooseProblem(AboutAlgo, n);
}

