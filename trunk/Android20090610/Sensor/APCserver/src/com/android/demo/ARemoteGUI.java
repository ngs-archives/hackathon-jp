package com.android.demo;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.Image;

import javax.swing.ImageIcon;

import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;

import javax.swing.WindowConstants;
import javax.swing.SwingUtilities;

import com.android.demo.gl.OpenGlDemo;



/**
* This code was edited or generated using CloudGarden's Jigloo
* SWT/Swing GUI Builder, which is free for non-commercial
* use. If Jigloo is being used commercially (ie, by a corporation,
* company or business for any purpose whatever) then you
* should purchase a license for each developer using Jigloo.
* Please visit www.cloudgarden.com for details.
* Use of Jigloo implies acceptance of these licensing terms.
* A COMMERCIAL LICENSE HAS NOT BEEN PURCHASED FOR
* THIS MACHINE, SO JIGLOO OR THIS CODE CANNOT BE USED
* LEGALLY FOR ANY CORPORATE OR COMMERCIAL PURPOSE.
*/
public class ARemoteGUI extends javax.swing.JFrame {

	{
		//Set Look & Feel
		try {
			javax.swing.UIManager.setLookAndFeel("com.jgoodies.looks.plastic.PlasticXPLookAndFeel");
		} catch(Exception e) {
			e.printStackTrace();
		}
	}

	private JTabbedPane jTabbedPane1;
	private JPanel connectionPanel;
	private JPanel keyboardPanel;
	private JScrollPane jScrollPane1;
	private JButton demoOpenGlButton;
	private JButton robotTestButton;
	private JTextField portField;
	private JLabel loginLabel;
	private JLabel passwordLabel;
	private JLabel portLabel;
	private JPasswordField passwordField;
	private JButton connectButton;
	private JTextArea connectionLog;
	private JTextField name;
	private JPanel logsPanel;

	/**
	* Auto-generated main method to display this JFrame
	*/
	public static void main(String[] args) {
		SwingUtilities.invokeLater(new Runnable() {
			public void run() {
				ARemoteGUI inst = new ARemoteGUI();
				inst.setLocationRelativeTo(null);
				inst.setVisible(true);
			}
		});
	}
	
	public ARemoteGUI() {
		super();
		initGUI();
	}
	
	private void initGUI() {
		try {
			setDefaultCloseOperation(WindowConstants.DISPOSE_ON_CLOSE);
			this.setTitle("APCremote server");
			this.setIconImage(new ImageIcon(getClass().getClassLoader().getResource("rsc/drawable/android_smallIcon.png")).getImage());
			{
				jTabbedPane1 = new JTabbedPane();
				getContentPane().add(jTabbedPane1, BorderLayout.CENTER);
				{
				connectionPanel = new JPanel();
					jTabbedPane1.addTab("Connections", null, connectionPanel, null);
					{
						loginLabel = new JLabel();
						connectionPanel.add(loginLabel);
						loginLabel.setText("Login");
					}
					{
						name = new JTextField();
						connectionPanel.add(name);
						name.setText("name");
						name.setPreferredSize(new java.awt.Dimension(126, 20));
					}
					{
						passwordLabel = new JLabel();
						connectionPanel.add(passwordLabel);
						passwordLabel.setText("Password");
					}
					{
						passwordField = new JPasswordField();
						connectionPanel.add(passwordField);
						passwordField.setText("password");
					}
					{
						connectButton = new JButton();
						connectionPanel.add(connectButton);
						connectButton.addActionListener(new UDPServer(this));
						connectButton.setText("Start Listening");
						connectButton.setActionCommand("Start Listening");
						connectButton.setPreferredSize(new java.awt.Dimension(228, 24));
					}
					{
						portLabel = new JLabel();
						connectionPanel.add(portLabel);
						portLabel.setText("Port");
					}
					{
						portField = new JTextField();
						connectionPanel.add(portField);
						portField.setText("9842");
						portField.setPreferredSize(new java.awt.Dimension(41, 23));
					}
					{
						jScrollPane1 = new JScrollPane();
						connectionPanel.add(jScrollPane1);
						jScrollPane1.setPreferredSize(new java.awt.Dimension(379, 178));
						jScrollPane1.setAutoscrolls(true);
						{
							connectionLog = new JTextArea();
							jScrollPane1.setViewportView(connectionLog);
						}
					}
				}
				{
					keyboardPanel = new JPanel();
					jTabbedPane1.addTab("Keyboard & mouse", null, keyboardPanel, null);
					{
						robotTestButton = new JButton();
						keyboardPanel.add(robotTestButton);
						robotTestButton.setText("Test robot");
						robotTestButton.addActionListener(new MKRobot());
					}
				}
				{
					logsPanel = new JPanel();
					jTabbedPane1.addTab("3D", null, logsPanel, null);
					{
						demoOpenGlButton = new JButton();
						logsPanel.add(demoOpenGlButton);
						demoOpenGlButton.setText("Start opengl demo");
						demoOpenGlButton.addActionListener(new OpenGlDemo());
					}
				}
			}
			pack();
			setSize(400, 300);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	
	public int getPort()
	{
		String s = null;
		try {
		s = portField.getText();
		} catch (NullPointerException nu)
		{
		}
		
		if (s != null)
		{
			int port = -1;
			try {
			port = Integer.parseInt(s);
			} catch (NumberFormatException nfe)
			{	
			}
			
			if ((port >= 0) && (port <= 65534))
			{
				return port;
			}
			Log("Port "+port+ " is invalid");
		}
		JOptionPane.showMessageDialog(this, "Please specify a valid port", "Invalid port", JOptionPane.INFORMATION_MESSAGE);
		return -1;
	}
	
	public void Log(String s)
	{
		if (s != null)
		{
			if (s.endsWith("\n"))
			{
				connectionLog.append(s);
			}
			else
			{
				connectionLog.append(s+"\n");
			}
			connectionLog.setCaretPosition(connectionLog.getText().length());
		}
	}
}
