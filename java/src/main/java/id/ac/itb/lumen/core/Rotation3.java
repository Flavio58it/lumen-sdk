package id.ac.itb.lumen.core;

/**
 * Created by Sigit on 23/04/2015.
 * @todo Maybe should use object from OpenCV, etc.
 */
public class Rotation3 {
    private Double pitchCcwDeg;
    private Double yawCcwDeg;
    private Double rollCcwDeg;

    public Rotation3() {
    }

    public Rotation3(Double pitchCcwDeg, Double yawCcwDeg, Double rollCcwDeg) {
        this.pitchCcwDeg = pitchCcwDeg;
        this.yawCcwDeg = yawCcwDeg;
        this.rollCcwDeg = rollCcwDeg;
    }

    /**
     * Pitch (X axis).
     * @return
     */
    public Double getPitchCcwDeg() {
        return pitchCcwDeg;
    }

    public void setPitchCcwDeg(Double pitchCcwDeg) {
        this.pitchCcwDeg = pitchCcwDeg;
    }

    /**
     * Yaw (Y axis).
     * @return
     */
    public Double getYawCcwDeg() {
        return yawCcwDeg;
    }

    public void setYawCcwDeg(Double yawCcwDeg) {
        this.yawCcwDeg = yawCcwDeg;
    }

    /**
     * Roll (Z axis).
     * @return
     */
    public Double getRollCcwDeg() {
        return rollCcwDeg;
    }

    public void setRollCcwDeg(Double rollCcwDeg) {
        this.rollCcwDeg = rollCcwDeg;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Rotation3 rotation3 = (Rotation3) o;

        if (pitchCcwDeg != null ? !pitchCcwDeg.equals(rotation3.pitchCcwDeg) : rotation3.pitchCcwDeg != null)
            return false;
        if (yawCcwDeg != null ? !yawCcwDeg.equals(rotation3.yawCcwDeg) : rotation3.yawCcwDeg != null) return false;
        return !(rollCcwDeg != null ? !rollCcwDeg.equals(rotation3.rollCcwDeg) : rotation3.rollCcwDeg != null);

    }

    @Override
    public int hashCode() {
        int result = pitchCcwDeg != null ? pitchCcwDeg.hashCode() : 0;
        result = 31 * result + (yawCcwDeg != null ? yawCcwDeg.hashCode() : 0);
        result = 31 * result + (rollCcwDeg != null ? rollCcwDeg.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Rotation3{" +
                "pitchCcwDeg=" + pitchCcwDeg +
                ", yawCcwDeg=" + yawCcwDeg +
                ", rollCcwDeg=" + rollCcwDeg +
                '}';
    }

}
