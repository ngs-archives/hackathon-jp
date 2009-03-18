package hacathon.android.travel.util;

public class UrlParameter {

    private String key;

    private String[] values = {};

    public final String getKey() {
        return key;
    }

    public final void setKey(final String key) {
        this.key = key;
    }

    public final String getValue() {
        if (ArrayUtil.isEmpty(values)) {
            return "";
        }
        return values[0];
    }

    public final void setValue(final String value) {
        values = new String[] { value };
    }

    public final void addValue(final String value) {
        this.values = (String[]) ArrayUtil.add(this.values, value);
    }

    public final String[] getValues() {
        return values;
    }

    public final void setValues(final String[] values) {
        this.values = values;
    }
}
