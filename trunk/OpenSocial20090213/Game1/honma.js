var Player = function (name, hp, sp){
    this.name = name;
    this.hp   = hp;
    this.sp   = sp;
};
Player.prototype = {
};


gadgets.util.registerOnLoadHandler(
    function () {
        alert("TEST");
    }
);
