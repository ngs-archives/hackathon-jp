var androidwars = androidwars || {};
$(document).ready(function() {
	androidwars.start();
});

androidwars.events = function() {
	var eventList = [
//{action:"0", name:"ayuta2", value:{x:150, y:150}, version:1, world:{}},
//{action:"0", name:"ayuta2", value:{x:200, y:200}, version:1, world:{}},
//{action:"0", name:"ayuta2", value:{x:500, y:100}, version:1, world:{}},
//{action:"0", name:"ayuta2", value:{x:600, y:600}, version:1, world:{}},
//{action:"0", name:"ayuta2", value:{x:300, y:500}, version:1, world:{}},
//{action:"0", name:"ayuta2", value:{x:600, y:400}, version:1, world:{}},
//{action:"0", name:"ayuta2", value:{x:100, y:400}, version:1, world:{}},
//{action:"0", name:"ayuta2", value:{x:600, y:400}, version:1, world:{}},
//{action:"0", name:"ayuta2", value:{x:600, y:100}, version:1, world:{}},
//{action:"0", name:"ayuta2", value:{x:600, y:400}, version:1, world:{}},
];
	var currentVersion = 0;
	function pushEvents(events) {
		for(var i = 0; i < events.length; i++) {
			//alert(events[i].value);
			var event = JSON.parse(events[i].value, function (key, value) {return value;});
			eventList.push(event);
			currentVersion = events[i].version;
		}
	}
	function getCurrentVersion() {
		return currentVersion;
	}
	var commandList = [];
	
	function getCommand() {
		if(commandList.length > 0) {
			return commandList.shift();
		}
		if(eventList.length > 0) {
			var event = eventList.shift();
			var character = searchCharacter(event.name);
			if(event.action == "0" && character == false) {
				var newCharacter = androidwars.character(event.name, event.value.x, event.value.y, androidwars.images);
				androidwars.characters.push(newCharacter);
				return false;
			}
			if(event.action == "0" && character != false) {
				var frame = 10;
				character.resetCount();
				for(var i = 1; i < frame; i++) {
					commandList.push(function() {
						character.countUp();
						var pos = character.getPosition();
						var srcPos = character.getSrc();
						var x = (event.value.x)/frame * character.getCount();
						var y = (event.value.y)/frame * character.getCount();
						character.setPosition(srcPos.x + x, srcPos.y + y);
					});
				}
				commandList.push(function() {
					var srcPos = character.getSrc();
					var pos = character.getPosition();
					character.setPosition(srcPos.x + event.value.x, srcPos.y + event.value.y);
					character.setSrc(srcPos.x + event.value.x, srcPos.y + event.value.y);
				});
				return commandList.shift();
			}

			if(event.action == "1" && character != false) {
				commandList.push(function() {
					character.setAction(1, event.value.power);
				});
				commandList.push(function() {
					character.setAction(1, event.value.power);
				});
				commandList.push(function() {
					character.setAction(2, event.value.power);
				});
				commandList.push(function() {
					character.setAction(2, event.value.power);
				});
				commandList.push(function() {
					character.setAction(2, event.value.power);
				});
				commandList.push(function() {
					character.setAction(0, event.value.power);
				});
				return commandList.shift();
			}
		
		}
		return false;
		
	}
	return {
		getCommand:getCommand,
		pushEvents:pushEvents,
		getCurrentVersion: getCurrentVersion
	}
}();

androidwars.characters = [];
function searchCharacter(name) {
	for(var i = 0; i < androidwars.characters.length; i++) {
		if(androidwars.characters[i].getName() == name) {
			return androidwars.characters[i];
		}
	}
	return false;
}


androidwars.character = function(name, x, y) {
	var xPos = x, xDir = 1;
	var yPos = y, yDir = 1;
	var xTar = x, yTar = y;
	var xSrc = x, ySrc = y;
	var count = 0;
	var name = name;
	var image = androidwars.images.get("front");
	function selectImage(key) {
		image = androidwars.images.get(key);
	}
	var dir = "front";
	var action = 0;
	var power = 0;
	function setAction(act, pow) {
		image = androidwars.images.get(dir, act);
		action = act;
		power = pow;
	}
	
	var setPosition = function(x, y) {
		
		if(Math.abs(x - xPos) > Math.abs(y - yPos)) {
			if((x - xPos) > 0) {
				dir = "right";
			} else {
				dir = "left";
			}
		} else {
			if((y - yPos) > 0) {
				dir = "front";
			} else {
				dir = "back";
			}
		}
		selectImage(dir);
		
		xPos = x;
		yPos = y;
		if(xPos < 0) {
			xPos = 0;
		}
		if(yPos < 0) {
			yPos = 0;
		}
		if(xPos > 800-60) {
			xPos = 800-60;
		}
		if(yPos > 600-60) {
			yPos = 600-60;
		}
		
	}
	var getPosition = function() {
		return {
			x : xPos,
			y : yPos
		};
	}
	var setTarget = function(x, y) {
		xTar = x;
		yTar = y;
		count = 0;
		console.log(x + ":" + y);
	} 
	var setSrc = function(x, y) {
		xSrc = x;
		ySrc = y;
	}
	var getSrc = function() {
		return {x: xSrc, y:ySrc};
	}
	var drawImage = function(ctx) {
		ctx.drawImage(image, xPos, yPos);
		ctx.font = "24px '‚l‚r ‚oƒSƒVƒbƒN'";
		ctx.fillStyle = "red";
		ctx.fillText(name, xPos, yPos);
		if(action == 2) {
			if(dir == "front") {
				ctx.fillText(power, xPos + 10, yPos + 80);
			}
			if(dir == "back") {
				ctx.fillText(power, xPos + 10, yPos - 20);
			}
			if(dir == "right") {
				ctx.fillText(power, xPos + 60, yPos + 20);
			}
			if(dir == "left") {
				ctx.fillText(power, xPos - 40, yPos + 20);
			}
		}
	}
	var move = function() {
		
		if((yPos == yTar && xPos == xTar)) {
			return;
		}
		if(count > 5) {
			xPos = xTar;
			yPos = yTar;
			return;
		}
		
		xPos = (xTar - xPos) / (6-count);
		yPos = (yTar - yPos) / (6-count);
		console.log("x:" + xPos + "y:" + yPos);
		
		
		count++;
// xPos += (xDir * 5);
// if (xPos > 800)
// xDir = -1;
// if (xPos < 5)
// xDir = 1;
// yPos += (yDir * 5);
// if (yPos > 600)
// yDir = -1;
// if (yPos < 5)
// yDir = 1;
	}
	function getName() {
		return name;
	}
	function getCount() {
		return count;
	}
	function resetCount() {
		count = 0;
	}
	function countUp() {
		count++;
	}
	return {
		move : move,
		drawImage : drawImage,
		setPosition : setPosition,
		getPosition : getPosition,
		setTarget : setTarget,
		getName: getName,
		getCount: getCount,
		resetCount: resetCount,
		countUp: countUp,
		getSrc: getSrc,
		setSrc: setSrc,
		setAction: setAction
	};
}

function update() {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, 800, 600);
	var command = androidwars.events.getCommand();
	if(command) {
		command();
	}
	for ( var i = 0; i < androidwars.characters.length; i++) {
		// androidwars.characters[i].move();
		androidwars.characters[i].drawImage(ctx);
	}
}
var testChar = null;
androidwars.start = function() {
	androidwars.images.setup();
//	testChar = androidwars.character("ayuta", 10, 10, androidwars.images);
//	androidwars.characters.push(testChar);
	setInterval(update, 100);
	setInterval(getEvents, 2000);
	//$("#test").bind("click", function(){testChar.setTarget(500, 200);});
	$("#test").bind("click", function(){getEvents()});
	// setInterval(function(){testChar.setTarget(Math.floor(Math.random()*600),
	// Math.floor(Math.random()*600))}, 2000);
}

androidwars.images = function() {
	var frontImage = new Image();
	var frontAttack1Image = new Image();
	var frontAttack2Image = new Image();
	var backImage = new Image();
	var backAttack1Image = new Image();
	var backAttack2Image = new Image();
	var leftImage = new Image();
	var leftAttack1Image = new Image();
	var leftAttack2Image = new Image();
	var rightImage = new Image();
	var rightAttack1Image = new Image();
	var rightAttack2Image = new Image();
	function setup() {
		frontImage.src = "google-android-icon-front.png";
		frontAttack1Image.src = "google-android-icon-front-attack1.png";
		frontAttack2Image.src = "google-android-icon-front-attack2.png";
		backImage.src = "google-android-icon-back.png";
		backAttack1Image.src = "google-android-icon-back-attack1.png";
		backAttack2Image.src = "google-android-icon-back-attack2.png";
		leftImage.src = "google-android-icon-left.png";
		leftAttack1Image.src = "google-android-icon-left-attack1.png";
		leftAttack2Image.src = "google-android-icon-left-attack2.png";
		rightImage.src = "google-android-icon-right.png";
		rightAttack1Image.src = "google-android-icon-right-attack1.png";
		rightAttack2Image.src = "google-android-icon-right-attack2.png";
	}
	function getFrontImage() {
		return frontImage;
	}
	function getBackImage() {
		return backImage;
	}
	function getLeftImage() {
		return leftImage;
	}
	function getRightImage() {
		return rightImage;
	}
	function get(key, attack) {
		if(key == "front") {
			if(attack == 1) {
				return frontAttack1Image;
			}
			if(attack == 2) {
				return frontAttack2Image;
			}
			return frontImage;
		} else if(key == "back") {
			if(attack == 1) {
				return backAttack1Image;
			}
			if(attack == 2) {
				return backAttack2Image;
			}
			return backImage;
		} else if(key == "left") {
			if(attack == 1) {
				return leftAttack1Image;
			}
			if(attack == 2) {
				return leftAttack2Image;
			}
			return leftImage;
		} else if(key == "right") {
			if(attack == 1) {
				return rightAttack1Image;
			}
			if(attack == 2) {
				return rightAttack2Image;
			}
			return rightImage;
		}
	}
	return {
		setup: setup,
		getFrontImage: getFrontImage,
		getBackImage: getBackImage,
		getLeftImage: getLeftImage,
		getRightImage: getRightImage,
		get:get
	}
}();

function getEvents() {
	$.ajax({
		url: "/responseEvents",
		data:"version=" + androidwars.events.getCurrentVersion(),
		success: function(data) {
			var respObj = JSON.parse(data, function (key, value) {return value;});
			androidwars.events.pushEvents(respObj);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			for(key in XMLHttpRequest) {
				console.log((key + ":" + XMLHttpRequest[key] + "\n"));
				// $("#response").append(key + ":" + XMLHttpRequest[key] +
				// "\n");
			}
		}
	});
}
