/* namespace nazono */ if( typeof(nazono)!='object' ) nazono={}; with(nazono) {
/**
 * @fileoverview
 * デバッグで使う、Object Dumper
 * 
 * support browser: ie6win ie5mac opera7 gecko1
 * Licence: LGPL
 * @author nazoiking@gmail.com
 */
nazono.objectdump={};
/**
 * オブジェクトをダンプする
 *
 * コンストラクタは呼び出さないこと。
 * コンストラクタを new せずに呼び出すと {@link objectdump#defaultFunc} が呼び出される。
 * @class  オブジェクトをダンプする
 *
 * test 
 */
objectdump=function(){
  return objectdump.defaultFunc.apply( objectdump, arguments );
};

/**
 * オブジェクトのダンプを表示（書き換え）
 * @param obj         ダンプしたいオブジェクト
 * @param {HTMLElement} outelement  ダンプ結果を appendChild するエレメント 未指定時は 勝手に作る
 * @param {int} expandLevel 初表示時の展開レベル 未指定時は 1
 * @return {void}
 */
objectdump.write=function(obj, outelement, expandLevel){
    if( typeof(outelement)=='undefined' ) outelement=this.makedebugdiv( );
    if( typeof(outelement)!='object' ) outelement=document.getElementById(outelement);
    if( typeof(expandLevel)=='undefined') expandLevel=1;
    outelement.innerHTML='';
    outelement.appendChild( this.dump( obj, expandLevel, outelement.document ) );
  }

/**
 * オブジェクトのダンプを表示（追記）
 * @param obj         ダンプしたいオブジェクト
 * @param {HTMLElement} outelement  ダンプ結果を appendChild するエレメント 未指定時は window.document.body
 * @param {int} expandLevel 初表示時の展開レベル 未指定時は 1
 * @return {void}
 */
objectdump.append=function(obj, outelement, expandLevel){
    if( typeof(outelement)=='undefined' ) outelement=this.makedebugdiv( );
    if( typeof(expandLevel)=='undefined')expandLevel=1;
    if( typeof(outelement)!='object' ) outelement=document.getElementById(outelement);
    outelement.appendChild( this.dump(obj, expandLevel, outelement.document ) );
}

/**
 * オブジェクトをダンプして、結果のDOMを返す
 * @param Object  obj                      ダンプしたいオブジェクト
 * @param Integer expandLevel              展開レベル
 * @param HTMLElement_Document outelement  ダンプ結果を appendChild するエレメントのドキュメント
 * @return {HTMLElement} 結果を見やすくしたHTMLElement
 */
objectdump.dump=function(obj,expandLevel,document){
  if(!document) document=window.document;
  if(typeof(obj)=='object')   return this.dump_object(document,obj,expandLevel);
  if(typeof(obj)=='function') return this.dump_function(document,obj);
  if(typeof(obj)=='string')   return this.dump_string(document,obj);
  if(typeof(obj)=='undefined')return this.dump_undefined(document,obj);
  if(typeof(obj)=='boolean')  return this.dump_boolean(document,obj);
  return document.createTextNode( ""+obj );
};

/**
 * 文字列として表示
 * @param document       ダンプ結果を appendChild するエレメントのドキュメント
 * @param obj         ダンプしたいオブジェクト
 * @return {HTMLElement}
 * @private
 */
objectdump.dump_string=function(document,obj){
  return this.colornode(document,'span','"'+obj+'"','#f0f');
};

/**
 * Bool値として表示
 * @param document       ダンプ結果を appendChild するエレメントのドキュメント
 * @param obj         ダンプしたいオブジェクト
 * @return {HTMLElement}
 * @private
 */
objectdump.dump_boolean=function(document,obj){
  return this.colornode(document,'span',""+obj,'#08f');
};

/**
 * undefined として表示
 * @param document       ダンプ結果を appendChild するエレメントのドキュメント
 * @param obj         ダンプしたいオブジェクト
 * @return {HTMLElement}
 * @private
 */
objectdump.dump_undefined=function(document,obj){
  return this.colornode(document,'span','undefined','#f88');
}

/**
 * function として表示
 * @param document    ダンプ結果を appendChild するエレメントのドキュメント
 * @param obj         ダンプしたいオブジェクト
 * @return {HTMLElement}
 * @private
 */
objectdump.dump_function=function(document,obj){
  var oc = document.createElement('span');
  var t = this.colornode(document,'u','// function','#88f');
  var objectdump = this;
  t.style.cursor='pointer';
  t.onclick=function(event){
    var div = objectdump.colornode(document,'pre', obj ,'#000');
    with(div.style){
      marginTop=0; marginBottom=0; marginLeft='1em';
      backgroundColor='#EEF';
    }
    div.appendChild( objectdump.dump_object( document, obj, 0 ) );
    oc.appendChild( div );
    this.onclick=function(){ objectdump.blink(div); };
  }
  oc.appendChild( t );
  return oc;
}

/**
 * object として表示
 * @param document    ダンプ結果を appendChild するエレメントのドキュメント
 * @param obj         ダンプしたいオブジェクト
 * @return {HTMLElement}
 * @private
 */
objectdump.dump_object=function(document,obj,expandLevel){
  var oc = document.createElement('span');
  var t = this.colornode(document,'u','// object','#00f');
  var objectdump = this;
  t.style.cursor='pointer';
  oc.appendChild( t );
  if( expandLevel ){
    var div = this.dump_objectExpand( document, obj, expandLevel );
    oc.appendChild( div );
    t.onclick=function(){ objectdump.blink(div); };
  }else{
    t.onclick=function(event){
      var div = objectdump.dump_objectExpand( document, obj, 1 );
      oc.appendChild( div );
      t.onclick=function(){ objectdump.blink(div); };
    };
  }
  return oc;
}

/**
 * error object として表示
 * @param document       ダンプ結果を appendChild するエレメントのドキュメント
 * @param obj        ダンプしたいオブジェクト
 * @param msg        一緒に表示するメッセージ
 * @return {HTMLElement}
 * @private
 */
objectdump.dump_error=function(document,obj,msg){
  if( obj.message ) obj = obj.name+"("+obj.message+':'+obj.description+")"; // ie
  return this.colornode( document,'i', "// "+msg +" "+ obj , '#F88' );
}

/**
 * object として表示
 * @param document       ダンプ結果を appendChild するエレメントのドキュメント
 * @param obj         ダンプしたいオブジェクト
 * @return {HTMLElement}
 * @private
 */
objectdump.dump_objectExpand=function(document,obj,expandLevel){
  var oc = document.createElement('div');
  oc.style.marginLeft='1em';
  try{
    var propertynames = this.propertyNames(obj);
  }catch(e){
    oc.appendChild( this.dump_error(document, e, "cant get object property-names ") );
    return oc;
  }
  if( propertynames.length == 0 )
    oc.appendChild( this.colornode(document,'div', 'no property' ,'#888') );
  else
    for( var i=0 ; i<propertynames.length ; i++ )
      oc.appendChild( this.dump_objectProperty(document, obj, propertynames[i], expandLevel-1 ) );
  return oc;
}

/**
 * object のプロパティー名を配列としてソートして返す
 * @param obj         ダンプしたいオブジェクト
 * @return {Array}      プロパティー名の配列
 * @private
 */
objectdump.propertyNames=function( obj ){
  var propertynames = new Array();
  for( var i in obj )
    propertynames.push( i );
  propertynames.sort();
  return propertynames;
};
objectdump.propertyNames2=function( obj ){
  var propertynames = new Array();
  for( var i in obj )
    propertynames.push( i );
  // dontenum
  if( !objectdump.dontEnum ) objectdump.dontEnum=objectdump.dontEnums.split(',');
  for( var i=0; i<objectdump.dontEnum.length; i++ )
    if( void(0)!=obj[ objectdump.dontEnum[i] ] )
      propertynames.push( objectdump.dontEnum[i] );
  propertynames.sort();
  // uniq
  var ar=new Array;
  for( var i=0; i<propertynames.length ; i++ ){
    while( propertynames[i] == propertynames[i+1] && propertynames[i+1] ) i++;
    ar.push( propertynames[i] );
  }
  return ar;
}
/**
 * object のプロパティーを表示
 * @param document        ダンプ結果を appendChild するエレメントのドキュメント
 * @param obj         ダンプしたいオブジェクト
 * @param obj         ダンプしたいプロパティー名
 * @param expandLevel 展開レベル
 * @return {HTMLElement}
 * @private
 */
objectdump.dump_objectProperty=function(document, obj, propertyname, expandLevel){
  var div = document.createElement('div');
  div.appendChild( this.colornode(document,'b', propertyname+'=' ,'#000') );
  try{
    var valspan = this.dump( obj[propertyname], expandLevel, document );
  }catch(e){
    valspan = this.dump_error( document, 'i',e, " cant read property " );
  }
  div.appendChild( valspan );
  return div;
}


/**
 * 情報表示領域を勝手に作る
 * @param document     document
 * @return {HTMLElement}
 */
objectdump.makedebugdiv=function(document){
  if( this.makedebugdiv.div ) return this.makedebugdiv.div;
  if( typeof(document)=='undefined' ) document = window.document;
  this.makedebugdiv.div = document.createElement('div');
  document.body.appendChild(this.makedebugdiv.div);
  return this.makedebugdiv.div;
}

/**
 * タグを生成し、色づけしてテキストを入れて返す
 * @param document        ダンプ結果を appendChild するエレメントのドキュメント
 * @param tag         生成するタグ名
 * @param text        テキスト
 * @param color       色
 * @return {HTMLElement}
 * @private
 */
objectdump.colornode=function(document,tag,text,color){
  var e = document.createElement(tag);
  e.style.color=color;
  e.appendChild( document.createTextNode(text) );
  return e;
}
/**
 * 対象のエレメントの表示←→非表示を切り替える
 * @param {HTMLElement} div         エレメント
 * @return {void}
 * @private
 */
objectdump.blink=function(div){
  div.style.display=(div.style.display=='none')?'':'none';
}

/**
 * デフォルトファンクション
 *
 * 標準では {@link objectdump#write}
 * @type {Function}
 */
objectdump.defaultFunc=objectdump.write;

objectdump.dontEnums= "$&,$',$*,$+,$1,$2,$3,$4,$5,$6,$7,$8,$9,$_,$`,ActiveXObject,AddChannel,AddDesktopComponent,AddFavorite,Array,AutoCompleteSaveForm,AutoScan,Boolean,ChooseColorDlg,Date,E,Enumerator,Error,Function,GetObject,Hidden,Image,ImportExportFavorites,IsSubscribed,LN10,LN2,LOG10E,LOG2E,MAX_VALUE,MIN_VALUE,Math,Methods,NEGATIVE_INFINITY,NaN,NavigateAndFind,Number,Object,Option,PI,POSITIVE_INFINITY,QueryInterface,RegExp,SQRT1_2,SQRT2,Script,ScriptEngine,ScriptEngineBuildVersion,ScriptEngineMajorVersion,ScriptEngineMinorVersion,ShowBrowserUI,String,URL,URLUnencoded,UTC,VBArray,XMLDocument,XSLDocument,aLink,abbr,abs,accelerator,accept,acceptCharset,accessKey,acos,action,activeElement,add,addBehavior,addImport,addPageRule,addReadRequest,addRequest,addRule,alert,align,alinkColor,all,allowTransparency,alt,altHTML,altKey,altLeft,anchor,anchors,appCodeName,appMinorVersion,appName,appVersion,appendChild,appendData,applets,apply,applyElement,areas,arguments,asin,assign,atEnd,atan,atan2,atomic,attachEvent,attributes,autocomplete,availHeight,availWidth,axis,back,background,backgroundAttachment,backgroundColor,backgroundImage,backgroundPosition,backgroundPositionX,backgroundPositionY,backgroundRepeat,balance,baseHref,behavior,behaviorCookie,behaviorPart,behaviorUrns,bgColor,bgProperties,big,blink,blockDirection,blur,body,bold,border,borderBottom,borderBottomColor,borderBottomStyle,borderBottomWidth,borderCollapse,borderColor,borderColorDark,borderColorLight,borderLeft,borderLeftColor,borderLeftStyle,borderLeftWidth,borderRight,borderRightColor,borderRightStyle,borderRightWidth,borderStyle,borderTop,borderTopColor,borderTopStyle,borderTopWidth,borderWidth,bottom,bottomMargin,browserLanguage,bufferDepth,button,call,caller,canHaveChildren,canHaveHTML,cancelBubble,caption,captureEvents,ceil,cellIndex,cellPadding,cellSpacing,cells,ch,chOff,charAt,charCodeAt,charset,checked,checked,childNodes,children,chooseColorDlg,cite,className,clear,clearAttributes,clearData,clearInterval,clearRequest,clearTimeout,click,clientHeight,clientInformation,clientLeft,clientTop,clientWidth,clientX,clientY,clip,clipBottom,clipLeft,clipRight,clipTop,clipboardData,cloneNode,close,closed,code,codeBase,codeType,colSpan,collapse,color,colorDepth,cols,commitChanges,compact,compareEndPoints,compatMode,compile,complete,componentFromPoint,concat,confirm,connectionSpeed,constructor,contains,content,contentEditable,contentOverflow,contentWindow,cookie,cookieEnabled,coords,cos,count,cpuClass,create,createAttribute,createCDATASection,createCaption,createComment,createControlRange,createDocumentFragment,createDocumentFromUrl,createElement,createEntityReference,createEventObject,createPopup,createProcessingInstruction,createRange,createRangeCollection,createStyleSheet,createTFoot,createTHead,createTextNode,createTextRange,cssText,ctrlKey,ctrlLeft,currentStyle,cursor,data,dataFld,dataFormatAs,dataPageSize,dataSrc,dataTransfer,dateTime,declare,decodeURI,decodeURIComponent,defaultCharset,defaultChecked,defaultSelected,defaultStatus,defaultValue,defaults,defer,deleteCaption,deleteData,deleteRow,deleteTFoot,deleteTHead,description,designMode,detachEvent,deviceXDPI,deviceYDPI,dialogArguments,dialogHeight,dialogLeft,dialogTop,dialogWidth,dimensions,dir,direction,disableExternalCapture,disabled,display,doImport,doReadRequest,doRequest,doScroll,doWriteRequest,doctype,document,documentElement,domain,dragDrop,dropEffect,duplicate,dynsrc,effectAllowed,elementFromPoint,elements,embeds,empty,enableExternalCapture,encodeURI,encodeURIComponent,encoding,enctype,escape,eval,event,exec,execCommand,execScript,exp,expando,external,face,fgColor,fileCreatedDate,fileModifiedDate,fileSize,fileUpdatedDate,filter,filters,find,findText,fireEvent,firstChild,firstPage,fixed,floor,focus,font,fontFamily,fontSize,fontSmoothingEnabled,fontStyle,fontVariant,fontWeight,fontcolor,fontsize,form,forms,forward,frame,frameBorder,frameSpacing,frames,fromCharCode,fromElement,galleryImg,getAdjacentText,getAttribute,getAttributeNode,getBookmark,getBoundingClientRect,getCharset,getClientRects,getComponentVersion,getData,getDate,getDay,getElementById,getElementsByName,getElementsByTagName,getExpression,getFullYear,getHours,getMilliseconds,getMinutes,getMonth,getNamedItem,getSeconds,getSelection,getTime,getTimezoneOffset,getUTCDate,getUTCDay,getUTCFullYear,getUTCHours,getUTCMilliseconds,getUTCMinutes,getUTCMonth,getUTCSeconds,getUTCYear,getVarDate,getYear,global,go,handleEvent,hasChildNodes,hasFeature,hasFocus,hasLayout,hasOwnProperty,hash,headers,height,hidden,hide,hideFocus,history,home,host,hostname,href,hreflang,hspace,htmlFor,htmlText,httpEquiv,id,ignoreCase,images,imeMode,implementation,imports,inRange,indeterminate,index,indexOf,innerHTML,innerText,input,insertAdjacentElement,insertAdjacentHTML,insertAdjacentText,insertBefore,insertData,insertRow,isComponentInstalled,isContentEditable,isDisabled,isEqual,isFinite,isMap,isMultiLine,isNaN,isOpen,isPrototypeOf,isTextEdit,italics,item,javaEnabled,join,keyCode,label,lang,language,lastChild,lastIndex,lastIndexOf,lastMatch,lastModified,lastPage,lastParen,layoutFlow,layoutGrid,layoutGridChar,layoutGridLine,layoutGridMode,layoutGridType,lbound,left,leftContext,leftMargin,length,letterSpacing,lineBreak,lineHeight,link,linkColor,links,listStyle,listStyleImage,listStylePosition,listStyleType,load,location,log,logicalXDPI,logicalYDPI,longDesc,loop,lowsrc,map,margin,marginBottom,marginHeight,marginLeft,marginRight,marginTop,marginWidth,match,max,maxLength,media,mergeAttributes,message,method,mimeType,mimeTypes,min,minHeight,move,moveAbove,moveBelow,moveBy,moveEnd,moveFirst,moveNext,moveRow,moveStart,moveTo,moveToAbsolute,moveToBookmark,moveToElementText,moveToPoint,multiline,multiple,n,name,nameProp,namedItem,namedRecordset,namespaces,navigate,navigator,nextPage,nextSibling,noHref,noResize,noShade,noWrap,nodeName,nodeType,nodeValue,normalize,number,object,offscreenBuffering,offsetHeight,offsetLeft,offsetParent,offsetTop,offsetWidth,offsetX,offsetY,onLine,onactivate,onafterprint,onafterupdate,onbeforeactivate,onbeforecopy,onbeforecut,onbeforedeactivate,onbeforeeditfocus,onbeforepaste,onbeforeprint,onbeforeunload,onbeforeupdate,onblur,oncellchange,onclick,oncontextmenu,oncontrolselect,oncopy,oncut,ondataavailable,ondatasetchanged,ondatasetcomplete,ondblclick,ondeactivate,ondrag,ondragend,ondragenter,ondragleave,ondragover,ondragstart,ondrop,onerror,onerrorupdate,onfilterchange,onfocus,onfocusin,onfocusout,onhelp,onkeydown,onkeypress,onkeyup,onlayoutcomplete,onload,onlosecapture,onmousedown,onmouseenter,onmouseleave,onmousemove,onmouseout,onmouseover,onmouseup,onmousewheel,onmove,onmoveend,onmovestart,onpage,onpaste,onpropertychange,onreadystatechange,onresize,onresizeend,onresizestart,onrowenter,onrowexit,onrowsdelete,onrowsinserted,onscroll,onselect,onselectionchange,onselectstart,onstop,onunload,open,opener,opsProfile,options,outerHTML,outerText,overflow,overflowX,overflowY,ownerDocument,owningElement,padding,paddingBottom,paddingLeft,paddingRight,paddingTop,pageBreakAfter,pageBreakBefore,pages,palette,parent,parentElement,parentNode,parentStyleSheet,parentTextEdit,parentWindow,parse,parseFloat,parseInt,pasteHTML,pathname,pause,pixelBottom,pixelHeight,pixelLeft,pixelTop,pixelWidth,platform,plugins,pluginspage,pop,port,posBottom,posHeight,posLeft,posRight,posTop,posWidth,position,pow,preference,previousPage,previousSibling,print,profile,prompt,propertyName,protocol,protocolLong,prototype,pseudoClass,push,qualifier,queryCommandEnabled,queryCommandIndeterm,queryCommandState,queryCommandSupported,queryCommandValue,random,readOnly,readyState,reason,recalc,recordNumber,recordset,referrer,refresh,rel,releaseCapture,releaseEvents,reload,remove,removeAttribute,removeAttributeNode,removeBehavior,removeChild,removeExpression,removeNamedItem,removeNode,removeRule,repeat,replace,replaceAdjacentText,replaceChild,replaceData,replaceNode,reset,resizeBy,resizeTo,result,resume,returnValue,rev,reverse,right,rightContext,rightMargin,round,routeEvent,rowIndex,rowSpan,rows,rubyAlign,rubyOverhang,rubyPosition,rules,runtimeStyle,save,saveType,scheme,scope,scopeName,screen,screenLeft,screenTop,screenX,screenY,scripts,scroll,scrollAmount,scrollBy,scrollDelay,scrollHeight,scrollIntoView,scrollLeft,scrollTo,scrollTop,scrollWidth,scrollbar3dLightColor,scrollbarArrowColor,scrollbarBaseColor,scrollbarDarkShadowColor,scrollbarFaceColor,scrollbarHighlightColor,scrollbarShadowColor,scrollbarTrackColor,scrolling,search,sectionRowIndex,security,select,selected,selectedIndex,selection,selector,selectorText,self,setActive,setAttribute,setAttributeNode,setCapture,setData,setDate,setEndPoint,setExpression,setFullYear,setHours,setInterval,setMilliseconds,setMinutes,setMonth,setNamedItem,setSeconds,setTime,setTimeout,setUTCDate,setUTCFullYear,setUTCHours,setUTCMilliseconds,setUTCMinutes,setUTCMonth,setUTCSeconds,setUTCYear,setYear,shape,shift,shiftKey,show,showHelp,showModalDialog,showModelessDialog,sin,size,slice,small,sort,source,sourceIndex,span,specified,splice,split,splitText,sqrt,src,srcElement,srcFilter,standby,start,status,stop,strike,style,styleFloat,styleSheets,style_Str,sub,submit,substr,substring,substringData,summary,sup,swapNode,systemLanguage,tabIndex,tabStop,tableLayout,tagName,tagUrn,tags,taint,taintEnabled,tan,target,tbodies,test,text,textAlign,textAlignLast,textAutospace,textDecoration,textDecorationBlink,textDecorationLineThrough,textDecorationNone,textDecorationOverline,textDecorationUnderline,textIndent,textJustify,textJustifyTrim,textKashida,textKashidaSpace,textOverflow,textTransform,textUnderlinePosition,tfoot,thead,title,toElement,toExponential,toFixed,toGMTString,toLocaleString,toLowerCase,toPrecision,toSource,toString,toUTCString,toUpperCase,toVarDate,top,topMargin,trueSpeed,type,typeDetail,unescape,unicodeBidi,uniqueID,uniqueNumber,units,unselectable,unshift,untaint,updateInterval,url,urn,urns,useMap,userAgent,userLanguage,userProfile,vAlign,vLink,value,valueOf,valueType,vcard_name,version,verticalAlign,viewInheritStyle,viewLink,viewMasterTab,visibility,vlinkColor,volume,vrml,vspace,wheelDelta,whiteSpace,whiteSpace,width,window,wordBreak,wordSpacing,wordWrap,wrap,write,writeln,writingMode,x,y,zIndex,zOrder,zoom";

/* namespace nazono ************************/  }

// export
objectdump = nazono.objectdump;
