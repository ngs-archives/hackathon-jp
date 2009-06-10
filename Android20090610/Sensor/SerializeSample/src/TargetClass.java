import java.io.Serializable;


public class TargetClass implements Serializable {

	private float x;
	private float y;
	private float z;
	@Override
	public String toString() {
		return "x:" + this.x + " y:" + this.y + " z:" + this.z;
	}
	public float getX() {
		return x;
	}
	public void setX(float x) {
		this.x = x;
	}
	public float getY() {
		return y;
	}
	public void setY(float y) {
		this.y = y;
	}
	public float getZ() {
		return z;
	}
	public void setZ(float z) {
		this.z = z;
	}
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;


}
