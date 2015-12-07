package org.lskk.lumen.core;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.joda.time.DateTime;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by ceefour on 19/01/15.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type", defaultImpl = MotionState.class)
@JsonSubTypes(@JsonSubTypes.Type(name = "MotionState", value = MotionState.class))
public class MotionState {


    private List<JointState> angles = new ArrayList<>();
    public List<JointState> getAngles() {return angles;}
    private DateTime dateCreated;

//    public void setAngles(Double percentage) {
//        this.percentage = percentage;
//    }

//    public Boolean getIsPlugged() {
//        return isPlugged;
//    }

//    public void setIsPlugged(Boolean isPlugged) {
//        this.isPlugged = isPlugged;
//    }

//    public Boolean getIsCharging() {
//        return isCharging;
//    }

//    public void setIsCharging(Boolean isCharging) {
//        this.isCharging = isCharging;
//    }

    public DateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(DateTime dateCreated) {
        this.dateCreated = dateCreated;
    }

}
