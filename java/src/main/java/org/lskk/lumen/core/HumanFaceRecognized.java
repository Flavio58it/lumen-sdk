package org.lskk.lumen.core;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.io.Serializable;

/**
 * A human face has been recognized based on camera image.
 * Created by ceefour on 19/01/15.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type", defaultImpl = HumanFaceRecognized.class)
@JsonSubTypes(@JsonSubTypes.Type(name = "HumanFaceRecognized", value = HumanFaceRecognized.class))
public class HumanFaceRecognized implements Serializable {
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

    public SimpleTruthValue getTruthValue() {
        return truthValue;
    }

    public void setTruthValue(SimpleTruthValue truthValue) {
        this.truthValue = truthValue;
    }

    /**
     * The name of the person that was recognized.
     */
    private String name;
    /**
     * The minimum point of the bounding box in 3D space.
     */
    private Vector3 minPoint;
    /**
     * The maximum point of the bounding box in 3D space.
     */
    private Vector3 maxPoint;
    /**
     * The truth value containing strength and confidence of the face recognition result.
     */
    private SimpleTruthValue truthValue;
}
