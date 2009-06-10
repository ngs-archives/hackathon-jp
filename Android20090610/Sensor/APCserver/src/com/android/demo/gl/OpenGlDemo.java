package com.android.demo.gl;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import com.android.demo.gl.common.GLDisplay;

public class OpenGlDemo  implements ActionListener {
	static GLDisplay neheGLDisplay = null;
	static OpenGlRender renderer = null;
	
	//when clicked on GUI button
	@Override
	public void actionPerformed(ActionEvent e) {
		startDemo();
	}
	
	public void startDemo()
	{
		if (neheGLDisplay == null){
			renderer = new OpenGlRender();
			neheGLDisplay = GLDisplay.createGLDisplay("Android sensor team");
			neheGLDisplay.addGLEventListener(renderer);
			neheGLDisplay.start();
		}
	}
	
	public static void setRotation(float x, float y, float z)
	{
		if (renderer != null)
		{
			renderer.setRotation(x, y, z);
		}
	}

}
