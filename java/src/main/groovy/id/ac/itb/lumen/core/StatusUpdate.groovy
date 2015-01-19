package id.ac.itb.lumen.core

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import groovy.transform.CompileStatic
import org.joda.time.DateTime

/**
 * Used to either consume from someone's Facebook wall
 * or to publish status update to agent's own Facebook profile.
 * Created by ceefour on 19/01/15.
 */
@CompileStatic
@JsonTypeInfo(use=JsonTypeInfo.Id.NAME, property="@type", defaultImpl=StatusUpdate.class)
@JsonSubTypes(@JsonSubTypes.Type(name="StatusUpdate", value=StatusUpdate.class))
class StatusUpdate {

    /**
     * e.g. 10203536415231264_425825740901928
     */
    @JsonProperty('id')
    String thingId
    /**
     * When publishing to {@link Channel#SOCIAL_EXPRESSION}, this must be left empty.
     */
    Person from
    String message
    SocialChannel channel
    DateTime dateCreated
    DateTime datePublished
    DateTime dateModified
}
