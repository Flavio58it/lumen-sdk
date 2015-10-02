package org.lskk.lumen.core;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.joda.time.DateTime;

/**
 * Created by ceefour on 19/01/15.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type", defaultImpl = SonarState.class)
@JsonSubTypes(@JsonSubTypes.Type(name = "SonarState", value = SonarState.class))
public class SonarState {
    public Double getLeftSensor() {
        return leftSensor;
    }

    public void setLeftSensor(Double leftSensor) {
        this.leftSensor = leftSensor;
    }

    public Double getRightSensor() {
        return rightSensor;
    }

    public void setRightSensor(Double rightSensor) {
        this.rightSensor = rightSensor;
    }

    public DateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(DateTime dateCreated) {
        this.dateCreated = dateCreated;
    }

    private Double leftSensor;
    private Double rightSensor;
    private DateTime dateCreated;
}
