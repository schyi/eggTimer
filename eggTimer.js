$(document).ready(function(){


	var timer = {
		minutes : 0,
		seconds :  0, 
		isOn : false,
		countDown : false,
		hitMax: function () { 
			return this.minutes > 15;
		},
		blink: false
	};
	var whiteStage = {
		raw: { "background-color": "#333333", color: "#FFFFFF" },
		gel: { "background-color": "#999999", color: "#333333" },
		milky: { "background-color": "#cccccc", color: "#333333" },
		solid: { "background-color": "#FFFFFF", color: "#333333" }
	};
	var yolkStage = {
		raw: { "background-color": "#ff6600", color: "#333333" },
		runny: { "background-color": "#ff8000", color: "#333333" },
		gel: { "background-color": "#ffbf00", color: "#333333" },
		solid: { "background-color": "#ffe066", color: "#333333" },
		notOvercooked: {"border" : "none"},
		overcooked: { "border" : "solid 4pt #7C8864"}
	};

	var eggWhite = $("#egg-white");
	var eggYolk = $("#yolk-center");
	var t; // timespan val from javascript
	var startStopButton = $("#start-stop");
	startStopButton.click(
		function() {
			startCount();
		}
	);
	$("#reset").click(resetCount);

	var eggSlider = $('#eggslider').slider({
		formatter: function(value) {
			return 'Minute: ' + value;
			}
		});
	eggSlider.on('change', function(slideEvt) {
			resetCount();
			timer.minutes = slideEvt.value.newValue;
			// set to countDown mode if not zero
			if (slideEvt.value.newValue != 0) {
				timer.countDown = true;
			}
			else {
				timer.countDown = false;
			}
			printTimer();
			adjustEggStage(timer.minutes);
			});


	function printTimer() {
		var min = timer.minutes < 10 ? "0" : "";
		var sec = + timer.seconds < 10 ? "0" : "";
		if (timer.hitMax() && timer.blink) {
				$("#timer-text").text("OVERCOOKED");
		}
		else {
			$("#timer-text").text(min
				+ timer.minutes
				+ ":"
				+ sec
				+ timer.seconds);
		}
		timer.blink = !timer.blink;
	}

	function adjustEggStage(minute) {
		switch(minute) {
			case 0: 
			case 1:
			case 2:
				eggWhite.css(whiteStage.raw);
				eggYolk.css(yolkStage.raw);
				break;
			case 3: 
			case 4:
				eggWhite.css(whiteStage.gel);
				break;
			case 5:
			case 6: 
				eggWhite.css(whiteStage.milky);
				eggYolk.css(yolkStage.runny);
				break;
			case 7:
			case 8:
			case 9:
			case 10:
				eggWhite.css(whiteStage.solid);
				eggYolk.css(yolkStage.gel);
				break;
			case 11: 
			case 12: 
			case 13: 
				eggWhite.css(whiteStage.solid);
				eggYolk.css(yolkStage.solid);
				break;
			case 14: 
			case 15: 
			default:
				eggWhite.css(whiteStage.solid);
				eggYolk.css(yolkStage.solid);
		}
		if (minute >= 15) {
				eggYolk.css(yolkStage.overcooked);
		}
		else {
			eggYolk.css(yolkStage.notOvercooked);
		}
	}

	function startCount() {
		if (!timer.isOn) {
			timer.isOn = true;
			if (timer.countDown) {
				t = setInterval(function () {
					if (timer.seconds == 0) {
						timer.minutes --;
						timer.seconds = 60;
					}
					timer.seconds --; 
					printTimer();
					}, 1000);
			}
			else {
				t = setInterval(function () {
					timer.seconds ++; 
					if (timer.seconds % 60 === 0 ) {
						timer.minutes ++; 
						timer.seconds = 0;
						adjustEggStage(timer.minutes);
					}
					printTimer();
					}, 1000);
			}
			
			startStopButton.text("Pause");
			startStopButton.click(stopCount);
			startStopButton.removeClass("btn-success");
			startStopButton.addClass("btn-danger");
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

	function resetCount() {
		if (timer.isOn) {
			stopCount();
		}

		timer.seconds = 0; 
		timer.minutes = 0; 
		printTimer();
	}
});