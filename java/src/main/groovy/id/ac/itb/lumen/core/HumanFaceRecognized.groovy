package id.ac.itb.lumen.core

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import groovy.transform.CompileStatic

/**
 * Created by ceefour on 19/01/15.
 */
@CompileStatic
@JsonTypeInfo(use=JsonTypeInfo.Id.NAME, property="@type", defaultImpl=HumanFaceRecognized.class)
@JsonSubTypes(@JsonSubTypes.Type(name="HumanFaceRecognized", value=HumanFaceRecognized.class))
class HumanFaceRecognized {

    String name
    Vector3 minPoint
    Vector3 maxPoint
    SimpleTruthValue truthValue

}
