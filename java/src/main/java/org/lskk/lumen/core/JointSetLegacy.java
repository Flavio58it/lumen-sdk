package org.lskk.lumen.core;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by ceefour on 19/01/15.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type", defaultImpl = JointSetLegacy.class)
@JsonSubTypes(@JsonSubTypes.Type(name = "JointSetLegacy", value = JointSetLegacy.class))
public class JointSetLegacy implements Serializable {
    public List<String> getNames() {
        return names;
    }

    public void setNames(List<String> names) {
        this.names = names;
    }

    public List<Double> getAngles() {
        return angles;
    }

    public void setAngles(List<Double> angles) {
        this.angles = angles;
    }

    public List<Double> getStiffnesses() {
        return stiffnesses;
    }

    public void setStiffnesses(List<Double> stiffnesses) {
        this.stiffnesses = stiffnesses;
    }

    @JsonProperty("name")
    private List<String> names = new ArrayList<String>();
    @JsonProperty("angle")
    private List<Double> angles = new ArrayList<Double>();
    @JsonProperty("stiffness")
    private List<Double> stiffnesses = new ArrayList<Double>();
}
