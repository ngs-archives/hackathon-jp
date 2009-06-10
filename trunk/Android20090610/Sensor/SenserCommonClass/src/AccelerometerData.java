/**
 *  All values are in SI units (m/s^2) and measure the acceleration applied to the phone minus the force of gravity.
 *  values[0]: Acceleration minus Gx on the x-axis
 *  values[1]: Acceleration minus Gy on the y-axis
 *  values[2]: Acceleration minus Gz on the z-axis 
 */
public class AccelerometerData {

	private float gx;
	private float gy;
	private float gz;
	
	public float getGx() {
		return gx;
	}
	public void setGx(float gx) {
		this.gx = gx;
	}
	public float getGy() {
		return gy;
	}
	public void setGy(float gy) {
		this.gy = gy;
	}
	public float getGz() {
		return gz;
	}
	public void setGz(float gz) {
		this.gz = gz;
	}
	public AccelerometerData(float gx, float gy, float gz) {
		super();
		this.gx = gx;
		this.gy = gy;
		this.gz = gz;
	}
}

