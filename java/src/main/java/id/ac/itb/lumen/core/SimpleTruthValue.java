package id.ac.itb.lumen.core;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

/**
 * Created by ceefour on 19/01/15.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type", defaultImpl = SimpleTruthValue.class)
@JsonSubTypes(@JsonSubTypes.Type(name = "SimpleTruthValue", value = SimpleTruthValue.class))
public class SimpleTruthValue {
    public Float getStrength() {
        return strength;
    }

    public void setStrength(Float strength) {
        this.strength = strength;
    }

    public Float getConfidence() {
        return confidence;
    }

    public void setConfidence(Float confidence) {
        this.confidence = confidence;
    }

    private Float strength;
    private Float confidence;
}
