package id.ac.itb.lumen.core;

/**
 * If human is tracked to be moving by the human/object movement tracker,
 * then this is sent, and Unity3D virtual perception can update the human/object accordingly.
 * Created by Sigit on 23/04/2015.
 */
public class HumanMoving implements LumenThing {
    private String humanId;
    private Vector3 position;
    private Vector3 rotation;
    private Vector3 speed;
    private Integer imageU;
    private Integer imageV;
    private Integer imageVH;

    /**
     * Human ID that is moving.
     * @return
     */
    public String getHumanId() {
        return humanId;
    }

    public void setHumanId(String humanId) {
        this.humanId = humanId;
    }

    /**
     * Current position, if available.
     * @return
     */
    public Vector3 getPosition() {
        return position;
    }

    public void setPosition(Vector3 position) {
        this.position = position;
    }

    /**
     *
     * @return
     */
    public Vector3 getRotation() {
        return rotation;
    }

    public void setRotation(Vector3 rotation) {
        this.rotation = rotation;
    }

    /**
     * Current local speed in meters/second, relative to local object transform, if available.
     * @return
     */
    public Vector3 getSpeed() {
        return speed;
    }

    public void setSpeed(Vector3 speed) {
        this.speed = speed;
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
}
