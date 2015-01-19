package id.ac.itb.lumen.core

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import groovy.transform.CompileStatic
import org.joda.time.DateTime

/**
 * Created by ceefour on 19/01/15.
 * @see <a href="http://schema.org/ImageObject">schema:ImageObject</a>
 * @see id.co.bippo.common.rs.commerceplug.ImageObject
 */
@CompileStatic
@JsonTypeInfo(use=JsonTypeInfo.Id.NAME, property="@type", defaultImpl=ImageObject.class)
@JsonSubTypes(@JsonSubTypes.Type(name="ImageObject", value=ImageObject.class))
class ImageObject {

    String name
    String contentType
    Long contentSize
    DateTime dateModified
    /**
     * For uploading image, it can refer to actual URL (which will be download)
     * or using Data URI with base64 encoding, e.g. {@code data:image/png;base64,iV...II=}.
     */
    String contentUrl

}
