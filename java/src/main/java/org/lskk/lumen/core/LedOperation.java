package org.lskk.lumen.core;

import java.util.ArrayList;
import java.util.List;

/**
 * See http://doc.aldebaran.com/1-14/naoqi/sensors/alleds-api.html
 */
public class LedOperation implements LumenThing {

    private LedOperationKind kind;
    private Double duration;
    private String color;
    private Double intensity;
    private List<String> names = new ArrayList<>();

    public LedOperationKind getKind() {
        return kind;
    }

    public void setKind(LedOperationKind kind) {
        this.kind = kind;
    }

    public Double getDuration() {
        return duration;
    }

    public void setDuration(Double duration) {
        this.duration = duration;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Double getIntensity() {
        return intensity;
    }

    public void setIntensity(Double intensity) {
        this.intensity = intensity;
    }

    public List<String> getNames() {
        return names;
    }

    @Override
    public String toString() {
        return "LedOperation{" +
                "kind=" + kind +
                ", duration=" + duration +
                ", color='" + color + '\'' +
                ", intensity=" + intensity +
                ", names=" + names +
                '}';
    }
}
