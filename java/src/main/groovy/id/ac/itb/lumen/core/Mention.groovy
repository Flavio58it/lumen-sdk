package id.ac.itb.lumen.core

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import groovy.transform.CompileStatic
import org.joda.time.DateTime

/**
 * Mentioned on a public or group post.
 * Created by ceefour on 20/01/15.
 */
@CompileStatic
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonTypeInfo(use=JsonTypeInfo.Id.NAME, property="@type", defaultImpl=Mention.class)
@JsonSubTypes(@JsonSubTypes.Type(name="Mention", value=Mention.class))
class Mention {

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
    /**
     * i.e. https://www.facebook.com/photo.php?fbid=10153036202501672&set=a.10152279921616672.1073741830.596326671&type=1
     */
    String url
}
