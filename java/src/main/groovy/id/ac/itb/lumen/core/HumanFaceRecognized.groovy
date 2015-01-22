package id.ac.itb.lumen.core

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import groovy.transform.CompileStatic

/**
 * A human face has been recognized based on camera image.
 * Created by ceefour on 19/01/15.
 */
@CompileStatic
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonTypeInfo(use=JsonTypeInfo.Id.NAME, property="@type", defaultImpl=HumanFaceRecognized.class)
@JsonSubTypes(@JsonSubTypes.Type(name="HumanFaceRecognized", value=HumanFaceRecognized.class))
class HumanFaceRecognized {

    /**
     * The name of the person that was recognized. 
     */
    String name
    /**
     * The minimum point of the bounding box in 3D space. 
     */
    Vector3 minPoint
    /**
     * The maximum point of the bounding box in 3D space. 
     */
    Vector3 maxPoint
    /**
     * The truth value containing strength and confidence of the face recognition result. 
     */
    SimpleTruthValue truthValue

}
