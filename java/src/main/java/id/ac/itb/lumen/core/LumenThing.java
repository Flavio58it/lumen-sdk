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
})
public interface LumenThing extends Serializable {
}
