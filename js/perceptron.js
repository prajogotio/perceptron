var states = {};

addEventListener("DOMContentLoaded", function(e) {
	states.canvas = document.getElementById("perceptron-canvas");
	states.g = states.canvas.getContext('2d');
	states.g.fillStyle = "rgb(255, 240, 234)";
	states.g.fillRect(0, 0, 1024, 768);
	states.points = [];
	states.w = [];
	states.prevLength = 0;
	states.LIMIT_ITERATION = 200000;
	states.canvas.addEventListener("contextmenu", function(e) {
		e.preventDefault();
		e.stopPropagation();
	}, false);
	states.canvas.addEventListener("mousedown", function(e) {
		document.getElementById("loading").innerHTML = "Perceptron is recalculating...";
		playLoading();
		var left = e.pageX - states.canvas.offsetLeft;
		var top = e.pageY - states.canvas.offsetTop;
		if(e.which == 1) {
			drawOnCanvas(left, top, renderTrueCircle);
			states.points.push({x : [left, top], y : 1});
		} else {
			drawOnCanvas(left, top, renderFalseCircle);
			states.points.push({x : [left, top], y : -1});
		}
		setTimeout(update, 100);
	}, false);


	document.getElementById("reset").addEventListener("click", function(e) {
		states.points = [];
		states.g.fillStyle = "rgb(255, 240, 234)";
		states.g.fillRect(0, 0, 1024, 768);
	});

	document.getElementById("iterlimit").addEventListener("change", function(e) {
		states.LIMIT_ITERATION = document.getElementById("iterlimit").value;
		document.getElementById("loading").innerHTML = "Iteration Limit is now " + document.getElementById("iterlimit").value;
		playLoading();
		setTimeout(stopLoading, 1000);
	});
});


function update() {
	if(states.points.length == 0) return;
	if(states.points.length == states.prevLength) return;
	states.prevLength = states.points.length;
	states.g.fillStyle = "rgb(255, 240, 234)";
	states.g.fillRect(0, 0, 1024, 768);
	for (var i = 0; i < states.points.length; ++i) {
		drawOnCanvas(states.points[i].x[0], states.points[i].x[1], (states.points[i].y > 0 ? renderTrueCircle : renderFalseCircle) );
	}
	recomputePerceptron();
	drawPerceptron();
	setTimeout(stopLoading, 200);
}

function drawOnCanvas(left, top, renderer) {
	
	states.g.save();
	states.g.translate(left, top);
	renderer();
	states.g.restore();
}

function renderTrueCircle() {
	states.g.beginPath();
	states.g.strokeStyle = "green";
	states.g.lineWidth = 3;
	states.g.arc(0, 0, 10, 0, 2*Math.PI, false);
	states.g.stroke();
}

function renderFalseCircle() {
	states.g.beginPath();
	states.g.strokeStyle = "red";
	states.g.lineWidth = 3;
	states.g.arc(0, 0, 10, 0, 2*Math.PI, false);
	states.g.stroke();
}

function recomputePerceptron() {
	w = [Math.random(), Math.random(), Math.random()];
	p = [0, 0, 0];
	error = states.points.length;
	for (var iteration = 0; iteration < states.LIMIT_ITERATION; ++iteration) {
		for(var i = 0; i < states.points.length; ++i){
			var x = states.points[i].x;
			var y = states.points[i].y;
			var Y = w[0] + w[1] * x[0] + w[2] * x[1];
			Y = Math.sign(Y);
			if(Y * y > 0) continue;
			w[0] = w[0] + y;
			w[1] = w[1] + y * x[0];
			w[2] = w[2] + y * x[1];
		}
		var curError = 0;
		for (var i = 0; i < states.points.length; ++i) {
			var curY = w[0] + states.points[i].x[0] * w[1] + states.points[i].x[1] * w[2];
			curY = Math.sign(curY);
			if (curY * states.points[i].y <= 0) ++curError;
		}
		if(curError < error) {
			p[0] = w[0];
			p[1] = w[1];
			p[2] = w[2];
			error = curError;
		}
		if(error == 0) break;
	}
	states.w[0] = p[0];
	states.w[1] = p[1];
	states.w[2] = p[2];
	states.error = error;
}


function drawPerceptron() {
	states.g.beginPath();
	states.g.lineWidth = "4";
	states.g.strokeStyle = "indigo";
	states.g.moveTo(0, -states.w[0]/states.w[2]);
	states.g.lineTo(1024, (-states.w[0] - states.w[1] * 1024) / states.w[2]);
	states.g.stroke();
}

function playLoading() {
	document.getElementById("loading").style.setProperty("opacity", "1");
}

function stopLoading() {
	document.getElementById("loading").style.setProperty("opacity", "0");

}