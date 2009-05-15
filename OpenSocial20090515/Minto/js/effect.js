/*
2001.3.13-2008.6.6 Satoshi Koyama(koyama@cc.hirosaki-u.ac.jp), Hirosaki Univ.
�G�t�F�N�g���ڃ��C�u����
http://siva.cc.hirosaki-u.ac.jp/usr/koyama/effect/

���̃��C�u������Netscape�Ђ� "Drag and Drop Component" ���g�[���č쐬���܂����B
���̃y�[�W�̋�URL�͉��L�ł����A���݂͉{���ł��܂���B
http://developer.netscape.com/docs/examples/dynhtml/dragable/index.html

�g����:
	D=putObj(x,y,html)		(x,y)��Obj�̃C���X�^���X�𐶐�����
	D=new Obj(x,y,html)		(x,y)��Obj�̃C���X�^���X�𐶐�����
	D.layer					���C���[ID �܂��� �X�^�C��ID
	D.ondrop=function ...	ondrop�C�x���g�n���h��
	D.onmove=function ...	onmove�C�x���g�n���h��
	D.ondrag=function ...	ondrag�C�x���g�n���h��
	D.ondown=function ...	ondown�C�x���g�n���h��

	D.bgColor(color)		D�̔w�i�F��color�ɂ���
	D.dragable()			D���h���b�O�\�ɂ���
	D.show()/D.hide()		D��������/�B��
	D.clip(x1,y1,x2,y2)		D��D�̑��΍��W(x1,y1),(x2,y2)�ŃN���b�v����
	D.bound(x1,y1,x2,y2)	D�̈ړ��͈͂�(x1,y1),(x2,y2)�͈̔͂ɐ��񂷂�
	D.bind(b)				D���I�u�W�F�N�gb�Ƀo�C���h����
	D.moveBy(x,y)			D��(x,y)�����ړ�����
	D.moveBy(x,y,x1,y1,x2,y2)	�ړ����D��(x1,y1),(x2,y2)�ŃN���b�v
	D.moveTo(x,y)			D��(x,y)�Ɉړ�����
	D.forced(t)				D��t�̊O����ɂ������ꍇ�At�̓���/�O���Ɉړ�����
	D.inside(x,y)			(x,y)��D��ɂ��邩�`�F�b�N...true/false
	D.dragability			D�̃h���b�O�L��/����...true(/false)
	D.x, D.y				D�̈ʒu
	D.width, D.height		D�̕��ƍ���
	D.Z						true�Ȃ��D���}�E�X���삵�����ɍł���̃��C���ɂ���
	dstartX, dstartY		�h���b�O�J�n���̃}�E�X�|�C���^�̈ʒu
	droppedX, droppedY		�h���b�v���̃}�E�X�|�C���^�̈ʒu

	D.wipein(1�`4[,s])		D�����[�h1�`4��(s�b��)���C�v�C������
	D.wipeout(1�`4[,s])		D�����[�h1�`4��(s�b��)���C�v�A�E�g����
	D.slidein(1�`4[,s]) 	D�����[�h1�`4��(s�b��)�X���C�h�C������
	D.slideout(1�`4[,s])	D�����[�h1�`4��(s�b��)�X���C�h�A�E�g����
	D.slideBy(x,y)			D��(x,y)�����X���C�h����
	D.slideTo(x,y)			D��(x,y)�ɃX���C�h����

�v���O�����̗�(sample.htm):
	--- �������� ---
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
	--- �����܂� ---
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
if(is_nav5up)	DFrame.document.write("<SPAN>�@</SPAN>");

var droppedX, droppedY, DID=1;

var PRESETACTION="", PRESETTIME=0;
var DRAGABLE=new Array();

//timint()

function presetTimeout(action,t){PRESETACTION=action;	PRESETTIME=t}

function timint(){				// 10ms�^�C�}�[������
	var i,j,dx0,dy0,dl0,dl;
// �S�Ă�Obj�I�u�W�F�N�g�ɂ���
	for(j=i=0;i<DRAGABLE.length;i++) with(DRAGABLE[i]){
// ���݈ʒu(x,y)����ړI�ʒu(xd,yd)�܂�dx,dy��������(�X���C�h)
		dx0=xd-x;	dy0=yd-y;
		if(dx0!=0 || dy0!=0){
			dl0=Math.sqrt(dx0*dx0+dy0*dy0)
			dl=Math.sqrt(dx*dx+dy*dy)
			if(dl0<dl)	moveTo(xd,yd)
			else slideBy(Math.round(dx0*dx/dl0),Math.round(dy0*dy/dl0))
			j++;
		}else{
// ���݈ʒu(x1,y1)����ړI�ʒu(xd1,yd1)�܂�dx,dy��������(���C�v)
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
// ���݈ʒu(x2,y2)����ړI�ʒu(xd2,yd2)�܂�dx,dy��������(���C�v)
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
	if(j==0 && SNDSTATUS=="STOP"){	// �X���C�h�����C�v����������STOP
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
// that.ref��Drag����Obj�I�u�W�F�N�g
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
// Obj�I�u�W�F�N�g�̒�`
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
	d.ref=this;							// Obj�I�u�W�F�N�g
	this.bindlist=new Array();			// ���߂̓o�C���h����
// NN7(nav5)�͑傫�ȉ摜���X�N���[���\���������ꍇ��offsetWidth���������擾�ł��Ȃ��̂Œ���
	if(is_nav4){	   this.width=d.clip.width;	 this.height=d.clip.height;}
	else if(is_nav5up){this.width=d.offsetWidth; this.height=d.offsetHeight;}
	else if(is_ie4up){ this.width=d.clientWidth; this.height=d.clientHeight;}
	this.xd=this.x=x;					// x,xd�͌��݈ʒu�ƖړI�ʒu(�X���C�h)
	this.yd=this.y=y;					// y,yd�͌��݈ʒu�ƖړI�ʒu(�X���C�h)
	this.x1=this.xd1=0;					// x1,xd1��x�����_�Ƃ���ʒu(���C�v)
	this.y1=this.yd1=0;					// y1,yd1��x�����_�Ƃ���ʒu(���C�v)
	this.x2=this.xd2=this.width;		// x2,xd2��x�����_�Ƃ���ʒu(���C�v)
	this.y2=this.yd2=this.height;		// y2,yd2��x�����_�Ƃ���ʒu(���C�v)
	this.dx=this.dy=10;					// ���C�v/�X���C�h�̈ړ��ʂ̎b��l
	this.dragability=false;				// �f�t�H���g�̓h���b�O�s��
	this.visibility="show";				// �f�t�H���g�͌�����
	this.Z=true;						// �f�t�H���g��Z����ւ���
//----------------------------------------------------------------------
// �w�i�F��color�ɂ���
	this.bgColor=function(color){
		if(is_nav4) 					this.layer.bgColor=color;
		else if(is_nav5up || is_ie4up)	this.layer.style.backgroundColor=color;
	}
//----------------------------------------------------------------------
// �h���b�O�\�ɂ���
	this.dragable=function(){
		this.dragability=true;
		this.layer.onmousemove=Obj.mmove;
		this.layer.onmousedown=Obj.mdown;
	}
//----------------------------------------------------------------------
// �I�u�W�F�N�g��������
	this.show=function(){
		this.visibility="show";
		if(is_nav4)						d.visibility="show";
		else if(is_nav5up || is_ie4up)	d.style.visibility="visible";
	}
//----------------------------------------------------------------------
// �I�u�W�F�N�g���B��
	this.hide=function(){
		this.visibility="hidden";
		if(is_nav4)						d.visibility="hidden";
		else if(is_nav5up || is_ie4up)	d.style.visibility="hidden";
	}
//----------------------------------------------------------------------
// (x,y)�����_�Ƃ���(x1,y1),(x2,y2)�̋�`�ŃN���b�v����
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
// �h���b�O�͈̔͂�(x1,y1),(x2,y2)�ɐ�������
	this.bound=function(x1,y1,x2,y2){
		if(y2){				// �h���b�O����͈̔͂�(x1,y1),(x2,y2)�ɐ�������
			this.boundX1=x1; this.boundY1=y1; this.boundX2=x2; this.boundY2=y2;
		}else{				// �h���b�O����͈̔͂�t��ɐ�������
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
// �o�C���h����Ă��邷�ׂẴI�u�W�F�N�g���o�E���h����
		for(var i=0;i<this.bindlist.length;i++)	this.bindlist[i].moveBy(0,0,x1,y1,x2,y2);
	}
//----------------------------------------------------------------------
// �I�u�W�F�N�gb�̃o�C���h�ɒǉ�����
	this.bind=function(b){	b.bindlist[b.bindlist.length]=this;	}
//----------------------------------------------------------------------
// ���݈ʒu�ƖړI�ʒu��(x,y)�����ړ�����
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
// �o�C���h����Ă��邷�ׂẴI�u�W�F�N�g���ړ�����
		for(var i=0;i<this.bindlist.length;i++)	this.bindlist[i].moveBy(x,y,boundx1,boundy1,boundx2,boundy2);
	}
//----------------------------------------------------------------------
// ���݈ʒu�ƖړI�ʒu��(x,y)�ɂ���
	this.moveTo=function(x,y){
		if(is_nav4){		d.pageX=x;			d.pageY=y}
		else if(is_nav5up){	d.style.left=x;		d.style.top=y}
		else if(is_ie4up){	d.style.pixelLeft=x;d.style.pixelTop=y}
		this.xd=this.x=x;	this.yd=this.y=y	//position
	}
//----------------------------------------------------------------------
// �I�u�W�F�N�gt�̎��Ӌ��E��ɂ���Obj�I�u�W�F�N�g������܂��͊O���ɂ��炷
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
// (x,y)��Obj�I�u�W�F�N�g�̏�ɂ����true��Ԃ�
	this.inside=function(x,y){
		if(is_nav4)			return (this.visibility=="show" && x>d.pageX && y>d.pageY && x<d.pageX+d.clip.width && y<d.pageY+d.clip.height);
		else if(is_nav5up)	return (this.visibility=="show" && x>parseInt(d.style.left) && y>parseInt(d.style.top)&&x<parseInt(d.style.left)+d.offsetWidth&&y<parseInt(d.style.top)+d.offsetHeight);
		else if(is_ie4up)	return (this.visibility=="show" && x>d.style.pixelLeft && y>d.style.pixelTop&&x<d.style.pixelLeft+d.clientWidth&&y<d.style.pixelTop+d.clientHeight);
	}
//----------------------------------------------------------------------
// wipemode�ɉ����ă��C�v�C������
	this.wipein=function(wipemode,sec){
		this.visibility="show";
		if(is_nav4)						d.visibility="show";
		else if(is_nav5up || is_ie4up)	d.style.visibility="visible";
		if(!sec)	sec=1;
		this.dx=parseInt(this.width/sec/100);
		this.dy=parseInt(this.height/sec/100);
		if(wipemode==1){						// �����烏�C�v�C��
			this.x1=this.xd1=this.x2=0;	this.xd2=this.width;
			this.y1=this.yd1=0;	this.y2=this.yd2=this.height;
		}else if(wipemode==2){					// �E���烏�C�v�C��
			this.xd1=0;	this.x1=this.x2=this.xd2=this.width;
			this.y1=this.yd1=0;	this.y2=this.yd2=this.height;
		}else if(wipemode==3){					// �ォ�烏�C�v�C��
			this.x1=this.xd1=0;	this.x2=this.xd2=this.width;
			this.y1=this.yd1=this.y2=0;	this.yd2=this.height;
		}else if(wipemode==4){					// �����烏�C�v�C��
			this.x1=this.xd1=0;	this.x2=this.xd2=this.width;
			this.yd1=0;	this.y1=this.y2=this.yd2=this.height;
		}
		if(is_nav4){		d.pageX=this.x;			d.pageY=this.y;}
		else if(is_nav5up){	d.style.left=this.x;	d.style.top=this.y;}
		else if(is_ie4up){	d.style.pixelLeft=this.x;d.style.pixelTop=this.y;}
	}
//----------------------------------------------------------------------
// wipemode�ɉ����ă��C�v�A�E�g����
	this.wipeout=function(wipemode,sec){
		this.visibility="show";
		if(is_nav4)						d.visibility="show";
		else if(is_nav5up || is_ie4up)	d.style.visibility="visible";
		if(!sec)	sec=1;
		this.dx=parseInt(this.width/sec/100);
		this.dy=parseInt(this.height/sec/100);
		if(wipemode==1){						// �E�փ��C�v�A�E�g
			this.x1=this.x;
			this.xd1=this.x2=this.xd2=this.x+this.width;
			this.y1=this.yd1=this.y;
			this.y2=this.yd2=this.y+this.height;
		}else if(wipemode==2){					// ���փ��C�v�A�E�g
			this.x1=this.xd1=this.xd2=this.x;
			this.x2=this.x+this.width;
			this.y1=this.yd1=this.y;
			this.y2=this.yd2=this.y+this.height;
		}else if(wipemode==3){					// ���փ��C�v�A�E�g
			this.x1=this.xd1=this.x;
			this.x2=this.xd2=this.x+this.width;
			this.y1=this.y;
			this.yd1=this.y2=this.yd2=this.y+this.height;
		}else if(wipemode==4){					// ��փ��C�v�A�E�g
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
// slmode�ɉ����ăX���C�h�C������
	this.slidein=function(slmode,sec){
		this.visibility="show"
		if(is_nav4)						d.visibility="show"
		else if(is_nav5up || is_ie4up)	d.style.visibility="visible"
		if(!sec)	sec=1;
// �ړI�ʒuxd,yd�����݈ʒux,y�ɂ���
		this.xd=this.x;	this.yd=this.y
// ���݈ʒux,y��slmode�ɉ������ʒu�ɂ���
		if(slmode==1){							// ������X���C�h�C��
			this.dx=parseInt((this.x+this.width)/sec/100);
			this.x=-this.width
		}else if(slmode==2){					// �E����X���C�h�C��
			this.dx=parseInt((screen.width-this.x)/sec/100);
			this.x=screen.width
		}else if(slmode==3){					// �ォ��X���C�h�C��
			this.dy=parseInt((this.y+this.height)/sec/100);
			this.y=-this.height
		}else if(slmode==4){					// ���փX���C�h�C��
			this.dy=parseInt((screen.height-this.y)/sec/100);
			this.y=screen.height
		}
		if(is_nav4){		d.pageX=this.x;			d.pageY=this.y}
		else if(is_nav5up){	d.style.left=this.x;	d.style.top=this.y}
		else if(is_ie4up){	d.style.pixelLeft=this.x;d.style.pixelTop=this.y}
	}
//----------------------------------------------------------------------
// slmode�ɉ����ăX���C�h�A�E�g����
	this.slideout=function(slmode,sec){
		this.visibility="show"
		if(is_nav4)						d.visibility="show"
		else if(is_nav5up || is_ie4up)	d.style.visibility="visible"
		if(!sec)	sec=1;
// �ړI�ʒuxd,yd�����݈ʒux,y�ɂ���
		this.xd=this.x;	this.yd=this.y
// �ړI�ʒuxd,yd��slmode�ɉ������ʒu�ɒ�������
		if(slmode==1){							// ���փX���C�h�A�E�g
			this.dx=parseInt((this.x+this.width)/sec/100);
			this.xd=-this.width
		}else if(slmode==2){					// �E�փX���C�h�A�E�g
			this.dx=parseInt((screen.width-this.x)/sec/100);
			this.xd=screen.width
		}else if(slmode==3){					// ��փX���C�h�A�E�g
			this.dy=parseInt((this.y+this.height)/sec/100);
			this.yd=-this.height
		}else if(slmode==4){					// ���փX���C�h�A�E�g
			this.dy=parseInt((screen.height-this.y)/sec/100);
			this.yd=screen.height
		}
		if(is_nav4){		d.pageX=this.x;			d.pageY=this.y}
		else if(is_nav5up){	d.style.left=this.x;	d.style.top=this.y}
		else if(is_ie4up){	d.style.pixelLeft=this.x;d.style.pixelTop=this.y}
	}
//----------------------------------------------------------------------
// ���݈ʒu��x,y���炷
	this.slideBy=function(x,y){
		if(is_nav4){		d.pageX+=x;			d.pageY+=y}
		else if(is_nav5up){	d.style.left+=x;	d.style.top+=y}
		else if(is_ie4up){	d.style.pixelLeft+=x;d.style.pixelTop+=y}
		this.x+=x;	this.y+=y	//position
	}
//----------------------------------------------------------------------
// �ړI�ʒuxd,yd���Z�b�g����
	this.slideTo=function(x,y){this.xd=x;	this.yd=y}

	DRAGABLE[DRAGABLE.length]=this
}
