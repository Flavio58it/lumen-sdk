package id.ac.itb.lumen.core

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import groovy.transform.CompileStatic

/**
 * DUMMY
 * Created by ceefour on 19/01/15.
 */
@CompileStatic
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonTypeInfo(use=JsonTypeInfo.Id.NAME, property="@type", defaultImpl=Vector3.class)
@JsonSubTypes(@JsonSubTypes.Type(name="Vector3", value=Vector3.class))
class Vector3 {

    Double x
    Double y
    Double z

    Vector3() {
    }

    Vector3(Double x, Double y, Double z) {
        this.x = x
        this.y = y
        this.z = z
    }
}
