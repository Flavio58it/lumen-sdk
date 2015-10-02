package org.lskk.lumen.core;

/**
 * Created by ceefour on 21/04/2015.
 */
public class PostureChange implements LumenThing {
    private String postureId;
    private Double speed;

    /**
     * {@code Stand}, etc.
     * @return
     */
    public String getPostureId() {
        return postureId;
    }

    public void setPostureId(String postureId) {
        this.postureId = postureId;
    }

    /**
     * From 0.0 (slowest) to 1.0 (fastest), but safe is <= 0.7.
     * @return
     */
    public Double getSpeed() {
        return speed;
    }

    public void setSpeed(Double speed) {
        this.speed = speed;
    }

    @Override
    public String toString() {
        return "PostureChange{" +
                "postureId='" + postureId + '\'' +
                ", speed=" + speed +
                '}';
    }
}
