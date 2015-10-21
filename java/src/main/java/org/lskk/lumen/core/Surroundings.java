package org.lskk.lumen.core;

import org.joda.time.DateTime;

/**
 * Lingkungan di dunia nyata yang dikenali oleh modul visual processing dan/atau reasoning.
 */
public class Surroundings implements LumenThing {

    /**
     * Avatar yang mengirimkan citra asalnya.
     */
    private String avatarId;
    /**
     * The name of the surroundings that was recognized.
     */
    private String name;
    /**
     * YAGO Class dari surroundings yang terdeteksi.
     */
    private String kind;
    /**
     * The minimum point of the bounding box in 3D space.
     */
    private Vector3 minPoint;
    /**
     * The maximum point of the bounding box in 3D space.
     */
    private Vector3 maxPoint;
    /**
     * The truth value containing strength, confidence, and count of the recognition result.
     */
    private float[] truthValue;
    /**
     * ISO date time with time zone when this object was detected.
     */
    private DateTime dateCreated;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Vector3 getMinPoint() {
        return minPoint;
    }

    public void setMinPoint(Vector3 minPoint) {
        this.minPoint = minPoint;
    }

    public Vector3 getMaxPoint() {
        return maxPoint;
    }

    public void setMaxPoint(Vector3 maxPoint) {
        this.maxPoint = maxPoint;
    }

    public float[] getTruthValue() {
        return truthValue;
    }

    public void setTruthValue(float[] truthValue) {
        this.truthValue = truthValue;
    }

    public String getAvatarId() {
        return avatarId;
    }

    public void setAvatarId(String avatarId) {
        this.avatarId = avatarId;
    }

    public String getKind() {
        return kind;
    }

    public void setKind(String kind) {
        this.kind = kind;
    }

    public DateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(DateTime dateCreated) {
        this.dateCreated = dateCreated;
    }
}
