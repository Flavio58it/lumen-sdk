package org.lskk.lumen.core;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
        @JsonSubTypes.Type(name="HumanChanges", value=HumanChanges.class),
        @JsonSubTypes.Type(name="HumanMoving", value=HumanMoving.class),
        @JsonSubTypes.Type(name="LedOperation", value=LedOperation.class),
        @JsonSubTypes.Type(name="StopAudio", value=StopAudio.class),
        @JsonSubTypes.Type(name="RecordAudio", value=RecordAudio.class),
        @JsonSubTypes.Type(name="AudioObject", value=AudioObject.class),
        @JsonSubTypes.Type(name="ActingPerformance", value=ActingPerformance.class),
        @JsonSubTypes.Type(name="RecognizedSpeech", value=RecognizedSpeech.class),
})
@JsonIgnoreProperties(ignoreUnknown = true)
public interface LumenThing extends Serializable {
}
