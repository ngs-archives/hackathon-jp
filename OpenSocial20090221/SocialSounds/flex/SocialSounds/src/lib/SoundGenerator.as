package lib
{
    import flash.events.SampleDataEvent;
    import flash.media.Sound;
    import flash.media.SoundChannel;
    import flash.media.SoundMixer;
    import flash.media.SoundTransform;

    public class SoundGenerator
    {
        // soundジェネレート用の引数
        private var paramSound:String = "";
        private var person:Object;
        private var mySound:Sound = new Sound();
        private var myChannel:SoundChannel;
        private var trans:SoundTransform = SoundMixer.soundTransform;
        private var n:int = 0;

        public function SoundGenerator(person:Object) {
            this.person = person;
            // sound生成パラメータ
            if (person.sound && person.sound.data) {
                paramSound = person.sound.data;
            } else {
                paramSound = person.id.substring(0, 2);
                person.sound = {data: paramSound, timestamp: new Date().getTime()};
            }
            // Soundのジェネレート
            mySound.addEventListener(SampleDataEvent.SAMPLE_DATA, onSampleData);
        }

        public function getPerson():Object {
            return person;
        }

        public function playSound():void {
            //chgTrans(0.5, 0);
            log("play");
            myChannel = mySound.play();
        }

        public function stopSound():void {
            log("stop");
            if (myChannel) myChannel.stop();
        }

        public function onSampleData(evt:SampleDataEvent):void {
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

//        public function onSampleData2(event:SampleDataEvent):void{
//            // この中で SoundChannel にデータを書き込む
//            for (var c:int=0; c<8192; c++) {
//                var hoge:Number = Number(paramSound);
//                if(hoge >= 1){
//                    hoge = hoge/10;
//                }
//                var rad:Number = Number(c+event.position)/Math.PI/2;
//                var amp:Number = Math.sin(rad) / 4;  // -1 から 1 の間の値なら OK
//
//                //var amp:Number = hoge;
//                event.data.writeFloat(amp);  // 左チャネルの音
//                event.data.writeFloat(amp);  // 右チャネルの音
//
//            }
//        }
//
//        public function sineWaveGenerator(event:SampleDataEvent):void {
//            for ( var c:int=0; c<8192; c++ ) {
//                event.data.writeFloat(Math.sin((Number(c+event.position)/Math.PI/2))*0.25);
//                event.data.writeFloat(Math.sin((Number(c+event.position)/Math.PI/2))*0.25);
//            }
//        }

        public function chgTrans(num1:Number, num2:Number):void {
            trans.volume = num1;
            trans.pan = num2;
            SoundMixer.soundTransform = trans;
        }
    }
}

