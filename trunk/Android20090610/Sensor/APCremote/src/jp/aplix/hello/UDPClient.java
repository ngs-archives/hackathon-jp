package jp.aplix.hello;

import java.io.*;
import java.net.*;

import android.util.Log;

class UDPClient
{
	DatagramSocket clientSocket;
	InetAddress IPAddress;
	int port;

	public UDPClient(String host, int port) throws Exception
	{
		clientSocket = new DatagramSocket();
		IPAddress = InetAddress.getByName(host);
		this.port = port;
	}

	public void send(String sentence) throws IOException
	{
		if (clientSocket != null)
		{
			byte[] sendData = new byte[1024];

			sendData = sentence.getBytes();
			DatagramPacket sendPacket = new DatagramPacket(sendData, sendData.length, IPAddress, this.port);
			clientSocket.send(sendPacket);
		}
		else
		{
			
		}
	}
	
	public void send(SensorData data) throws IOException
	{
		if (clientSocket != null)
		{
			//FIXME with serialized object on data
			byte[] sendData = null; 
			DatagramPacket sendPacket = new DatagramPacket(sendData, sendData.length, IPAddress, this.port);
			clientSocket.send(sendPacket);
		}
	}

	public String receive() throws IOException
	{
		if (clientSocket != null)
		{
			byte[] receiveData = new byte[1024];
			DatagramPacket receivePacket = new DatagramPacket(receiveData, receiveData.length);
			clientSocket.receive(receivePacket);
			String sentence = new String(receivePacket.getData());
			Log.i("CLIENT", "FROM SERVER:" + sentence);
			return sentence;
		}
		return null;
	}

	public void close()
	{
		if (clientSocket != null)
		{
			clientSocket.close();
		}
	}
}