$(document).ready(function(){


	var timer = {
		minutes : 0,
		seconds : 0, 
		isOn : false
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
		solid: { "background-color": "#ffe066", color: "#333333" }
	};

	var eggWhite = $("#egg-white");
	var eggYolk = $("#yolk-center");
	var t; // timespan val from javascript
	var startStopButton = $("#start-stop");
	startStopButton.click(
		function() {
			eggYolk.css(yolkStage.raw);
			startCount();
		}
	);
	$("#reset").click(resetCount);

	$('#eggslider').slider({
		formatter: function(value) {
			return 'Minute: ' + value;
			}
		})
		.on('slide', function(slideEvt) {
		timer.minutes = slideEvt.value;
		printTimer();
		adjustEggStage(timer.minutes);});


	function printTimer() {
		var min = timer.minutes < 10 ? "0" : "";
		var sec = + timer.seconds < 10 ? "0" : "";
		$("#timer-text").text(
				min
				+ timer.minutes
				+ ":"
				+ sec
				+ timer.seconds);
	}

	function adjustEggStage(minute) {
		switch(minute) {
			case 0: 
				eggWhite.css(whiteStage.raw);
				eggYolk.css(yolkStage.raw);
				break;
			case 3: 
				eggWhite.css(whiteStage.gel);
				break;
			case 5:
				eggWhite.css(whiteStage.milky);
				eggYolk.css(yolkStage.runny);
				break;
			case 7:
				eggWhite.css(whiteStage.solid);
				eggYolk.css(yolkStage.gel);
				break;
			case 11:
				eggYolk.css(yolkStage.solid);
				break;
			//case 13:
			//case 15:
			default:
		}
	}

	function startCount() {
		if (!timer.isOn) {
			timer.isOn = true;
			t = setInterval(function () {
			timer.seconds ++; 
			if (timer.seconds % 60 === 0 ) {
				timer.minutes ++; 
				timer.seconds = 0;
				adjustEggStage(timer.minutes);
			}
			printTimer();
		}, 1000);
			startStopButton.text("Pause");
			startStopButton.click(stopCount);
			startStopButton.removeClass("btn-success");
			startStopButton.addClass("btn-danger");
		}
	}

	function stopCount() {
		//clearTimeout(t);
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
		// todo: reset egg. 
		timer.seconds = 0; 
		timer.minutes = 0; 
		printTimer();
	}
});