package id.ac.itb.lumen.core

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import groovy.transform.CompileStatic

/**
 * Created by ceefour on 19/01/15.
 */
@CompileStatic
@JsonTypeInfo(use=JsonTypeInfo.Id.NAME, property="@type", defaultImpl=SocialChannel.class)
@JsonSubTypes(@JsonSubTypes.Type(name="SocialChannel", value=SocialChannel.class))
class SocialChannel {

    /**
     * i.e. {@code Facebook}
     */
    String network

}
