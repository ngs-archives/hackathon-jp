package lib
{
    import flash.xml.XMLNode;

    public class ObjectDumper
    {
        public static function toString(obj:Object, showFunctions:Boolean = true, showUndefined:Boolean = true, showXMLstructures:Boolean = true, maxLineLength:int = 100, indent:int = 0):String
        {
            var od:ObjectDumper = new ObjectDumper();
            return od.realToString(obj, showFunctions, showUndefined, showXMLstructures, maxLineLength, indent);
        }

        public function ObjectDumper()
        {
            this.inProgress = new Array();
        }

        private var inProgress:Array;

        private function realToString(obj:Object, showFunctions:Boolean = true, showUndefined:Boolean = true, showXMLstructures:Boolean = true, maxLineLength:int = 100, indent:int = 0):String
        {
            for (var x:int = 0; x < this.inProgress.length; x++)
            {
                if (this.inProgress[x] == obj) return "***";
            }
            this.inProgress.push(obj);

            indent ++;
            var t:String = typeof(obj);
            //trace("<<<" + t + ">>>");
            var result:String;

            if ((obj is XMLNode) && (showXMLstructures != true))
            {
                result = obj.toString();
            }
            else if (obj is Date)
            {
                result = obj.toString();
            }
            else if (t == "object")
            {
                var nameList:Array = new Array();
                if (obj is Array)
                {
                    result = "["; // "Array" + ":";
                    for (var i:int = 0; i < obj.length; i++)
                    {
                        nameList.push(i);
                    }
                }
                else
                {
                    result = "{"; // "Object" + ":";
                    for (var s:String in obj)
                    {
                        nameList.push(s);
                    }
                    nameList.sort();
                }

                //if (obj.length == undefined) trace("obj.length undefined");
                //if (obj.length == null) trace("obj.length null");
                //if (obj.length == 0) trace("obj.length 0");
                //trace("namelist length " + nameList.length + ", obj.length " + obj.length);
                var sep:String = "";
                for (var j:int = 0; j < nameList.length; j++)
                {
                    var val:Object = obj[nameList[j]];

                    var show:Boolean = true;
                    if (typeof(val) == "function") show = (showFunctions == true);
                    if (typeof(val) == "undefined") show = (showUndefined == true);

                    if (show)
                    {
                        result += sep;
                        if (!(obj is Array))
                            result += nameList[j] + ": ";
                        result +=
                            realToString(val, showFunctions, showUndefined, showXMLstructures, maxLineLength, indent);
                        sep = ", `";
                    }
                }
                if (obj is Array)
                    result += "]";
                else
                    result += "}";
            }
            else if (t == "function")
            {
                result = "function";
            }
            else if (t == "string")
            {
                result = "\"" + obj + "\"";
            }
            else
            {
                result = String(obj);
            }

            if (result == "undefined") result = "-";
            this.inProgress.pop();
            return ObjectDumper.replaceAll(result, "`", (result.length < maxLineLength) ? "" : ("\n" + doIndent(indent)));
        }

        public static function replaceAll (str : String, from: String, to: String):String
        {
            var chunks:Array = str.split(from);
            var result:String = "";
            var sep:String = "";
            for (var i:int = 0; i < chunks.length; i++)
            {
                result += sep + chunks[i];
                sep = to;
            }
            return result;
        }

        private function doIndent(indent:int):String
        {
            var result:String = "";
            for (var i:int = 0; i < indent; i ++)
            {
                result += "     ";
            }
            return result;
        }

    }
}