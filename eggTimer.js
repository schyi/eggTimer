$(document).ready(function(){
	var timer = {
		minutes : 0,
		seconds :  0, 
		isOn : false,
		hitMax: function () { 
			return this.minutes > 15;
		},
		blink: false,
		print: function () {
			var min = this.minutes < 10 ? "0" : "";
			var sec = + this.seconds < 10 ? "0" : "";
			if (this.hitMax() && this.blink) {
					$("#timer-text").text("OVERCOOKED");
			}
			else {
				$("#timer-text").text(min
					+ this.minutes
					+ ":"
					+ sec
					+ this.seconds);
			}
			this.blink = !this.blink;
		}
	};

	var eggWhite = $("#egg-white");
	var eggYolk = $("#yolk-center");
	var eggDonenessText = $("#egg-doneness");

	var whiteStage = {
		raw: { "background-color": "#333333", color: "#FFFFFF" },
		runny: { "background-color": "#999999", color: "#333333" },
		gel: { "background-color": "#cccccc", color: "#333333" },
		solid: { "background-color": "#FFFFFF", color: "#333333" },
		print : function (minute) {
			var currentState = {};
			if (minute < 3) {
				currentState = this.raw;
			}
			else if (minute < 5) {
				currentState = this.runny;
			}
			else if (minute < 6) {
				currentState = this.gel;
			}
			else {
				currentState = this.solid;
			}
			eggWhite.css(currentState);
		}
	};
	var yolkStage = {
		raw: { "background-color": "#ff4500", color: "#333333" },
		runny: { "background-color": "#ff8000", color: "#333333" },
		gel: { "background-color": "#ffbf00", color: "#333333" },
		solid: { "background-color": "#ffe066", color: "#333333" },
		notOvercooked: {"border" : "none"},
		overcooked: { "border" : "solid 4pt #7C8864"},
		print : function (minute) {
			var currentState = {};
			if (minute < 5) {
				currentState = this.raw;
				eggDonenessText.text("RAW");
			}
			else if (minute < 7) {
				currentState = this.runny; 
				eggDonenessText.text("RUNNY");
			}
			else if (minute < 9) {
				currentState = this.gel;
				eggDonenessText.text("GOOEY");
			}
			else if (minute < 11){
				currentState = this.solid;
				eggDonenessText.text("JUST COOKED THROUGH");
			}
			else {
				eggDonenessText.text("HARD");
			}
			eggYolk.css(currentState);

			if (minute > 14) {
				eggYolk.css(this.overcooked);
				eggDonenessText.text("CHALKY");
			}
			else {
				eggYolk.css(this.notOvercooked);
			}
		}
	};

	var t; // timespan val from javascript
	var startStopButton = $("#start-stop");
	startStopButton.click(
		function() {
			startCount();
		}
	);
	$("#reset").click(onReset);

	$('#eggslider').slider({
		formatter: function(value) {
			return 'Minute: ' + value;
			}
		}).on('change', function(slideEvt) {
			resetCount();
			timer.minutes = slideEvt.value.newValue;
			timer.print();
			adjustEggStage();
			});

	function adjustEggStage() {
		whiteStage.print(timer.minutes);
		yolkStage.print(timer.minutes);
	}

	function startCount() {
		if (!timer.isOn) {
			timer.isOn = true;
			countDown();
			startStopButton.text("Pause");
			startStopButton.click(stopCount);
			startStopButton.removeClass("btn-success");
			startStopButton.addClass("btn-danger");
		}
	}

	function countUp() {
		t = setInterval(function () 
			{
				timer.seconds ++; 
				if (timer.seconds % 60 === 0 ) 
				{						timer.minutes ++; 
					timer.seconds = 0;
					adjustEggStage();
				}
			timer.print();}, 1000);
	}

	function countDown() {
		if (timer.minutes > 0) {
			t = setInterval(
				function () {
					if (timer.seconds == 0) {
						timer.minutes --;
						timer.seconds = 60;
					}
					timer.seconds --; 
					timer.print();
					}, 1000);
		}
	}

	function stopCount() {
		clearInterval(t);
		timer.isOn = false;
		startStopButton.text("Start");
		startStopButton.click(startCount);
		startStopButton.removeClass("btn-danger");
		startStopButton.addClass("btn-success");
	}

	var sliderFormatter = function (silderValue) {
		// return something like... Yolk = raw, gooey, 
	}

	function onReset() {
		$('#eggslider').slider('setValue', 0, {
		formatter: function(value) {
			return 'Minute: ' + value;
			}
		});
		resetCount();
		console.log("after resetCount, timer.minutes = " + timer.minutes);
		adjustEggStage();
		eggDonenessText.text("<Slide below to Adjust Doneness>");
	}

	function resetCount() {
		if (timer.isOn) {
			stopCount();
		}
		timer.seconds = 0; 
		timer.minutes = 0; 
		timer.print();
	}
});