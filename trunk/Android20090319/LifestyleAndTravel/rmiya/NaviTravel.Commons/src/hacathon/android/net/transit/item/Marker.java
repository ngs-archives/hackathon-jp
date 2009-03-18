package hacathon.android.net.transit.item;

import java.io.Serializable;

public class Marker implements Serializable {

    private static final long serialVersionUID = 1L;

    public String id;

    public String image;

    public boolean drg;

    //public Object infoWindow;

    public String geocode;

    public GLatLng latlng;
}
