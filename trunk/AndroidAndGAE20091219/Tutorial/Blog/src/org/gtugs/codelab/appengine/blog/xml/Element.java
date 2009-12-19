package org.gtugs.codelab.appengine.blog.xml;

import java.util.ArrayList;
import java.util.List;

public class Element {
	public String name;
	public String content;
	List<Element> children = new ArrayList<Element>();
	Element parent = null;

	public Element(String name) {
		this(name, null);
	}
	
	public Element(String name, String content) {
		this.name = name;
		this.content = content;
	}
	
	private void setParent(Element parent) {
		this.parent = parent;
	}
	
	public void add(Element child) {
		child.setParent(this);
		children.add(child);
	}

	public String toXML() {
		StringBuilder strbuilder = new StringBuilder();
		if (parent == null) {
			strbuilder.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
		}
		strbuilder.append("<"+name+">");
		if (content != null) {
			content.replaceAll("<", "&lt;");
			content.replaceAll(">", "&gt;");
			content.replaceAll("&", "&amp;");
			strbuilder.append(content);
		} else {
			for (Element e : children) {
				strbuilder.append(e.toXML());
			}
		}
		strbuilder.append("</"+name+">");
		return strbuilder.toString();
	}
	
}
