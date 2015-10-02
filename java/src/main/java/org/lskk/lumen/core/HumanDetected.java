package org.lskk.lumen.core;

/**
 * If human detected by human detector, then this is sent,
 * and virtual perception (Unity3D) can instantiate a 3D human visualization in game level.
 * Created by Sigit on 23/04/2015.
 */
public class HumanDetected implements LumenThing {

    private String humanId;
    private Vector3 position;
    private Rotation3 rotation;
    private Integer imageU;
    private Integer imageV;
    private Integer imageVH;

    public String getHumanId() {
        return humanId;
    }

    public void setHumanId(String humanId) {
        this.humanId = humanId;
    }

    public Vector3 getPosition() {
        return position;
    }

    public void setPosition(Vector3 position) {
        this.position = position;
    }

    public Rotation3 getRotation() {
        return rotation;
    }

    public void setRotation(Rotation3 rotation) {
        this.rotation = rotation;
    }

    public Integer getImageU() {
        return imageU;
    }

    public void setImageU(Integer imageU) {
        this.imageU = imageU;
    }

    public Integer getImageV() {
        return imageV;
    }

    public void setImageV(Integer imageV) {
        this.imageV = imageV;
    }

    public Integer getImageVH() {
        return imageVH;
    }

    public void setImageVH(Integer imageVH) {
        this.imageVH = imageVH;
    }

    @Override
    public String toString() {
        return "HumanDetected{" +
                "humanId='" + humanId + '\'' +
                ", position=" + position +
                ", rotation=" + rotation +
                '}';
    }

}
