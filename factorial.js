var i;

var TheTrace = undefined;
var TheLineCounter = undefined;
var LineCounter = undefined;
var TheStackTrace = undefined;

var TheLevelCounter = undefined;
var LevelCounter = undefined;

var TheActionList = new ActionList();

var AlgoIndex = undefined;
var TheAlgo = undefined;

function doRun() {
	var isStep = TheActionList.doNextStep();
	while (isStep != undefined) {
		isStep = TheActionList.doNextStep();
	}
	return isStep;
}


function doStep(action_obj) {
	// TheStackTrace.getTopCodeBlock().Wrapper.css("background-color")
	if (action_obj.action == "step") {
		return;
	}
	if (action_obj.action == "pop") {
		// TheRangeCharts[TheStackTrace.top].Wrapper.remove();
		TheStackTrace.pop();
		TheTrace.setCurLine(undefined);
		var top = TheStackTrace.getTopCodeBlock();
		if (top) {
			top.setCurLine(undefined);
		}
		return;
	}
	if (action_obj.action == "push") {
		var level = TheStackTrace.pushCode(TheAlgo.code);
		if (LevelCounter.length <= level) {
			LevelCounter[level] = 1;
			TheLevelCounter.appendLine("1");
		} else {
			LevelCounter[level]++;
			TheLevelCounter.setCurLine(level, "" + LevelCounter[level]);
		}
	}
	if (action_obj.action == "curline" || action_obj.action == "push") {
		TheTrace.setCurLine(action_obj.line);
		LineCounter[action_obj.line] = LineCounter[action_obj.line] + 1;
		TheLineCounter.setCurLine(action_obj.line, "" + LineCounter[action_obj.line]);
		TheStackTrace.getTopCodeBlock().setCurLine(action_obj.line, action_obj.text);
	    return;
	}
	if (action_obj.action == "line") {
		TheTrace.setCurLine(action_obj.line);
		TheStackTrace.getTopCodeBlock().setCurLine(action_obj.line, action_obj.text);
	    return;
	}
	assert(false, "should never get here");
	return;
}

function resetButtons(actionList) {
	var nxt = $("#next");
	var run = $("#run");
	var stop = $("#stop");
	var reset = $("#reset");

	var opacity = (actionList.actionAllowed(actionList.doMultiSteps)) ? 1.0 : 0.5;
	nxt.css("opacity", opacity);
	opacity = (actionList.actionAllowed(actionList.doRun)) ? 1.0 : 0.5;
	run.css("opacity", opacity);
	opacity = (actionList.actionAllowed(actionList.doStop)) ? 1.0 : 0.5;
	stop.css("opacity", opacity);
	opacity = (actionList.actionAllowed(actionList.reset)) ? 1.0 : 0.5;
	reset.css("opacity", opacity);
}

function animate(fct) {
	console.log('anaimate');
	var suc = fct();
}


function chooseProblem(algo, index) {
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
	LineCounter = new Array();
	for ( i = 0; i < algo.code.length; i++) {
		LineCounter.push(0);
	}

	if (TheLevelCounter) {
		TheLevelCounter.Wrapper.remove();
	}
	LevelCounter = new Array();
	LevelCounter.push(1);
	TheLevelCounter = new CodeBlock($("#TheLevelCounter"), 1, "1");

	$("#algo").html(algo.name);
	//$("#log").html("LOG");

	if (TheAlgo == algo && AlgoIndex == index) {
		TheActionList.reset();
	} else {
		TheActionList = new ActionList();
		for (var i = 0, l = algo[index].steps.length; i < l; i++) {
			action = algo[index].steps[i];
			TheActionList.pushStep(doStep, (action.action == "step") ? 200 : 0, [action]);
		}
	}

	$("#TheAlgoName").html(algo[index].name);
	$('#TheStackTrace').width($("#TheCode").width());
	AlgoIndex = index;
	TheAlgo = algo;
	TheActionList.doMultiSteps();
	resetButtons(TheActionList);
	TheActionList.stateChange = resetButtons;
	return true;
}

function onLoad() {
	params = getUrlParams();
	n = parseInt(params.n, 10);
	if (isNaN(n)) { n = 3; }
	if (n < 0) { n = 0; }
	if (n > 7) { n = 7 }
	if (AboutAlgo[n] === undefined) {
		n = 3;
	}
	chooseProblem(AboutAlgo, n);
}

