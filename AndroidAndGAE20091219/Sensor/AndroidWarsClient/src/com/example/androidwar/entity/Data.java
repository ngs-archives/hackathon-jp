package com.example.androidwar.entity;

public class Data {

	private int action;
	private String name;
	private Point value;

	class Point {
		private int x;
		private int y;
	}

	public Data(int action, String name, Point value) {
		super();
		this.action = action;
		this.name = name;
		this.value = value;
	}

	public int getAction() {
		return action;
	}

	public void setAction(int action) {
		this.action = action;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Point getValue() {
		return value;
	}

	public void setValue(Point value) {
		this.value = value;
	}
}
