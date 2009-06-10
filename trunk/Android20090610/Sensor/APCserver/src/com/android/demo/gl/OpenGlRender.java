package com.android.demo.gl;

import com.android.demo.gl.common.TextureReader;
import javax.media.opengl.GL;
import javax.media.opengl.GLAutoDrawable;
import javax.media.opengl.GLEventListener;
import javax.media.opengl.glu.GLU;

import java.io.IOException;

class OpenGlRender implements GLEventListener {
    private float xrot;				// X Rotation ( NEW )
    private float yrot;				// Y Rotation ( NEW )
    private float zrot;				// Z Rotation ( NEW )
    private int texture;
    private int texture2;

    private GLU glu = new GLU();

    private final float unit = 1.0f;
    private final float unit2 = 1.5f;
    private final float unit3 = 0.15f;
    
    /** Called by the drawable to initiate OpenGL rendering by the client.
     * After all GLEventListeners have been notified of a display event, the
     * drawable will swap its buffers if necessary.
     * @param gLDrawable The GLAutoDrawable object.
     */
    public void display(GLAutoDrawable gLDrawable) {
        final GL gl = gLDrawable.getGL();
        gl.glClear(GL.GL_COLOR_BUFFER_BIT | GL.GL_DEPTH_BUFFER_BIT);
        gl.glLoadIdentity();									// Reset The View
        gl.glTranslatef(0.0f, 0.0f, -5.0f);

        gl.glRotatef(xrot, 1.0f, 0.0f, 0.0f);
        gl.glRotatef(yrot, 0.0f, 1.0f, 0.0f);
        gl.glRotatef(zrot, 0.0f, 0.0f, 1.0f);

        gl.glBindTexture(GL.GL_TEXTURE_2D, texture);
        gl.glBegin(GL.GL_QUADS);
        // Front Face
        gl.glTexCoord2f(0.0f, 0.0f);
        gl.glVertex3f(-unit, -unit2, unit3);
        gl.glTexCoord2f(unit, 0.0f);
        gl.glVertex3f(unit, -unit2, unit3);
        gl.glTexCoord2f(unit, unit);
        gl.glVertex3f(unit, unit2, unit3);
        gl.glTexCoord2f(0.0f, unit);
        gl.glVertex3f(-unit, unit2, unit3);
        gl.glEnd();
        
        gl.glBindTexture(GL.GL_TEXTURE_2D+1, texture2);
        gl.glBegin(GL.GL_QUADS);
        // Back Face
        gl.glTexCoord2f(unit, 0.0f);
        gl.glVertex3f(-unit, -unit2, -unit3);
        gl.glTexCoord2f(unit, unit);
        gl.glVertex3f(-unit, unit2, -unit3);
        gl.glTexCoord2f(0.0f, unit);
        gl.glVertex3f(unit, unit2, -unit3);
        gl.glTexCoord2f(0.0f, 0.0f);
        gl.glVertex3f(unit, -unit2, -unit3);
        // Top Face
        gl.glVertex3f(-unit, unit2, -unit3);
        gl.glVertex3f(-unit, unit2, unit3);
        gl.glVertex3f(unit, unit2, unit3);
        gl.glVertex3f(unit, unit2, -unit3);
        // Bottom Face
        gl.glVertex3f(-unit, -unit2, -unit3);
        gl.glVertex3f(unit, -unit2, -unit3);
        gl.glVertex3f(unit, -unit2, unit3);
        gl.glVertex3f(-unit, -unit2, unit3);
        // Right face
        gl.glVertex3f(unit, -unit2, -unit3);
        gl.glVertex3f(unit, unit2, -unit3);
        gl.glVertex3f(unit, unit2, unit3);
        gl.glVertex3f(unit, -unit2, unit3);
        // Left Face
        gl.glVertex3f(-unit, -unit2, -unit3);
        gl.glVertex3f(-unit, -unit2, unit3);
        gl.glVertex3f(-unit, unit2, unit3);
        gl.glVertex3f(-unit, unit2, -unit3);
        gl.glEnd();

        //xrot += 0.3f;
        //yrot += 0.2f;
        //zrot += 0.4f;
    }

    public void setRotation(float x , float y , float z)
    {
    	 xrot = x;
         yrot = y;
         zrot = z;
    }
    

    /** Called when the display mode has been changed.  <B>!! CURRENTLY UNIMPLEMENTED IN JOGL !!</B>
     * @param gLDrawable The GLAutoDrawable object.
     * @param modeChanged Indicates if the video mode has changed.
     * @param deviceChanged Indicates if the video device has changed.
     */
    public void displayChanged(GLAutoDrawable gLDrawable, boolean modeChanged, boolean deviceChanged) {
    }

    /** Called by the drawable immediately after the OpenGL context is
     * initialized for the first time. Can be used to perform one-time OpenGL
     * initialization such as setup of lights and display lists.
     * @param gLDrawable The GLAutoDrawable object.
     */
    public void init(GLAutoDrawable gLDrawable) {
        final GL gl = gLDrawable.getGL();
        gl.glShadeModel(GL.GL_SMOOTH);              // Enable Smooth Shading
        gl.glClearColor(0.0f, 0.0f, 0.0f, 0.5f);    // Black Background
        gl.glClearDepth(1.0f);                      // Depth Buffer Setup
        gl.glEnable(GL.GL_DEPTH_TEST);							// Enables Depth Testing
        gl.glDepthFunc(GL.GL_LEQUAL);								// The Type Of Depth Testing To Do
        gl.glHint(GL.GL_PERSPECTIVE_CORRECTION_HINT, GL.GL_NICEST);	// Really Nice Perspective Calculations
        gl.glEnable(GL.GL_TEXTURE_2D);
        texture = genTexture(gl);
        gl.glBindTexture(GL.GL_TEXTURE_2D, texture);
        TextureReader.Texture texturetmp = null;
        try {
        	texturetmp = TextureReader.readTexture("rsc/drawable/android_icon_125.bmp");
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        makeRGBTexture(gl, glu, texturetmp, GL.GL_TEXTURE_2D, false);
        gl.glTexParameteri(GL.GL_TEXTURE_2D, GL.GL_TEXTURE_MIN_FILTER, GL.GL_LINEAR);
        gl.glTexParameteri(GL.GL_TEXTURE_2D, GL.GL_TEXTURE_MAG_FILTER, GL.GL_LINEAR);
        
        texture2 = genTexture(gl);
        gl.glBindTexture(GL.GL_TEXTURE_2D+1, texture2);
        TextureReader.Texture texturetmp2 = null;
        try {
        	texturetmp2 = TextureReader.readTexture("rsc/drawable/android_icon_125R.bmp");
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        makeRGBTexture(gl, glu, texturetmp2, GL.GL_TEXTURE_2D+1, false);
        
        gl.glTexParameteri(GL.GL_TEXTURE_2D+1, GL.GL_TEXTURE_MIN_FILTER, GL.GL_LINEAR);
        gl.glTexParameteri(GL.GL_TEXTURE_2D+1, GL.GL_TEXTURE_MAG_FILTER, GL.GL_LINEAR);
    }

    /** Called by the drawable during the first repaint after the component has
     * been resized. The client can update the viewport and view volume of the
     * window appropriately, for example by a call to
     * GL.glViewport(int, int, int, int); note that for convenience the component
     * has already called GL.glViewport(int, int, int, int)(x, y, width, height)
     * when this method is called, so the client may not have to do anything in
     * this method.
     * @param gLDrawable The GLAutoDrawable object.
     * @param x The X Coordinate of the viewport rectangle.
     * @param y The Y coordinate of the viewport rectanble.
     * @param width The new width of the window.
     * @param height The new height of the window.
     */
    public void reshape(GLAutoDrawable gLDrawable, int x, int y, int width, int height) {
        final GL gl = gLDrawable.getGL();

        if (height <= 0) // avoid a divide by zero error!
            height = 1;
        final float h = (float) width / (float) height;
        gl.glViewport(0, 0, width, height);
        gl.glMatrixMode(GL.GL_PROJECTION);
        gl.glLoadIdentity();
        glu.gluPerspective(45.0f, h, 1.0, 20.0);
        gl.glMatrixMode(GL.GL_MODELVIEW);
        gl.glLoadIdentity();
    }

    private void makeRGBTexture(GL gl, GLU glu, TextureReader.Texture img, int target, boolean mipmapped) {
        if (mipmapped) {
            glu.gluBuild2DMipmaps(target, GL.GL_RGB8, img.getWidth(), img.getHeight(), GL.GL_RGB, GL.GL_UNSIGNED_BYTE, img.getPixels());
        } else {
            gl.glTexImage2D(target, 0, GL.GL_RGB, img.getWidth(), img.getHeight(), 0, GL.GL_RGB, GL.GL_UNSIGNED_BYTE, img.getPixels());
        }
    }

    private int genTexture(GL gl) {
        final int[] tmp = new int[1];
        gl.glGenTextures(1, tmp, 0);
        return tmp[0];
    }
}

