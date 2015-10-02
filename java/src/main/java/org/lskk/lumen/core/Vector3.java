package org.lskk.lumen.core;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.io.Serializable;

/**
 * Created by Sigit on 23/04/2015.
 * @todo Maybe should use common object from Commons Math, OpenCV, etc.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonTypeInfo(use=JsonTypeInfo.Id.NAME, property="@type", defaultImpl=Vector3.class)
@JsonSubTypes(@JsonSubTypes.Type(name="Vector3", value=Vector3.class))
public class Vector3 implements Serializable {
    private Double x;
    private Double y;
    private Double z;

    public Vector3() {
    }

    public Vector3(Double x, Double y, Double z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * + is to the right/east, in meters.
     * @return
     */
    public Double getX() {
        return x;
    }

    public void setX(Double x) {
        this.x = x;
    }

    /**
     * + is to top, in meters.
     * @return
     */
    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
    }

    /**
     * + is to back/south, in meters.
     * @return
     */
    public Double getZ() {
        return z;
    }

    public void setZ(Double z) {
        this.z = z;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Vector3 vector3 = (Vector3) o;

        if (Double.compare(vector3.x, x) != 0) return false;
        if (Double.compare(vector3.y, y) != 0) return false;
        return Double.compare(vector3.z, z) == 0;

    }

    @Override
    public int hashCode() {
        int result;
        long temp;
        temp = Double.doubleToLongBits(x);
        result = (int) (temp ^ (temp >>> 32));
        temp = Double.doubleToLongBits(y);
        result = 31 * result + (int) (temp ^ (temp >>> 32));
        temp = Double.doubleToLongBits(z);
        result = 31 * result + (int) (temp ^ (temp >>> 32));
        return result;
    }

    @Override
    public String toString() {
        return x +
                ", " + y +
                ", " + z;
    }
}
