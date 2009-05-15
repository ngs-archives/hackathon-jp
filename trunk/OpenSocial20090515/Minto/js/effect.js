/*
2001.3.13-2008.6.6 Satoshi Koyama(koyama@cc.hirosaki-u.ac.jp), Hirosaki Univ.
エフェクト満載ライブラリ
http://siva.cc.hirosaki-u.ac.jp/usr/koyama/effect/

このライブラリはNetscape社の "Drag and Drop Component" を拡充して作成しました。
このページの旧URLは下記ですが、現在は閲覧できません。
http://developer.netscape.com/docs/examples/dynhtml/dragable/index.html

使い方:
	D=putObj(x,y,html)		(x,y)にObjのインスタンスを生成する
	D=new Obj(x,y,html)		(x,y)にObjのインスタンスを生成する
	D.layer					レイヤーID または スタイルID
	D.ondrop=function ...	ondropイベントハンドラ
	D.onmove=function ...	onmoveイベントハンドラ
	D.ondrag=function ...	ondragイベントハンドラ
	D.ondown=function ...	ondownイベントハンドラ

	D.bgColor(color)		Dの背景色をcolorにする
	D.dragable()			Dをドラッグ可能にする
	D.show()/D.hide()		Dを見せる/隠す
	D.clip(x1,y1,x2,y2)		DをDの相対座標(x1,y1),(x2,y2)でクリップする
	D.bound(x1,y1,x2,y2)	Dの移動範囲を(x1,y1),(x2,y2)の範囲に制約する
	D.bind(b)				Dをオブジェクトbにバインドする
	D.moveBy(x,y)			Dを(x,y)だけ移動する
	D.moveBy(x,y,x1,y1,x2,y2)	移動後のDを(x1,y1),(x2,y2)でクリップ
	D.moveTo(x,y)			Dを(x,y)に移動する
	D.forced(t)				Dがtの外周上にあった場合、tの内部/外部に移動する
	D.inside(x,y)			(x,y)がD上にあるかチェック...true/false
	D.dragability			Dのドラッグ有効/無効...true(/false)
	D.x, D.y				Dの位置
	D.width, D.height		Dの幅と高さ
	D.Z						trueならばDをマウス操作した時に最も上のレイヤにする
	dstartX, dstartY		ドラッグ開始時のマウスポインタの位置
	droppedX, droppedY		ドロップ時のマウスポインタの位置

	D.wipein(1～4[,s])		Dをモード1～4で(s秒で)ワイプインする
	D.wipeout(1～4[,s])		Dをモード1～4で(s秒で)ワイプアウトする
	D.slidein(1～4[,s]) 	Dをモード1～4で(s秒で)スライドインする
	D.slideout(1～4[,s])	Dをモード1～4で(s秒で)スライドアウトする
	D.slideBy(x,y)			Dを(x,y)だけスライドする
	D.slideTo(x,y)			Dを(x,y)にスライドする

プログラムの例(sample.htm):
	--- ここから ---
	<script src=effect.js></script>
	<script>
	A=new Obj(80,80,"<H1>Drag me.</H1>");
	A.dragable();	A.ondrop=droppedA
	B=new Obj(20,20,"<H1>What happened!</H1>");
	B.dragable();	B.ondrop=droppedB
	B.hide()
	function droppedA(){B.show();	A.hide()}
	function droppedB(){A.show();	B.hide()}
	</script>
	--- ここまで ---
*/

SNDSTATUS="STOP"

var agt=navigator.userAgent.toLowerCase();
var is_major= parseInt(navigator.appVersion);
var is_nav	= ((agt.indexOf('mozilla')!=-1) && (agt.indexOf('compatible')==-1))
var is_nav4 = (is_nav && (is_major==4));
var is_nav4up=(is_nav && (is_major>=4));
var is_nav5up=(is_nav && (is_major>=5));
var is_ie   = (agt.indexOf("msie")!=-1);
var is_ie3  = (is_ie && (is_major< 4));
var is_ie4  = (is_ie && (is_major==4) && (agt.indexOf("msie 5.0")==-1) );
var is_ie4up= (is_ie && (is_major>=4));
var is_ie5up= (is_ie && !is_ie3 && !is_ie4);

if(document==top.document)	DFrame=top;
else						DFrame=top.frames[1];
if(is_nav5up)	DFrame.document.write("<SPAN>　</SPAN>");

var droppedX, droppedY, DID=1;

var PRESETACTION="", PRESETTIME=0;
var DRAGABLE=new Array();

//timint()

function presetTimeout(action,t){PRESETACTION=action;	PRESETTIME=t}

function timint(){				// 10msタイマー割込み
	var i,j,dx0,dy0,dl0,dl;
// 全てのObjオブジェクトについて
	for(j=i=0;i<DRAGABLE.length;i++) with(DRAGABLE[i]){
// 現在位置(x,y)から目的位置(xd,yd)までdx,dyずつ動かす(スライド)
		dx0=xd-x;	dy0=yd-y;
		if(dx0!=0 || dy0!=0){
			dl0=Math.sqrt(dx0*dx0+dy0*dy0)
			dl=Math.sqrt(dx*dx+dy*dy)
			if(dl0<dl)	moveTo(xd,yd)
			else slideBy(Math.round(dx0*dx/dl0),Math.round(dy0*dy/dl0))
			j++;
		}else{
// 現在位置(x1,y1)から目的位置(xd1,yd1)までdx,dyずつ動かす(ワイプ)
			if(x1!=xd1){
				if(x1<xd1){	if(xd1-x1<dx)	x1=xd1;
							else			x1+=dx;
				}else{		if(x1-xd1<dx)	x1=xd1;
							else			x1-=dx;
				}
				j++;
			}
			if(y1!=yd1){
				if(y1<yd1){	if(yd1-y1<dy)	y1=yd1;
							else			y1+=dy;
				}else{		if(y1-yd1<dy)	y1=yd1;
							else			y1-=dy;
				}
				j++;
			}
// 現在位置(x2,y2)から目的位置(xd2,yd2)までdx,dyずつ動かす(ワイプ)
			if(x2!=xd2){
				if(x2<xd2){	if(xd2-x2<dx)	x2=xd2;
							else			x2+=dx;
				}else{		if(x2-xd2<dx)	x2=xd2;
							else			x2-=dx;
				}
				j++;
			}
			if(y2!=yd2){
				if(y2<yd2){	if(yd2-y2<dy)	y2=yd2;
							else			y2+=dy;
				}else{		if(y2-yd2<dy)	y2=yd2;
							else			y2-=dy;
				}
				j++;
			}
			clip(x1,y1,x2,y2);
		}
	}
	if(j==0 && SNDSTATUS=="STOP"){	// スライドもワイプも無くかつSTOP
		if(PRESETACTION!="")	setTimeout(PRESETACTION,PRESETTIME);
		PRESETACTION="";	PRESETTIME=0;
	}
	setTimeout("timint()",10);
}

//----------------------------------------------------------------------
function DFopen(w,h){
	DFrame=window.open("","","titlebar=0,toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0,width="+w+",height="+h);
}

//----------------------------------------------------------------------
Obj.mdown=function(e){
if(this.ref.dragability==true){
	if(is_nav4){
		this.memoX=dstartX=e.pageX;
		this.memoY=dstartY=e.pageY;
		if(this.ref.ondown)	this.ref.ondown(this.ref);
		DFrame.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		if(this.ref.Z&&this!=DFrame.document.layers[DFrame.document.layers.length-1])
			this.moveAbove(DFrame.document.layers[DFrame.document.layers.length-1]);
		this.savemousemove=DFrame.onmousemove;
		this.savemouseup  =DFrame.onmouseup;
		DFrame.onmousemove=Obj.mdrag;
		DFrame.onmouseup  =Obj.mup;
	}else if(is_nav5up){
		this.memoX=dstartX=e.pageX;
		this.memoY=dstartY=e.pageY;
		if(this.ref.ondown)	this.ref.ondown(this.ref);
		if(this.ref.Z){
			this.style.zIndex=++DID;
			for(var i=0;i<this.ref.bindlist.length;i++)	this.ref.bindlist[i].layer.style.zIndex=++DID;
		}
		this.savemousemove=DFrame.document.onmousemove;
		this.savemouseup=DFrame.document.onmouseup;
		DFrame.document.onmousemove=Obj.mdrag;
		DFrame.document.onmouseup=Obj.mup;
	}else if(is_ie4up){
		this.memoX=dstartX=DFrame.event.clientX;
		this.memoY=dstartY=DFrame.event.clientY;
		if(this.ref.ondown)	this.ref.ondown(this.ref);
		if(this.ref.Z){
			this.style.zIndex=++DID;
			for(var i=0;i<this.ref.bindlist.length;i++)	this.ref.bindlist[i].layer.style.zIndex=++DID;
		}
		this.savemousemove=DFrame.document.onmousemove;
		this.savemouseup=DFrame.document.onmouseup;
		DFrame.document.onmousemove=Obj.mdrag;
		DFrame.document.onmouseup=Obj.mup;
	}
	Obj.current=this;
}
	return false;
}

//----------------------------------------------------------------------
Obj.mmove=function(e){
	if(this.ref.onmove)	this.ref.onmove(this.ref);
	return false;
}

//----------------------------------------------------------------------
Obj.mdrag=function(e){
	var DX, DY, newX, newY, that=Obj.current;
	if(is_nav4 || is_nav5up){
		DX=e.pageX-that.memoX;	that.memoX=e.pageX;
		DY=e.pageY-that.memoY;	that.memoY=e.pageY;
	}else if(is_ie4up){
		DX=DFrame.event.clientX-that.memoX;	that.memoX=DFrame.event.clientX;
		DY=DFrame.event.clientY-that.memoY;	that.memoY=DFrame.event.clientY;
	}
	if(that.ref.boundX2||that.ref.boundY2){
		if((that.ref.boundX2-that.ref.boundX1)>that.ref.width){
			DX=Math.max(DX,that.ref.boundX1-that.ref.x);
			DX=Math.min(DX,that.ref.boundX2-that.ref.width-that.ref.x);
		}else{
			DX=Math.min(DX,that.ref.boundX1-that.ref.x);
			DX=Math.max(DX,that.ref.boundX2-that.ref.width-that.ref.x);
		}
		if((that.ref.boundY2-that.ref.boundY1)>that.ref.height){
			DY=Math.max(DY,that.ref.boundY1-that.ref.y);
			DY=Math.min(DY,that.ref.boundY2-that.ref.height-that.ref.y);
		}else{
			DY=Math.min(DY,that.ref.boundY1-that.ref.y);
			DY=Math.max(DY,that.ref.boundY2-that.ref.height-that.ref.y);
		}
	}
// that.refはDrag中のObjオブジェクト
	that.ref.moveBy(DX,DY,that.ref.boundX1,that.ref.boundY1,that.ref.boundX2,that.ref.boundY2);
	if(that.ref.ondrag)	that.ref.ondrag(that.ref);
	return false;
}

//----------------------------------------------------------------------
Obj.mup=function(e){
	var that=Obj.current, mask=0;
	if(is_nav4){
		droppedX=e.pageX;	droppedY=e.pageY;
		if(!DFrame.onmousemove) mask|=Event.MOUSEMOVE;
		if(!DFrame.onmouseup)   mask|=Event.MOUSEUP;
		DFrame.releaseEvents(mask);
		DFrame.onmousemove=that.savemousemove;
		DFrame.onmouseup=that.savemouseup;
	}else if(is_nav5up){
		droppedX=e.pageX;	droppedY=e.pageY;
		DFrame.document.onmousemove=that.savemousemove;
		DFrame.document.onmouseup=that.savemouseup;
	}else if(is_ie4up){
		droppedX=DFrame.event.clientX;	droppedY=DFrame.event.clientY;
		DFrame.document.onmousemove=that.savemousemove;
		DFrame.document.onmouseup=that.savemouseup;
	}
	if(that.ref.ondrop)	that.ref.ondrop(that.ref);
	return false;
}

//----------------------------------------------------------------------
// Objオブジェクトの定義
function putObj(x,y,html){	return new Obj(x,y,html);	}
function Obj(x,y,html){
	var d;
	if(is_nav4){
		DFrame.document.write("<LAYER id=DRAG left="+x+" top="+y+">"+html+"</LAYER>");
		d=DFrame.document.layers.DRAG;
		d.captureEvents(Event.MOUSEMOVE | Event.MOUSEDOWN);
	}else if(is_nav5up){
		DFrame.document.write("<SPAN id=D"+DID+" style='position:absolute; left:"+x+"; top:"+y+"'>"+html+"</SPAN>");
		d=DFrame.document.getElementById("D"+DID);
		DID++;
	}else if(is_ie4up){
		DFrame.document.write("<SPAN id=D"+DID+" style='position:absolute; left:"+x+"; top:"+y+"'>"+html+"</SPAN>");
		eval("d=DFrame.D"+DID);
		DID++;
	}
	d.onmousemove=Obj.mmove;
	d.onmousedown=Obj.mdown;
	this.layer=d;						// layer ID
	d.ref=this;							// Objオブジェクト
	this.bindlist=new Array();			// 初めはバインド無し
// NN7(nav5)は大きな画像をスクロール表示させた場合にoffsetWidthが正しく取得できないので注意
	if(is_nav4){	   this.width=d.clip.width;	 this.height=d.clip.height;}
	else if(is_nav5up){this.width=d.offsetWidth; this.height=d.offsetHeight;}
	else if(is_ie4up){ this.width=d.clientWidth; this.height=d.clientHeight;}
	this.xd=this.x=x;					// x,xdは現在位置と目的位置(スライド)
	this.yd=this.y=y;					// y,ydは現在位置と目的位置(スライド)
	this.x1=this.xd1=0;					// x1,xd1はxを原点とする位置(ワイプ)
	this.y1=this.yd1=0;					// y1,yd1はxを原点とする位置(ワイプ)
	this.x2=this.xd2=this.width;		// x2,xd2はxを原点とする位置(ワイプ)
	this.y2=this.yd2=this.height;		// y2,yd2はxを原点とする位置(ワイプ)
	this.dx=this.dy=10;					// ワイプ/スライドの移動量の暫定値
	this.dragability=false;				// デフォルトはドラッグ不可
	this.visibility="show";				// デフォルトは見せる
	this.Z=true;						// デフォルトはZ入れ替え可
//----------------------------------------------------------------------
// 背景色をcolorにする
	this.bgColor=function(color){
		if(is_nav4) 					this.layer.bgColor=color;
		else if(is_nav5up || is_ie4up)	this.layer.style.backgroundColor=color;
	}
//----------------------------------------------------------------------
// ドラッグ可能にする
	this.dragable=function(){
		this.dragability=true;
		this.layer.onmousemove=Obj.mmove;
		this.layer.onmousedown=Obj.mdown;
	}
//----------------------------------------------------------------------
// オブジェクトを見せる
	this.show=function(){
		this.visibility="show";
		if(is_nav4)						d.visibility="show";
		else if(is_nav5up || is_ie4up)	d.style.visibility="visible";
	}
//----------------------------------------------------------------------
// オブジェクトを隠す
	this.hide=function(){
		this.visibility="hidden";
		if(is_nav4)						d.visibility="hidden";
		else if(is_nav5up || is_ie4up)	d.style.visibility="hidden";
	}
//----------------------------------------------------------------------
// (x,y)を原点とする(x1,y1),(x2,y2)の矩形でクリップする
	this.clip=function(x1,y1,x2,y2){
		if(is_nav4){
			d.clip.left=x1; d.clip.top=y1;
			d.clip.right=x2;d.clip.bottom=y2;
		}else if(is_nav5up || is_ie4up){
			d.style.clip="rect("+y1+"px "+x2+"px "+y2+"px "+x1+"px)"
		}
		d.clipX1=x1;	d.clipY1=y1;	d.clipX2=x2;	d.clipY2=y2;
	}
//----------------------------------------------------------------------
// ドラッグの範囲を(x1,y1),(x2,y2)に制限する
	this.bound=function(x1,y1,x2,y2){
		if(y2){				// ドラッグ操作の範囲を(x1,y1),(x2,y2)に制限する
			this.boundX1=x1; this.boundY1=y1; this.boundX2=x2; this.boundY2=y2;
		}else{				// ドラッグ操作の範囲をt上に制限する
			var t=x1;
			if(is_nav4){
				var tx=t.layer.pageX, ty=t.layer.pageY, tw=t.layer.clip.width, th=t.layer.clip.height;
				var dx=d.pageX, dy=d.pageY, dw=d.clip.width, dh=d.clip.height;
			}else if(is_nav5up){
				var tx=t.layer.style.left, ty=t.layer.style.top
				var tw=t.layer.width, th=t.layer.height
				var dx=d.style.left, dy=d.style.top
				var dw=d.width, dh=d.height
			}else if(is_ie4up){
				var tx=t.layer.style.pixelLeft, ty=t.layer.style.pixelTop
				var tw=t.layer.clientWidth, th=t.layer.clientHeight
				var dx=d.style.pixelLeft, dy=d.style.pixelTop
				var dw=d.clientWidth, dh=d.clientHeight
			}
			this.boundX1=tx;	this.boundX2=tx+tw-dw;
			this.boundY1=ty;	this.boundY2=ty+th-dh;
		}
		var newX=this.x, newY=this.y;
		if((this.boundX2-this.boundX1)>this.width){
			newX=Math.max(newX,this.boundX1);
			newX=Math.min(newX,this.boundX2-this.width);
		}else{
			newX=Math.min(newX,this.boundX1);
			newX=Math.max(newX,this.boundX2-this.width);
			if(is_nav4){
				d.clip.left  =this.boundX1-newX;
				d.clip.top   =this.boundY1-newY;
				d.clip.right =this.boundX2-newX;
				d.clip.bottom=this.boundY2-newY;
			}else if(is_nav5up || is_ie4up){
				d.style.clip="rect("+(this.boundY1-newY)+"px "+(this.boundX2-newX)+"px "+(this.boundY2-newY)+"px "+(this.boundX1-newX)+"px)";
			}
		}
		if((this.boundY2-this.boundY1)>this.height){
			newY=Math.max(newY,this.boundY1);
			newY=Math.min(newY,this.boundY2-this.height);
		}else{
			newY=Math.min(newY,this.boundY1);
			newY=Math.max(newY,this.boundY2-this.height);
		}
		this.xd=this.x=newX;	this.yd=this.y=newY;
// バインドされているすべてのオブジェクトをバウンドする
		for(var i=0;i<this.bindlist.length;i++)	this.bindlist[i].moveBy(0,0,x1,y1,x2,y2);
	}
//----------------------------------------------------------------------
// オブジェクトbのバインドに追加する
	this.bind=function(b){	b.bindlist[b.bindlist.length]=this;	}
//----------------------------------------------------------------------
// 現在位置と目的位置を(x,y)だけ移動する
	this.moveBy=function(x,y,boundx1,boundy1,boundx2,boundy2){
		var newX=this.x+x, newY=this.y+y;
		if(boundy2){
			if(is_nav4){
				d.clip.left =Math.max(boundx1-newX,0);
				d.clip.right=Math.min(boundx2-newX,this.width);
			}else if(is_nav5up || is_ie4up){
				d.style.clip="rect("+(boundy1-newY)+"px "+(boundx2-newX)+"px "+(boundy2-newY)+"px "+(boundx1-newX)+"px)"
			}
			this.clipX1=boundx1-newX;
			this.clipX2=boundx2-newX;
			if(is_nav4){
				d.clip.top	 =Math.max(boundy1-newY,0);
				d.clip.bottom=Math.min(boundy2-newY,this.height);
			}else if(is_nav5up || is_ie4up){
				d.style.clip="rect("+(boundy1-newY)+"px "+(boundx2-newX)+"px "+(boundy2-newY)+"px "+(boundx1-newX)+"px)"
			}
			this.clipY1=boundy1-newY;
			this.clipY2=boundy2-newY;
		}
		if(is_nav4){		d.pageX=newX;			d.pageY=newY}
		else if(is_nav5up){	d.style.left=newX;		d.style.top=newY}
		else if(is_ie4up){	d.style.pixelLeft=newX;d.style.pixelTop=newY}
		this.xd=this.x=newX;	this.yd=this.y=newY;
// バインドされているすべてのオブジェクトを移動する
		for(var i=0;i<this.bindlist.length;i++)	this.bindlist[i].moveBy(x,y,boundx1,boundy1,boundx2,boundy2);
	}
//----------------------------------------------------------------------
// 現在位置と目的位置を(x,y)にする
	this.moveTo=function(x,y){
		if(is_nav4){		d.pageX=x;			d.pageY=y}
		else if(is_nav5up){	d.style.left=x;		d.style.top=y}
		else if(is_ie4up){	d.style.pixelLeft=x;d.style.pixelTop=y}
		this.xd=this.x=x;	this.yd=this.y=y	//position
	}
//----------------------------------------------------------------------
// オブジェクトtの周辺境界上にあるObjオブジェクトを内部または外部にずらす
	this.forced=function(t){	//move forced inside/outside of t
		if(is_nav4){
			var tx=t.layer.pageX, ty=t.layer.pageY, tw=t.layer.clip.width, th=t.layer.clip.height;
			var dx=d.pageX, dy=d.pageY, dw=d.clip.width, dh=d.clip.height;
			if(t.inside(droppedX,droppedY)){
				if(tx>dx && tx<(dx+dw))				d.pageX=tx;
				if((tx+tw)>dx && (tx+tw)<(dx+dw))	d.pageX=tx+tw-dw;
				if(ty>dy && ty<(dy+dh))				d.pageY=ty;
				if((ty+th)>dy && (ty+th)<(dy+dh))	d.pageY=ty+th-dh;
			}else{
				if(tx>dx && tx<(dx+dw))				d.pageX=tx-dw;
				if((tx+tw)>dx && (tx+tw)<(dx+dw))	d.pageX=tx+tw;
				if(ty>dy && ty<(dy+dh))				d.pageY=ty-dh;
				if((ty+th)>dy && (ty+th)<(dy+dh))	d.pageY=ty+th;
			}
		}else if(is_nav5up){
			var tx=parseInt(t.layer.style.left),ty=parseInt(t.layer.style.top);
			var tw=t.layer.width, th=t.layer.height;
			var dx=parseInt(d.style.left), dy=parseInt(d.style.top);
			var dw=d.width, dh=d.height;
			if(t.inside(droppedX,droppedY)){
				if(tx>dx && tx<(dx+dw))				d.style.left=tx;
				if((tx+tw)>dx && (tx+tw)<(dx+dw))	d.style.left=tx+tw-dw;
				if(ty>dy && ty<(dy+dh))				d.style.top=tx;
				if((ty+th)>dy && (ty+th)<(dy+dh))	d.style.top=ty+th-dh;
			}else{
				if(tx>dx && tx<(dx+dw))				d.style.left=tx-dw;
				if((tx+tw)>dx && (tx+tw)<(dx+dw))	d.style.left=tx+tw;
				if(ty>dy && ty<(dy+dh))				d.style.top=ty-dh;
				if((ty+th)>dy && (ty+th)<(dy+dh))	d.style.top=ty+th;
			}
		}else if(is_ie4up){
			var tx=t.layer.style.pixelLeft, ty=t.layer.style.pixelTop;
			var tw=t.layer.clientWidth, th=t.layer.clientHeight;
			var dx=d.style.pixelLeft, dy=d.style.pixelTop;
			var dw=d.clientWidth, dh=d.clientHeight;
			if(t.inside(droppedX,droppedY)){
				if(tx>dx && tx<(dx+dw))				d.style.pixelLeft=tx;
				if((tx+tw)>dx && (tx+tw)<(dx+dw))	d.style.pixelLeft=tx+tw-dw;
				if(ty>dy && ty<(dy+dh))				d.style.pixelTop=tx;
				if((ty+th)>dy && (ty+th)<(dy+dh))	d.style.pixelTop=ty+th-dh;
			}else{
				if(tx>dx && tx<(dx+dw))				d.style.pixelLeft=tx-dw;
				if((tx+tw)>dx && (tx+tw)<(dx+dw))	d.style.pixelLeft=tx+tw;
				if(ty>dy && ty<(dy+dh))				d.style.pixelTop=ty-dh;
				if((ty+th)>dy && (ty+th)<(dy+dh))	d.style.pixelTop=ty+th;
			}
		}
	}
//----------------------------------------------------------------------
// (x,y)がObjオブジェクトの上にあればtrueを返す
	this.inside=function(x,y){
		if(is_nav4)			return (this.visibility=="show" && x>d.pageX && y>d.pageY && x<d.pageX+d.clip.width && y<d.pageY+d.clip.height);
		else if(is_nav5up)	return (this.visibility=="show" && x>parseInt(d.style.left) && y>parseInt(d.style.top)&&x<parseInt(d.style.left)+d.offsetWidth&&y<parseInt(d.style.top)+d.offsetHeight);
		else if(is_ie4up)	return (this.visibility=="show" && x>d.style.pixelLeft && y>d.style.pixelTop&&x<d.style.pixelLeft+d.clientWidth&&y<d.style.pixelTop+d.clientHeight);
	}
//----------------------------------------------------------------------
// wipemodeに応じてワイプインする
	this.wipein=function(wipemode,sec){
		this.visibility="show";
		if(is_nav4)						d.visibility="show";
		else if(is_nav5up || is_ie4up)	d.style.visibility="visible";
		if(!sec)	sec=1;
		this.dx=parseInt(this.width/sec/100);
		this.dy=parseInt(this.height/sec/100);
		if(wipemode==1){						// 左からワイプイン
			this.x1=this.xd1=this.x2=0;	this.xd2=this.width;
			this.y1=this.yd1=0;	this.y2=this.yd2=this.height;
		}else if(wipemode==2){					// 右からワイプイン
			this.xd1=0;	this.x1=this.x2=this.xd2=this.width;
			this.y1=this.yd1=0;	this.y2=this.yd2=this.height;
		}else if(wipemode==3){					// 上からワイプイン
			this.x1=this.xd1=0;	this.x2=this.xd2=this.width;
			this.y1=this.yd1=this.y2=0;	this.yd2=this.height;
		}else if(wipemode==4){					// 下からワイプイン
			this.x1=this.xd1=0;	this.x2=this.xd2=this.width;
			this.yd1=0;	this.y1=this.y2=this.yd2=this.height;
		}
		if(is_nav4){		d.pageX=this.x;			d.pageY=this.y;}
		else if(is_nav5up){	d.style.left=this.x;	d.style.top=this.y;}
		else if(is_ie4up){	d.style.pixelLeft=this.x;d.style.pixelTop=this.y;}
	}
//----------------------------------------------------------------------
// wipemodeに応じてワイプアウトする
	this.wipeout=function(wipemode,sec){
		this.visibility="show";
		if(is_nav4)						d.visibility="show";
		else if(is_nav5up || is_ie4up)	d.style.visibility="visible";
		if(!sec)	sec=1;
		this.dx=parseInt(this.width/sec/100);
		this.dy=parseInt(this.height/sec/100);
		if(wipemode==1){						// 右へワイプアウト
			this.x1=this.x;
			this.xd1=this.x2=this.xd2=this.x+this.width;
			this.y1=this.yd1=this.y;
			this.y2=this.yd2=this.y+this.height;
		}else if(wipemode==2){					// 左へワイプアウト
			this.x1=this.xd1=this.xd2=this.x;
			this.x2=this.x+this.width;
			this.y1=this.yd1=this.y;
			this.y2=this.yd2=this.y+this.height;
		}else if(wipemode==3){					// 下へワイプアウト
			this.x1=this.xd1=this.x;
			this.x2=this.xd2=this.x+this.width;
			this.y1=this.y;
			this.yd1=this.y2=this.yd2=this.y+this.height;
		}else if(wipemode==4){					// 上へワイプアウト
			this.x1=this.xd1=this.x;
			this.x2=this.xd2=this.x+this.width;
			this.y1=this.yd1=this.yd2=this.y;
			this.y2=this.y+this.height;
		}
		if(is_nav4){		d.pageX=this.x;			d.pageY=this.y;}
		else if(is_nav5up){	d.style.left=this.x;	d.style.top=this.y;}
		else if(is_ie4up){	d.style.pixelLeft=this.x;d.style.pixelTop=this.y;}
	}
//----------------------------------------------------------------------
// slmodeに応じてスライドインする
	this.slidein=function(slmode,sec){
		this.visibility="show"
		if(is_nav4)						d.visibility="show"
		else if(is_nav5up || is_ie4up)	d.style.visibility="visible"
		if(!sec)	sec=1;
// 目的位置xd,ydを現在位置x,yにする
		this.xd=this.x;	this.yd=this.y
// 現在位置x,yをslmodeに応じた位置にする
		if(slmode==1){							// 左からスライドイン
			this.dx=parseInt((this.x+this.width)/sec/100);
			this.x=-this.width
		}else if(slmode==2){					// 右からスライドイン
			this.dx=parseInt((screen.width-this.x)/sec/100);
			this.x=screen.width
		}else if(slmode==3){					// 上からスライドイン
			this.dy=parseInt((this.y+this.height)/sec/100);
			this.y=-this.height
		}else if(slmode==4){					// 下へスライドイン
			this.dy=parseInt((screen.height-this.y)/sec/100);
			this.y=screen.height
		}
		if(is_nav4){		d.pageX=this.x;			d.pageY=this.y}
		else if(is_nav5up){	d.style.left=this.x;	d.style.top=this.y}
		else if(is_ie4up){	d.style.pixelLeft=this.x;d.style.pixelTop=this.y}
	}
//----------------------------------------------------------------------
// slmodeに応じてスライドアウトする
	this.slideout=function(slmode,sec){
		this.visibility="show"
		if(is_nav4)						d.visibility="show"
		else if(is_nav5up || is_ie4up)	d.style.visibility="visible"
		if(!sec)	sec=1;
// 目的位置xd,ydを現在位置x,yにする
		this.xd=this.x;	this.yd=this.y
// 目的位置xd,ydをslmodeに応じた位置に調整する
		if(slmode==1){							// 左へスライドアウト
			this.dx=parseInt((this.x+this.width)/sec/100);
			this.xd=-this.width
		}else if(slmode==2){					// 右へスライドアウト
			this.dx=parseInt((screen.width-this.x)/sec/100);
			this.xd=screen.width
		}else if(slmode==3){					// 上へスライドアウト
			this.dy=parseInt((this.y+this.height)/sec/100);
			this.yd=-this.height
		}else if(slmode==4){					// 下へスライドアウト
			this.dy=parseInt((screen.height-this.y)/sec/100);
			this.yd=screen.height
		}
		if(is_nav4){		d.pageX=this.x;			d.pageY=this.y}
		else if(is_nav5up){	d.style.left=this.x;	d.style.top=this.y}
		else if(is_ie4up){	d.style.pixelLeft=this.x;d.style.pixelTop=this.y}
	}
//----------------------------------------------------------------------
// 現在位置をx,yずらす
	this.slideBy=function(x,y){
		if(is_nav4){		d.pageX+=x;			d.pageY+=y}
		else if(is_nav5up){	d.style.left+=x;	d.style.top+=y}
		else if(is_ie4up){	d.style.pixelLeft+=x;d.style.pixelTop+=y}
		this.x+=x;	this.y+=y	//position
	}
//----------------------------------------------------------------------
// 目的位置xd,ydをセットする
	this.slideTo=function(x,y){this.xd=x;	this.yd=y}

	DRAGABLE[DRAGABLE.length]=this
}
