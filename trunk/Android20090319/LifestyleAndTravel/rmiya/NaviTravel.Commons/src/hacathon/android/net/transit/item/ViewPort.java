package hacathon.android.net.transit.item;

import java.io.Serializable;

public class ViewPort implements Serializable {

    private static final long serialVersionUID = 1L;

    public GLatLng center;

    public GLatLng span;

    public String maptype;
}
