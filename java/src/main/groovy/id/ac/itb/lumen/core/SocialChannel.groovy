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
@JsonTypeInfo(use=JsonTypeInfo.Id.NAME, property="@type", defaultImpl=SocialChannel.class)
@JsonSubTypes(@JsonSubTypes.Type(name="SocialChannel", value=SocialChannel.class))
class SocialChannel {

    /**
     * i.e. {@code facebook}
     */
    @JsonProperty('id')
    String thingId
    /**
     * i.e. {@code Facebook}
     */
    String name

}
