
flash.system.Security.allowDomain("api.msappspace.com");


var flgDebug:Boolean = true;


// UI部品の生成以外は、すべてここで処理しちゃってます


//________________________________________________________________________ loading


import ui.*;

import caurina.transitions.Tweener;
import caurina.transitions.properties.*;

DisplayShortcuts.init();
FilterShortcuts.init();
ColorShortcuts.init();
TextShortcuts.init();
CurveModifiers.init();


//________________________________________________________________________ vars


var tfError:TextField = createTf();

// soundジェネレート用の引数
var paramSound:String = "";

var numStageW:Number = 390;
var numStageH:Number = 150;

var objOwner:Object = new Object(); // オーナーデータ
var objViewer:Object = new Object(); // ビューワデータ

// 「追加」ボタン
var btnGetSound:BtnGetSound = new BtnGetSound();

// 再生ボタン
var btnPlaySound:BtnPlaySound = new BtnPlaySound();
var btnStopSound:BtnStopSound = new BtnStopSound();

var mySound:Sound = new Sound();
var myChannel:SoundChannel;
var trans : SoundTransform = SoundMixer.soundTransform;


//________________________________________________________________________ loading


var mcLoading:LoadingSmall = new LoadingSmall();
mcLoading.alpha = 0;
mcLoading.x = numStageW/2;
mcLoading.y = numStageH/2;
addChild(mcLoading);
Tweener.addTween(mcLoading, {alpha:1, time:0.5, transition:"easeoutquad", onComplete:initGen});


//________________________________________________________________________ initGen


// getOwnerの結果を、JSからオーナーデータを受け取る
ExternalInterface.addCallback("setOwner", setOwner);
function setOwner(obj:Object):void{
	
	log(obj.result);
	log(obj.owner);
	
	objOwner = obj.owner;
	var objResult:Object = obj.result;
	log(objResult);
	
	// sound生成パラメータ
	paramSound = objOwner.id.substring(0, 2);
	log("パラメータ");
	log(paramSound);
	
	if(objResult.success){
		// ビューワデータを取得する
		getViewer();
		// Soundを生成する
		saveSound(objOwner);
	}else{
		//　エラー表示
		error(objResult.message);
	}
}


// FlashからExternalInterface.callして、それを受けてJSから、ExternalInterface.addCallbackでデータを受け取る
function initGen():void{
	ExternalInterface.call("getOwner");
}


// JSからビューワデータを受け取る
function getViewer():void{
	ExternalInterface.addCallback("setViewer", setViewer);
	ExternalInterface.call("getViewer");
}

// getViewerの結果
function setViewer(obj:Object):void{
	
	objViewer = obj.viewer;
	var objResult:Object = obj.result;
	
	if(objResult.success){
		log("ok");
		// 追加ボタンを表示する
		visibleBtn(objOwner, objViewer);
	}else{
		log("error");
		//　エラー表示
		error(objResult.message);
	}
	
	
}



//___________________________________________________________________________ generate


// サウンド生成 （引数：オーナーデータ）
function saveSound(owner:Object):void{
	// 既にあったら
	if(owner.sound && owner.sound != ""){
		// owner.soundを元に、実際の音を生成する
		log("サウンド保存：既にあります" );
	}else{
		// パラメータを作る
		owner.sound = paramSound;
		log("保存パラメータ");
		log(owner.id);
		log(owner.sound);
		// パラメータ保存
		ExternalInterface.call("saveSound", owner.id, owner.sound);
	}
}

// デバッグ用
// パラメータ保存が成功したかどうか
ExternalInterface.addCallback("setSaveSoundResult", setSaveSoundResult);
function setSaveSoundResult(obj:Object):void{
	if(obj.success){
		// OK
		log("保存成功");
	}else{
		// 失敗内容をコンソール表示
		//obj.message
		log(obj.message);
	}
}


// 追加ボタンの表示・非表示処理　引数（オーナーデータ、ビューワデータ）
function visibleBtn(owner:Object, viewer:Object):void{
	if(owner.id == viewer.id){
		// 表示しない
		
	}else{
		if(viewer.hasOwnerSound){
			// 表示しない
		}else{
			// 表示する、イベントの追加
			addChild(btnGetSound);
			//btnGetSound.alpha = 0;
			btnGetSound.addEventListener(MouseEvent.CLICK, clickSave);
		}
	}
	
	// 再生・停止ボタンの表示とイベント追加
	initCtrl();
}

// 追加ボタンクリック
function clickSave(e:Event):void{
	ExternalInterface.call("addSound", objOwner.id, objViewer.id);
}

// 追加が成功したかどうか
ExternalInterface.addCallback("setAddSoundResult", setAddSoundResult);
function setAddSoundResult(obj:Object):void{
	if(obj.success){
		// OK
		showPop(obj.message);
	}else{
		// 失敗内容をユーザーに見せる（特に何もしない。見せるだけ）
		//obj.message
		error(obj.message);
	}
}

// 再生・停止ボタンの初期化
function initCtrl():void{
	Tweener.addTween(mcLoading, {alpha:0, time:0.5, transition:"easeoutquad", onComplete:initCtrl2});
}

function initCtrl2():void{
	mcLoading.visible = false;
	btnPlaySound.x = 200;
	btnPlaySound.y = 100;
	addChild(btnPlaySound);
	
	btnStopSound.x = 200;
	btnStopSound.y = 100;
	addChild(btnStopSound);
	
	btnStopSound.visible = false;
	
	btnPlaySound.addEventListener(MouseEvent.CLICK, playSound);
	btnStopSound.addEventListener(MouseEvent.CLICK, stopSound);
	
	// Soundのジェネレート
	mySound.addEventListener(SampleDataEvent.SAMPLE_DATA, onSampleData);
	
	// fin
}


//________________________________________________________________________ play / stop


function playSound(e:Event):void{
	//chgTrans(0.5, 0);
	log("play");
	myChannel = mySound.play();
	btnPlaySound.visible = false;
	btnStopSound.visible = true;
}

function stopSound(e:Event):void{
	log("stop");
	myChannel.stop();
	btnPlaySound.visible = true;
	btnStopSound.visible = false;
}


//________________________________________________________________________ generate


function onSampleData2(event:SampleDataEvent):void{
	// この中で SoundChannel にデータを書き込む
	for (var c:int=0; c<8192; c++) {
		var hoge:Number = Number(paramSound);
		if(hoge >= 1){
			hoge = hoge/10;
		}
		var rad:Number = Number(c+event.position)/Math.PI/2;
		var amp:Number = Math.sin(rad) / 4;  // -1 から 1 の間の値なら OK
		
		
		//var amp:Number = hoge;
		event.data.writeFloat(amp);  // 左チャネルの音
		event.data.writeFloat(amp);  // 右チャネルの音
		
	}
}


var n :int = 0;

function onSampleData ( evt :SampleDataEvent ) :void {
	
	var hoge:Number = Number(paramSound)/100;
	if(hoge > 50){
		hoge = 50;
	}
	var ar:Array = new Array();
	
	for (i = 0;i<801;i++){
		ar.push(hoge*1000 + i);
	}
	
	var i:int;
	var c:int;
	var amp :Number;
	
	var sff = Number(paramSound) + 50;
	
	for (i = 0; i < 8192; i++) {
		
		c = 800 / sff * (n % sff);
		amp = (ar[c] - 300) / 300;	// -1.0 ～ 1.0
		//amp = 0.5;
		
		evt.data.writeFloat(amp);
		evt.data.writeFloat(amp);
		
		n ++;
	}
}




//________________________________________________________________________ trans


function chgTrans(num1:Number, num2:Number):void{
	trans.volume = num1;
	trans.pan = num2;
	SoundMixer.soundTransform = trans;
}


//________________________________________________________________________ scrollbar



//___________________________________________________________________________ sub

function error(str:String):void{
	log("エラー");
	log(str);
	tfError.text = str;
}

// ポップアップを表示する
function showPop(str:String):void{
	log(str);
}

function createTf():TextField{
	var tf = new TextField();
	stage.addChild(tf);

	tf.x = 0;
	tf.y = 120;
	tf.width  = 390;
	tf.height = 20;

	tf.alwaysShowSelection = false;
	tf.autoSize = TextFieldAutoSize.CENTER; 	// サイズ整形の種類
	tf.multiline = true;		// 複数行か？
	tf.selectable = false;		// 選択可能か？
	tf.sharpness = 0;		// 文字エッジのシャープネス
	tf.textColor = 0x0000AA;		// テキストの色
	tf.thickness = 1;		// 文字エッジの太さ
	tf.type = TextFieldType.DYNAMIC;	// テキストフィールドのタイプ
	
	return tf;
}

