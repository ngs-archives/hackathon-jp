package com.android.lifestyleandtravel.net.transit.item;

import java.io.Serializable;

public class Maps implements Serializable {

    private static final long serialVersionUID = 1L;

    public String title;

    public String vartitle;

    public String url;

    public boolean urlViewport;

    public String ei;

    public Form form;

    public Query query;

    public ViewPort viewport;

    public Overlays overlays;

    public Transit transit;

    public TimeFormat timeformat;
}
