package com.android.demo.gl;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import com.android.demo.gl.common.GLDisplay;

public class OpenGlDemo  implements ActionListener {

	//when clicked on GUI button
	@Override
	public void actionPerformed(ActionEvent e) {
		startDemo();
	}
	
	public void startDemo()
	{
		GLDisplay neheGLDisplay = GLDisplay.createGLDisplay("Lesson 04: Rotation");
		neheGLDisplay.addGLEventListener(new OpenGlRender());
		neheGLDisplay.start();
	}

}
