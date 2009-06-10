package com.android.demo;

import java.awt.AWTException;
import java.awt.BorderLayout;
import java.awt.Point;
import java.awt.Robot;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.InputEvent;
import java.awt.event.KeyEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

import javax.swing.BorderFactory;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;


public class MKRobot implements ActionListener {

	private JFrame loginScreen = null;
	private JTextField textField = null;
	private JTextArea messageArea = null;

	public MKRobot()
	{
		loginScreen = creatFrame();
		loginScreen.setVisible(false);
	}

	@Override
	public void actionPerformed(ActionEvent e) {
		MyRobot robot = new MyRobot();
		robot.start();
	}

	public JFrame creatFrame()
	{
		JFrame frame = new JFrame();
		frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
		frame.setTitle("Robot Class Demo");

		JPanel contentPane = (JPanel)frame.getContentPane();
		contentPane.setLayout(new BorderLayout(10,10));

		contentPane.add(createTextField(), BorderLayout.NORTH);

		contentPane.add(createStatusArea(), BorderLayout.CENTER);

		contentPane.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
		frame.setSize(600,500);

		// Center the JFrame in the screen
		frame.setLocationRelativeTo(null);

		return frame;

	}

	private JTextField createTextField()
	{
		textField = new JTextField(30);
		textField.setToolTipText("This is a JTextField");
		textField.addMouseListener(new MouseAdapter()
		{
			public void mouseEntered(MouseEvent e)
			{
				messageArea.append("\t--> Mouse Entered. Do you see tool tip?\n");
			}
			public void mouseExited(MouseEvent e)
			{
				messageArea.append("\t--> Mouse Exited. Tool tip disappeared?\n");
			}
			public void mouseClicked(MouseEvent e)
			{
				messageArea.append("\t--> Mouse " + getMouseButton(e.getButton()) + " Clicked.\n");

			}
			public void mousePressed(MouseEvent e)
			{
				messageArea.append("\t--> Mouse " + getMouseButton(e.getButton()) + " Pressed.\n");
			}
			public void mouseReleased(MouseEvent e)
			{
				messageArea.append("\t--> Mouse " + getMouseButton(e.getButton()) + " Released.\n");
			}
		});
		return textField;
	}

	private String getMouseButton(int button)
	{
		String buttonText;

		switch(button)
		{
		case MouseEvent.BUTTON1:
			buttonText = "Button 1";
			break;

		case MouseEvent.BUTTON2:
			buttonText = "Button 2";
			break;

		case MouseEvent.BUTTON3:
			buttonText = "Button 3";
			break;

		default:
			buttonText = "Unknown Button";
		}
		return buttonText;

	}

	private JScrollPane createStatusArea()
	{
		messageArea = new JTextArea();
		JScrollPane scrollPane = new JScrollPane(messageArea);
		textField.setToolTipText("This is a JTextArea");

		return scrollPane;
	}
	
	private class MyRobot extends Thread
	{
		@Override
		public void run()
		{
			loginScreen.setVisible(true);

			try
			{
				Robot robot = new Robot();

				messageArea.append("In 5 seconds the Mouse will move over the Text Field...\n");
				robot.delay(5000);
				Point locOnScreen = textField.getLocationOnScreen();
				robot.mouseMove(locOnScreen.x, locOnScreen.y);
				robot.delay(1000);
				messageArea.append("In 5 seconds the Mouse will move to the top left corner of the screen...\n");
				robot.delay(5000);
				robot.mouseMove(0, 0);

				robot.delay(1000);
				messageArea.append("In 5 seconds the Mouse will move over the Text Field and perform a LEFT click...\n");
				robot.delay(5000);
				locOnScreen = textField.getLocationOnScreen();
				robot.mouseMove(locOnScreen.x, locOnScreen.y);
				robot.mousePress(InputEvent.BUTTON1_MASK);
				robot.delay(1000);
				robot.mouseRelease(InputEvent.BUTTON1_MASK);

				robot.delay(1000);
				messageArea.append("In 5 seconds the Mouse will perform a RIGHT click...\n");
				robot.delay(5000);
				robot.mousePress(InputEvent.BUTTON2_MASK);
				robot.delay(1000);
				robot.mouseRelease(InputEvent.BUTTON2_MASK);

				robot.delay(1000);
				messageArea.append("In 5 seconds the word 'demo:' will be typed...\n");
				robot.delay(5000);

				robot.keyPress(KeyEvent.VK_D);
				robot.keyRelease(KeyEvent.VK_D);

				robot.keyPress(KeyEvent.VK_E);
				robot.keyRelease(KeyEvent.VK_E);

				robot.keyPress(KeyEvent.VK_M);
				robot.keyRelease(KeyEvent.VK_M);

				robot.keyPress(KeyEvent.VK_O);
				robot.keyRelease(KeyEvent.VK_O);

				robot.keyPress(KeyEvent.VK_SHIFT);
				robot.keyPress(KeyEvent.VK_SEMICOLON);
				robot.keyRelease(KeyEvent.VK_SEMICOLON);
				robot.keyRelease(KeyEvent.VK_SHIFT);

				robot.delay(1000);
				messageArea.append("End of demo\n");
			}
			catch (AWTException exception)
			{
				String errorString = "Platform configuration does not allow low-level input control. Exiting the demo in 5 seconds.";
				System.err.println(errorString);
				messageArea.append(errorString);

				try
				{
					Thread.sleep(5000);
				}
				catch (InterruptedException e) {/* Do nothing */}
				System.exit(1);
			}
		}
	}
	
}
