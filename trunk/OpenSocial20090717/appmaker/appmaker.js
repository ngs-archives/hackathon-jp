/*******************************************************************************
 * デバッグコンソルに出力
 */
function toConsole(paramStr){ echo(paramStr); }
function echo(paramStr){
//	alert('echo('+paramStr+')');
   if( document.getElementById("debug_console") ) {
	  var debug_text = document.createTextNode(paramStr);
	  document.getElementById("debug_console").appendChild( debug_text );
   }
}


/*******************************************************************************
 * ツールスーパークラス
 */

function ToolSuper() {};
ToolSuper.prototype = {
	disp : function() { echo("SSS"); }
};


/*******************************************************************************
 * ツールスーパークラス
 */
function ToolMemo() {};
ToolMemo.prototype = new ToolSuper();


/*******************************************************************************
 * DEBUG
 */
var toolMemo = new ToolMemo();
toolMemo.disp();


