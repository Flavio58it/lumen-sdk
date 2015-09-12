package id.ac.itb.lumen.core;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.joda.time.DateTime;

/**
 * Created by ceefour on 19/01/15.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type", defaultImpl = JointState.class)
@JsonSubTypes(@JsonSubTypes.Type(name = "JointState", value = JointState.class))
public class JointState {
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getAngle() {
        return angle;
    }

    public void setAngle(Double angle) {
        this.angle = angle;
    }

    public Double getStiffness() {
        return stiffness;
    }

    public void setStiffness(Double stiffness) {
        this.stiffness = stiffness;
    }

    public DateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(DateTime dateCreated) {
        this.dateCreated = dateCreated;
    }

    private String name;
    private Double angle;
    private Double stiffness;
    private DateTime dateCreated;
}
