package id.ac.itb.lumen.core

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import groovy.transform.CompileStatic

/**
 * Created by ceefour on 19/01/15.
 */
@CompileStatic
@JsonTypeInfo(use=JsonTypeInfo.Id.NAME, property="@type", defaultImpl=Vector3.class)
@JsonSubTypes(@JsonSubTypes.Type(name="Vector3", value=Vector3.class))
class Vector3 {

    Float x
    Float y
    Float z

}
