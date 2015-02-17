package id.ac.itb.lumen.core

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import groovy.transform.CompileStatic

/**
 * Created by ceefour on 19/01/15.
 */
@CompileStatic
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonTypeInfo(use=JsonTypeInfo.Id.NAME, property="@type", defaultImpl=JointSetLegacy.class)
@JsonSubTypes(@JsonSubTypes.Type(name="JointSetLegacy", value=JointSetLegacy.class))
class JointSetLegacy {

    @JsonProperty('name')
    List<String> names = []
    @JsonProperty('angle')
    List<Double> angles = []
    @JsonProperty('stiffness')
    List<Double> stiffnesses = []

}
