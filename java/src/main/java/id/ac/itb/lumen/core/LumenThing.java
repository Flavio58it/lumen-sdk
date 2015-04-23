package id.ac.itb.lumen.core;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.io.Serializable;

/**
 * Created by ceefour on 20/04/2015.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonTypeInfo(use=JsonTypeInfo.Id.NAME, property="@type")
@JsonSubTypes({
        @JsonSubTypes.Type(name="ImageObject", value=ImageObject.class),
        @JsonSubTypes.Type(name="MoveTo", value=MoveTo.class),
        @JsonSubTypes.Type(name="WakeUp", value=WakeUp.class),
        @JsonSubTypes.Type(name="Rest", value=Rest.class),
        @JsonSubTypes.Type(name="PostureChange", value=PostureChange.class),
        @JsonSubTypes.Type(name="Speech", value=Speech.class),
        @JsonSubTypes.Type(name="AudioVolume", value=AudioVolume.class),
        @JsonSubTypes.Type(name="JointInterpolateAngle", value=JointInterpolateAngle.class),
        @JsonSubTypes.Type(name="AvatarTransform", value=AvatarTransform.class),
        @JsonSubTypes.Type(name="HumanDetected", value=HumanDetected.class),
        @JsonSubTypes.Type(name="HumanMoving", value=HumanMoving.class),
})
public interface LumenThing extends Serializable {
}
