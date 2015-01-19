package id.ac.itb.lumen.core

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import groovy.transform.CompileStatic

/**
 * Created by ceefour on 19/01/15.
 */
@CompileStatic
@JsonTypeInfo(use=JsonTypeInfo.Id.NAME, property="@type", defaultImpl=Person.class)
@JsonSubTypes(@JsonSubTypes.Type(name="Person", value=Person.class))
class Person {

    /**
     * i.e. 10206034239078191
     */
    @JsonProperty('id')
    String thingId
    /**
     * i.e. {@code Ahmad Syarif}
     */
    String name

}
