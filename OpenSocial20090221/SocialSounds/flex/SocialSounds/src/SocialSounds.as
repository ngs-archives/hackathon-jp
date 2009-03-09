package
{
    //import ui.*;
    import caurina.transitions.properties.*;

    import flash.display.Sprite;
    import flash.events.Event;
    import flash.events.MouseEvent;
    import flash.events.SampleDataEvent;
    import flash.external.*;
    import flash.media.Sound;
    import flash.media.SoundChannel;
    import flash.media.SoundMixer;
    import flash.media.SoundTransform;
    import flash.system.Security;
    import flash.text.TextField;
    import flash.text.TextFieldAutoSize;
    import flash.text.TextFieldType;

    import lib.log;

    public class SocialSounds extends Sprite
    {
        private var flgDebug:Boolean = true;
        private var tfError:TextField = createTf();

        // soundジェネレート用の引数
        private var paramSound:String = "";

        private var numStageW:Number = 390;
        private var numStageH:Number = 150;

        private var objOwner:Object = new Object(); // オーナーデータ
        private var objViewer:Object = new Object(); // ビューワデータ

        // 「追加」ボタン
        private var btnGetSound:TextField; //BtnGetSound = new BtnGetSound();

        // 再生ボタン
        private var btnPlaySound:TextField; //BtnPlaySound = new BtnPlaySound();
        private var btnStopSound:TextField; //BtnStopSound = new BtnStopSound();

        private var mySound:Sound = new Sound();
        private var myChannel:SoundChannel;
        private var trans : SoundTransform = SoundMixer.soundTransform;
        private var n :int = 0;

        public function SocialSounds()
        {
            this.width = numStageW;
            this.height = numStageH;
            flash.system.Security.allowDomain("*");
            btnPlaySound = new TextField();
            btnStopSound = new TextField();
            btnGetSound = new TextField();
            this.addChild(btnPlaySound);
            try {
                ExternalInterface.addCallback("initResultHandler", initResultHandler);
                ExternalInterface.addCallback("getViewerResultHandler", getViewerResultHandler);
                ExternalInterface.addCallback("getOwnerResultHandler", getOwnerResultHandler);
                ExternalInterface.addCallback("saveSoundResultHandler", saveSoundResultHandler);
                ExternalInterface.addCallback("addSoundResultHandler", addSoundResultHandler);
                ExternalInterface.call("init");
            } catch (error:Error) {
                log("an error occurred: " + error.message + "\n");
            }
        }

        // FlashからExternalInterface.callして、それを受けてJSから、ExternalInterface.addCallbackでデータを受け取る
        public function initResultHandler(obj:Object):void{
            ExternalInterface.call("getOwner");
        }

        public function getOwnerResultHandler(obj:Object):void{
            log(obj.result);
            log(obj.owner);

            objOwner = obj.owner;
            var objResult:Object = obj.result;
            log(objResult);

            // sound生成パラメータ
            paramSound = String(objOwner.id).substring(0, 2);
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

        // JSからビューワデータを受け取る
        public function getViewer():void{
            ExternalInterface.call("getViewer");
        }

        // getViewerの結果
        public function getViewerResultHandler(obj:Object):void{
            objViewer = obj.viewer;
            var objResult:Object = obj.result;
            if(objResult.success){
                log("ok");
                // 追加ボタンを表示する
                visibleBtn(objOwner, objViewer);
            }else{
                //log("error");
                //　エラー表示
                error(objResult.message);
            }
        }

        // サウンド生成 （引数：オーナーデータ）
        public function saveSound(owner:Object):void{
            // 既にあったら
            if(owner.sound && owner.sound.data != ""){
                // owner.soundを元に、実際の音を生成する
                log("サウンド保存：既にあります" );
            }else{
                // パラメータを作る
                var param:Object = {
                    data: paramSound,
                    timestamp: new Date().getTime()
                };
                owner.sound = param;
                log("保存パラメータ");
                log(owner.id);
                log(owner.sound);
                // パラメータ保存
                ExternalInterface.call("saveSound", param);
            }
        }

        // デバッグ用
        // パラメータ保存が成功したかどうか
        public function saveSoundResultHandler(obj:Object):void{
            if(obj.result && obj.result.success){
                // OK
                log("保存成功");
            }else{
                // 失敗内容をコンソール表示
                //obj.result.message
                log(obj.result.message);
            }
        }

        // 追加ボタンの表示・非表示処理　引数（オーナーデータ、ビューワデータ）
        public function visibleBtn(owner:Object, viewer:Object):void{
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
        public function clickSave(e:Event):void{
            saveSound(objOwner);
            //ExternalInterface.call("saveSound", objOwner.id);
        }

        // 追加が成功したかどうか
        public function addSoundResultHandler(obj:Object):void{
            if(obj.result.success){
                // OK
                showPop(obj.result.message);
            }else{
                // 失敗内容をユーザーに見せる（特に何もしない。見せるだけ）
                //obj.message
                error(obj.result.message);
            }
        }

        // 再生・停止ボタンの初期化
        public function initCtrl():void{
            //Tweener.addTween(mcLoading, {alpha:0, time:0.5, transition:"easeoutquad", onComplete:initCtrl2});
        }

        public function initCtrl2():void{
            //mcLoading.visible = false;
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

        public function playSound(e:Event):void{
            //chgTrans(0.5, 0);
            log("play");
            myChannel = mySound.play();
            btnPlaySound.visible = false;
            btnStopSound.visible = true;
        }

        public function stopSound(e:Event):void{
            log("stop");
            myChannel.stop();
            btnPlaySound.visible = true;
            btnStopSound.visible = false;
        }

        public function onSampleData2(event:SampleDataEvent):void{
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

        public function onSampleData ( evt :SampleDataEvent ) :void {
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

            var sff:Number = Number(paramSound) + 50;

            for (i = 0; i < 8192; i++) {

                c = 800 / sff * (n % sff);
                amp = (ar[c] - 300) / 300;  // -1.0 ～ 1.0
                //amp = 0.5;

                evt.data.writeFloat(amp);
                evt.data.writeFloat(amp);

                n ++;
            }
        }

        public function chgTrans(num1:Number, num2:Number):void{
            trans.volume = num1;
            trans.pan = num2;
            SoundMixer.soundTransform = trans;
        }

        public function error(str:String):void{
            log("エラー");
            log(str);
            tfError.text = str;
        }

        // ポップアップを表示する
        public function showPop(str:String):void{
            log(str);
        }

        public function createTf():TextField{
            var tf:TextField = new TextField();
            addChild(tf);

            tf.x = 0;
            tf.y = 120;
            tf.width  = 390;
            tf.height = 20;

            tf.alwaysShowSelection = false;
            tf.autoSize = TextFieldAutoSize.CENTER;     // サイズ整形の種類
            tf.multiline = true;        // 複数行か？
            tf.selectable = false;      // 選択可能か？
            tf.sharpness = 0;       // 文字エッジのシャープネス
            tf.textColor = 0x0000AA;        // テキストの色
            tf.thickness = 1;       // 文字エッジの太さ
            tf.type = TextFieldType.DYNAMIC;    // テキストフィールドのタイプ

            return tf;
        }
    }
}