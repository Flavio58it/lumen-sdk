package id.ac.itb.lumen.core

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import groovy.transform.CompileStatic
import org.joda.time.DateTime

/**
 * Created by ceefour on 19/01/15.
 * @see <a href="http://schema.org/ImageObject">schema:ImageObject</a>
 * @see id.co.bippo.common.rs.commerceplug.ImageObjectLegacy
 */
@CompileStatic
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonTypeInfo(use=JsonTypeInfo.Id.NAME, property="@type", defaultImpl=ImageObjectLegacy.class)
@JsonSubTypes(@JsonSubTypes.Type(name="ImageObjectLegacy", value=ImageObjectLegacy.class))
class ImageObjectLegacy {

    String name
    String contentType
    Long contentSize
    String uploadDate
    String dateCreated
    String dateModified
    String datePublished
    /**
     * For uploading image, it can refer to actual URL (which will be download)
     * or using Data URI with base64 encoding, e.g. {@code data:image/png;base64,iV...II=}.
     */
    String contentUrl
    /**
     * Normal or thumbnail image, e.g. used by {@link Person#photo}
     */
    String url

}
