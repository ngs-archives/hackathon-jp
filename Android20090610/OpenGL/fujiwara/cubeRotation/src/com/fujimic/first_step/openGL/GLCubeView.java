package com.fujimic.first_step.openGL;

import java.nio.*;
import javax.microedition.khronos.opengles.*;
import android.content.*;
import android.opengl.*;
import edu.union.GLTutorialBase;


public class GLCubeView extends GLTutorialBase {
    float box[]=new float[] {
            //�O��
            -0.5f, -0.5f,  0.5f,
             0.5f, -0.5f,  0.5f,
            -0.5f,  0.5f,  0.5f,
             0.5f,  0.5f,  0.5f,
            //�w��
            -0.5f, -0.5f, -0.5f,
            -0.5f,  0.5f, -0.5f,
             0.5f, -0.5f, -0.5f,
             0.5f,  0.5f, -0.5f,
            //����
            -0.5f, -0.5f,  0.5f,
            -0.5f,  0.5f,  0.5f,
            -0.5f, -0.5f, -0.5f,
            -0.5f,  0.5f, -0.5f,
            //�E��
             0.5f, -0.5f, -0.5f,
             0.5f,  0.5f, -0.5f,
             0.5f, -0.5f,  0.5f,
             0.5f,  0.5f,  0.5f,
            //���
            -0.5f,  0.5f,  0.5f,
             0.5f,  0.5f,  0.5f,
             -0.5f,  0.5f, -0.5f,
             0.5f,  0.5f, -0.5f,
            //����
            -0.5f, -0.5f,  0.5f,
            -0.5f, -0.5f, -0.5f,
             0.5f, -0.5f,  0.5f,
             0.5f, -0.5f, -0.5f,
        };

    FloatBuffer cubeBuff;//���_���W�o�b�t�@
    
    float xrot=0.0f;//X����]��
    float yrot=0.0f;//Y����]��
    
    //�R���X�g���N�^
    public GLCubeView(Context c) {
        super(c,20);
        
        //�o�b�t�@�̐���
        cubeBuff=makeFloatBuffer(box);
    }
        
    //������
    protected void init(GL10 gl) {
        //�w�ʓh��ׂ��F�̎w��
        gl.glClearColor(0.0f,0.0f,0.0f,1.0f);
        
        //�f�v�X�o�b�t�@
        gl.glEnable(GL10.GL_DEPTH_TEST);
        gl.glEnable(GL10.GL_CULL_FACE);
        gl.glDepthFunc(GL10.GL_LEQUAL);
        gl.glClearDepthf(1.0f);
        
        //�V�F�[�f�B���O
        gl.glShadeModel(GL10.GL_SMOOTH);
    }
    
    //�`��
    protected void drawFrame(GL10 gl) {
        //�w�ʓh��ׂ�
        gl.glClear(GL10.GL_COLOR_BUFFER_BIT|GL10.GL_DEPTH_BUFFER_BIT);
        
        //���f���r���[�s��̎w��
        gl.glMatrixMode(GL10.GL_MODELVIEW);
        gl.glLoadIdentity();
        GLU.gluLookAt(gl,0,0,3,0,0,0,0,1,0);
    
        //���_�z��̎w��
        gl.glVertexPointer(3,GL10.GL_FLOAT,0,cubeBuff);
        gl.glEnableClientState(GL10.GL_VERTEX_ARRAY);
    
        //��]�̎w��
        gl.glRotatef(xrot,1,0,0);
        gl.glRotatef(yrot,0,1,0);
    
        //�O�ʂƔw�ʂ̃v���~�e�B�u�̕`��
        gl.glColor4f(1.0f,0,0,1.0f);
        gl.glDrawArrays(GL10.GL_TRIANGLE_STRIP,0,4);
        gl.glDrawArrays(GL10.GL_TRIANGLE_STRIP,4,4);
    
        //���ʂƉE�ʂ̃v���~�e�B�u�̕`��
        gl.glColor4f(0,1.0f,0,1.0f);
        gl.glDrawArrays(GL10.GL_TRIANGLE_STRIP,8,4);
        gl.glDrawArrays(GL10.GL_TRIANGLE_STRIP,12,4);
        
        //��ʂƉ��ʂ̃v���~�e�B�u�̕`��
        gl.glColor4f(0,0,1.0f,1.0f);
        gl.glDrawArrays(GL10.GL_TRIANGLE_STRIP,16,4);
        gl.glDrawArrays(GL10.GL_TRIANGLE_STRIP,20,4);
    
        //��]
//        xrot+=1.0f;
//        yrot+=0.5f;
    }
}


