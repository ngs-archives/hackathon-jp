echo("#1:paint.js");

var canvas = null;
var ctx = null;
var color = "black";
var radius = 3;
var active = false;
var prev_x = -1;
var prev_y = -1;
var offset_x = 0;
var offset_y = 0;

var dot = function(ctx, x, y) {
    ctx.beginPath();
    ctx.arc(x-1, y-1, radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
};

var initialize = function() {
    // get canvas element
    canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
    }
    
    // get position of canvas element
    var offset = getElementPosition(canvas);
    offset_x   = offset["left"];
    offset_y   = offset["top"];

    // add mouse event to canvas
    addEvent(canvas, "mouseup", mouseup);
    addEvent(canvas, "mousedown", mousedown);
    addEvent(canvas, "mousemove", mousemove);

    // setup clear button
    var clearButton = document.getElementById("clear_button");
    addEvent(clearButton, "click", clearAll);

    // setup radius selectbox
    var radiusSelectbox = document.getElementById("radius_selectbox");
    addEvent(radiusSelectbox, "change", function() {
        radius = radiusSelectbox.value;
    });
    
    // setup color selectbox
    var colorSelectbox = document.getElementById("color_selectbox");
    addEvent(colorSelectbox, "change", function() {
        color = colorSelectbox.value;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
    });
    
    // setup save button
    var saveButton = document.getElementById("save_image");
    addEvent(saveButton, "click", function() {
        saveData();
    });
    
    // setup load button
    var loadButton = document.getElementById("load_image");
    addEvent(loadButton, "click", function() {
        loadData();
        loadData(); // ???
    });

};

var clearAll = function() {
    // clear canvas
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    prev_x = -1;
    prev_y = -1;
};

var mousedown = function() {
    active = true;
};

var mousemove = function(event) {
    if (active == true) {
        draw(getPosition(event));
    }
};

var mouseup = function() {
    active = false;
    prev_x = -1;
    prev_y = -1;
};

var getPosition = function(event) {
    var left = 0;
    var top = 0;
    
    if (window.createPopup == null) {
        left = event.pageX;
        top = event.pageY;
    } else {
        event = window.event;
        left = event.clientX + document.documentElement.scrollLeft;
        top = event.clientY + document.documentElement.scrollTop;
    }
    
    return {x:left, y:top}
};

var draw = function(position) {
    
    if (this.prev_x == -1) {
        dot(ctx, position.x - offset_x, position.y - offset_y);
    } else {
        var x = position.x;
        var y = position.y;
        
        if (x == prev_x && y == prev_y) {
            return;
        }
        
        var x_move = x - prev_x;
        var y_move = y - prev_y;
        var x_diff = x_move < 0 ? 1 : -1;
        var y_diff = y_move < 0 ? 1 : -1;
        
        var i = 0;
        
        if (Math.abs(x_move) >= Math.abs(y_move)) {
            for (var i = x_move; i != 0; i += x_diff) {
                dot(ctx,(x - i) - offset_x, y - Math.round(y_move * i / x_move) - offset_y);
            }
        } else {
            for (var i = y_move; i != 0; i += y_diff) {
                dot(ctx, x - Math.round(x_move * i / y_move) - offset_x, (y - i) - offset_y);
            }
        }
        
    }
    
    prev_x = position.x;
    prev_y = position.y;
};

// - - - - -  - - - - -  - - - - -  - - - - -  - - - - -  - - - - -  - - - - -  - - - - - 
// - - - - -  - - - - -  - - - - -  - - - - -  - - - - -  - - - - -  - - - - -  - - - - - 

//addEvent(window, "load", initialize);
gadgets.util.registerOnLoadHandler(initialize);

// - - - - -  - - - - -  - - - - -  - - - - -  - - - - -  - - - - -  - - - - -  - - - - - 

function saveData() {
    var title = document.getElementById("title").value;
    var image = ctx.saveImage();
    var req = opensocial.newDataRequest();
    req.add(req.newUpdatePersonAppDataRequest(opensocial.IdSpec.PersonId.VIEWER, "title", title));
    req.add(req.newUpdatePersonAppDataRequest(opensocial.IdSpec.PersonId.VIEWER, "image", image));
    req.send(function(response) {
        if (response.hadError()) {
            alert(response.getErrorMessage());
        } else {
            alert("『" + title + "』を保存しました");
        }
    });
}

function loadData() {
    var req = opensocial.newDataRequest();
    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), "viewer");
    req.add(req.newFetchPersonAppDataRequest(opensocial.IdSpec.PersonId.VIEWER, ["title", "image"]), "viewer_data");
    req.send(function(response) {
        if (response.hadError()) {
            alert(response.getErrorMessage());
        } else {
            var myId = response.get("viewer").getData().getId();
            var data = response.get("viewer_data").getData();
            document.getElementById("title").value = data[myId]["title"];
            ctx.restoreImage(data[myId]["image"]);
        }
    });
}

// - - - - -  - - - - -  - - - - -  - - - - -  - - - - -  - - - - -  - - - - -  - - - - - 

CanvasRenderingContext2D.prototype.saveImage = function() {
  var tmpCanvas = document.createElement('canvas');
  tmpCanvas.setAttribute('width', this.canvas.width);
  tmpCanvas.setAttribute('height', this.canvas.height);
  var tmpCtx = tmpCanvas.getContext('2d');
  tmpCtx.globalCompositeOperation = "copy";
  tmpCtx.drawImage(this.canvas, 0, 0);
  var tmpImg = new Image();
  tmpImg.src = tmpCanvas.toDataURL();
  //this._imgs.push(tmpImg);
  return tmpImg.src;
  delete tmpCanvas, tmpCtx, tmpImg;
}

CanvasRenderingContext2D.prototype.restoreImage = function(imgSrc) {
  //var tmpImg = this._imgs.pop();
  var tmpImg = new Image();
  tmpImg.src = imgSrc;
  this.save();
  /* try to re-initialize canvas transform */
  try {
    this.setTransform(1, 0, 0, 1, 0, 0);
  } catch (ex) {
  }
  this.globalCompositeOperation = "copy";
  /* XXX: Firefox doesn't support globalCompositeOperation="copy",
    so we need to clear the canvas manually. */
  this.clearRect(0, 0, this.canvas.width, this.canvas.height)
  this.drawImage(tmpImg, 0, 0);
  this.restore();
}

//CanvasRenderingContext2D.prototype._imgs = [];

// - - - - -  - - - - -  - - - - -  - - - - -  - - - - -  - - - - -  - - - - -  - - - - - 
// - - - - -  - - - - -  - - - - -  - - - - -  - - - - -  - - - - -  - - - - -  - - - - - 

function addEvent(obj, event, func) {
    if (obj.attachEvent) {
        obj.attachEvent("on" + event, func);
    }
    else {
        obj.addEventListener(event, func, false);
    }
}

function getElementPosition(obj) {
    var position = new Array();
    var target = obj;
    position["top"]  = 0;
    position["left"] = 0;
    while (target) {
        position["top"] += target.offsetTop;
        position["left"] += target.offsetLeft;
        target = target.offsetParent;
    }
    // for Mozilla
    var doc = obj.ownerDocument;
    var bd  = doc.getElementsByTagName("body")[0];
    position["top"] += 2 * (parseInt(getComputedStyle(bd, "").getPropertyValue("border-top-width")) || 0);
    position["left"] += 2 * (parseInt(getComputedStyle(bd, "").getPropertyValue("border-left-width")) || 0);
    return position;
}
