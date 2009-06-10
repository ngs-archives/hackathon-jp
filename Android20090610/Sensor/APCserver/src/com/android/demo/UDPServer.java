package com.android.demo;

import java.awt.AWTException;
import java.awt.MouseInfo;
import java.awt.Point;
import java.awt.PointerInfo;
import java.awt.Robot;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.*;
import java.net.*;

import javax.swing.JButton;

class UDPServer implements ActionListener
{
	private ReceiverThread rThread;
	private ARemoteGUI remoteGUI;
	private String hostname;
	
	SensorData sensorData;
	Robot      robot;
	PointerInfo pointerInfo;
	Point point;

	public UDPServer(ARemoteGUI remoteGUI) {
		this.remoteGUI = remoteGUI;
		
		sensorData = new SensorData();
		try {
			robot = new Robot();
		} catch (AWTException e1) {
			e1.printStackTrace();
		}
		
		//get the ip adress for log purpose
		try {
	        InetAddress addr = InetAddress.getLocalHost();
	        hostname = addr.getHostAddress();
	    } catch (UnknownHostException e) {
	    	remoteGUI.Log("Unknown host :" +e.getMessage());
	    }

	}



	@Override
	protected void finalize() throws Throwable {
		if (rThread != null)
		{
			rThread.stopListening();
		}
		super.finalize();
	}



	@Override
	public void actionPerformed(ActionEvent e) {
		String actionCmd = e.getActionCommand();
		JButton button = (JButton) e.getSource();

		if ("Start Listening".equalsIgnoreCase(actionCmd))
		{
			int port = remoteGUI.getPort();
			if (port != -1)
			{
				button.setText("Stop Listening");
				button.setActionCommand("Stop Listening");
				if (rThread == null)
				{
					rThread = new ReceiverThread(port);
					rThread.start();
				}
				else
				{
					rThread.stopListening();
					rThread = new ReceiverThread(port);
					rThread.start();
				}
			}
		} 
		else
		{
			button.setText("Start Listening");
			button.setActionCommand("Start Listening");
			if (rThread != null)
			{
				rThread.stopListening();
				rThread = null;
			}
		}
	}
	
	private class ReceiverThread extends Thread
	{
		private boolean listen;
		private int port;

		public ReceiverThread(int port)
		{
			listen = true;
			this.port = port;
		}

		public void stopListening()
		{
			listen = false;
		}

		public void run()
		{
			DatagramSocket serverSocket = null;
			try {
				serverSocket = new DatagramSocket(port);
				serverSocket.setSoTimeout(500);
			} catch (SocketException e) {
				remoteGUI.Log(e.toString());
			}

			remoteGUI.Log("Start Listening on "+hostname+":"+port);

			byte[] receiveData = new byte[1024];
			//byte[] sendData = new byte[1024];
			while ((listen) && (serverSocket != null))
			{
				DatagramPacket receivePacket = new DatagramPacket(receiveData, receiveData.length);

				try {
					serverSocket.receive(receivePacket);
				} catch (SocketTimeoutException to) {
					continue;
				} catch (IOException e) {
					remoteGUI.Log(e.toString());
				} 

				// get point location
				pointerInfo = MouseInfo.getPointerInfo();
				point = pointerInfo.getLocation();

				// move mouse location
				robot.mouseMove(point.x + 150, point.y + 50);
				
				//remove this afterward
				//String sentence = new String( receivePacket.getData());
				//remoteGUI.Log("RECEIVED: " + sentence);

				//set SensorData
				PackManager.deserialize(sensorData, receivePacket.getData());
				//setRotation(sensorData.getX(),sensorData.getY(), sensorData.getZ());
				//remoteGUI.Log("RECEIVED: " + sensorData.toString());
				
				/* sending response is not necessary
				InetAddress IPAddress = receivePacket.getAddress();
				int port = receivePacket.getPort();
				String capitalizedSentence = sentence.toUpperCase();
				sendData = capitalizedSentence.getBytes();
				DatagramPacket sendPacket = new DatagramPacket(sendData, sendData.length, IPAddress, port);

				try {
					serverSocket.send(sendPacket);
				} catch (IOException e) {
					remoteGUI.Log(e.toString());
				}*/
			}
			if (serverSocket != null)
			{
				remoteGUI.Log("Closing server");
				serverSocket.close();
			}
		}
	}
}
