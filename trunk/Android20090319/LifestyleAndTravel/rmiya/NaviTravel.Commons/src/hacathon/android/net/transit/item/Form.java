package hacathon.android.net.transit.item;

import java.io.Serializable;

public class Form implements Serializable {

    private static final long serialVersionUID = 1L;

    public String selected;

    //public String[] q;

    public final L l = new L();

    public final D d = new D();

    public String geocode;

    public final G g = new G();
}
