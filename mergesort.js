/*global $, assert, CodeBlock, CodeStack, ArrayChart, RangeBar */
/*global MergeSort, MergeSortV2 */

var TheTrace;
var TheLineCounter;
var LineCounter;
var TheStackTrace;

var TheLevelCounter;
var LevelCounter;

var TheActionList = new ActionList();

var TheArrayChart;
var TheRangeCharts = [];
var AlgoIndex;
var TheAlgo;

function doRun() {"use strict";
	var isStep = TheActionList.doNextStep();
	while (isStep !== undefined) {
		isStep = TheActionList.doNextStep();
	}
	return isStep;
}

function doStep(action_obj) {"use strict";
	var level, topBlock, stackTop, color, divs;
	// TheStackTrace.getTopCodeBlock().Wrapper.css("background-color")
	if (action_obj.action === "step") {
		return;
	}
	if (action_obj.action === "pop") {
		// TheRangeCharts[TheStackTrace.top].Wrapper.remove();
		TheStackTrace.pop();
		TheRangeCharts[TheRangeCharts.length - 1].Wrapper.remove();
		TheRangeCharts.pop();
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
			LevelCounter[level] = LevelCounter[level] + 1;
			TheLevelCounter.setCurLine(level, LevelCounter[level].toString());
		}
		stackTop = TheStackTrace.top;
		color = $("#ColorPalette div").eq(stackTop).css("color");
		TheRangeCharts.push(new RangeBar($("#TheRangeCharts"), TheAlgo[AlgoIndex].nLst, color, TheArrayChart.Wrapper.width()));
	}
	if (action_obj.action === "curline" || action_obj.action === "push") {
		TheTrace.setCurLine(action_obj.line);
		LineCounter[action_obj.line] = LineCounter[action_obj.line] + 1;
		TheLineCounter.setCurLine(action_obj.line, LineCounter[action_obj.line].toString());
		TheStackTrace.getTopCodeBlock().setCurLine(action_obj.line, action_obj.text);
		return;
	}
	if (action_obj.action === "setRange") {
		TheRangeCharts[TheRangeCharts.length - 1].setDataRange(action_obj.i, action_obj.n);
		color = $("#ColorPalette div").eq(TheStackTrace.top).css("color");
		divs = TheArrayChart.Wrapper.children().slice(action_obj.i, action_obj.i + action_obj.n);
		divs.css("background-color", color).css("opacity", 1.0);
		return;
	}
	if (action_obj.action === 'setSortedSlice') {
		assert(action_obj.n === action_obj.array.length);
		TheArrayChart.setData(TheAlgo[AlgoIndex].maxVal, action_obj.i, action_obj.array);
		divs = TheArrayChart.Wrapper.children().slice(action_obj.i, action_obj.i + action_obj.n);
		color = $("#ColorPalette div").eq(TheStackTrace.top).css("color");
		divs.removeClass("unsorted").addClass("sorted").css("background-color", color);
		return;
	}
	assert(false, "should never get here");
	return;
}

function resetButtons(actionList) {"use strict";
	var nxt = $("#next"), run = $("#run"), stop = $("#stop"), reset = $("#reset"), opacity;

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

function chooseProblem(algo, index) {
	"use strict"; 
	var i, l, color, action;
	
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
	LineCounter =  [];
	for ( i = 0; i < algo.code.length; i++) {
		LineCounter.push(0);
	}

	if (TheLevelCounter) {
		TheLevelCounter.Wrapper.remove();
	}
	LevelCounter = [];
	LevelCounter.push(1);
	TheLevelCounter = new CodeBlock($("#TheLevelCounter"), 1, "1");

	$("#algo").html(algo.name);
	//$("#log").html("LOG");

	if (TheArrayChart !== undefined) {
		TheArrayChart.Wrapper.remove();
	}
	TheArrayChart = new ArrayChart($("#TheArrayChart"), algo[index].nLst);
	TheArrayChart.Wrapper.height($('#TheCode').children('.codeBlock').eq(0).height());
	TheArrayChart.setData(algo[index].maxVal, 0, algo[index].lst);
	TheArrayChart.Wrapper.children("div").addClass("unsorted");

	l = TheRangeCharts.length;
	for (i = 0; i < l; i++) {
		TheRangeCharts[i].Wrapper.remove();
	}
	TheRangeCharts = [];
	color = $("#ColorPalette div").eq(0).css("color");
	TheRangeCharts[0] = new RangeBar($("#TheRangeCharts"), algo[index].nLst, color, TheArrayChart.Wrapper.width());
	//TheRangeCharts[0].Wrapper.parent().css("padding-left", TheArrayChart.Wrapper.parent().css("padding-left"));

	if (TheAlgo === algo && AlgoIndex === index) {
		TheActionList.reset();
	} else {
		TheActionList = new ActionList();
		for (i = 0, l = algo[index].steps.length; i < l; i++) {
			action = algo[index].steps[i];
			TheActionList.pushStep(doStep, (action.action === "step") ? 200 : 0, [action]);
		}
	}

	$("#data").html(algo[index].name);
	$('#TheStackTrace').width($("#TheCode").width());
	AlgoIndex = index;
	TheAlgo = algo;
	TheActionList.doMultiSteps();
	resetButtons(TheActionList);
	TheActionList.stateChange = resetButtons;
	return true;
}

function loadProblem(algo, n) {	
	"use strict";
	if (n >= 50) {
		chooseProblem(algo, 2);
	} else {
		if (n >= 25) {
			chooseProblem(algo, 1);
		} else {
			chooseProblem(algo, 0);
		}
	}
}

function onLoad() {"use strict";
	var params, n, algo; 
	params = getUrlParams();
	n = parseInt(params.n, 10);
	algo = params.algo;
	if (algo === "mergeSortV2") { 
		algo = MergeSortV2; 
	} else { 
		algo = MergeSort; 
	}
	loadProblem(algo, n);
}



