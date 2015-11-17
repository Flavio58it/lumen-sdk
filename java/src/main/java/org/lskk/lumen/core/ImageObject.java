package org.lskk.lumen.core;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;

import javax.xml.bind.annotation.XmlAttribute;

/**
 * Created by ceefour on 19/01/15.
 * @see <a href="http://schema.org/ImageObject">schema:ImageObject</a>
 * @see id.co.bippo.common.rs.commerceplug.ImageObject
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonTypeInfo(use=JsonTypeInfo.Id.NAME, property="@type", defaultImpl=ImageObject.class)
@JsonSubTypes(@JsonSubTypes.Type(name="ImageObject", value=ImageObject.class))
public class ImageObject {

    private String name;
    private String contentType;
    private Long contentSize;
    private DateTime uploadDate;
    private DateTime dateCreated;
    private DateTime dateModified;
    private DateTime datePublished;
    /**
     * For uploading image, it can refer to actual URL (which will be download)
     * or using Data URI with base64 encoding, e.g. {@code data:image/png;base64,iV...II=}.
     */
    private String contentUrl;
    /**
     * Normal or thumbnail image, e.g. used by {@link Person#photo}
     */
    private String url;
    @JsonIgnore
    private byte[] content;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Long getContentSize() {
        return contentSize;
    }

    public void setContentSize(Long contentSize) {
        this.contentSize = contentSize;
    }

    public DateTime getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(DateTime uploadDate) {
        this.uploadDate = uploadDate;
    }

    public DateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(DateTime dateCreated) {
        this.dateCreated = dateCreated;
    }

    public DateTime getDateModified() {
        return dateModified;
    }

    public void setDateModified(DateTime dateModified) {
        this.dateModified = dateModified;
    }

    public DateTime getDatePublished() {
        return datePublished;
    }

    public void setDatePublished(DateTime datePublished) {
        this.datePublished = datePublished;
    }

    public String getContentUrl() {
        return contentUrl;
    }

    public void setContentUrl(String contentUrl) {
        this.contentUrl = contentUrl;
    }

    @XmlAttribute
    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    /**
     * Temporary place to put image content.
     * @return
     */
    public byte[] getContent() {
        return content;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "ImageObject{" +
                "name='" + name + '\'' +
                ", contentType='" + contentType + '\'' +
                ", contentSize=" + contentSize +
                ", uploadDate=" + uploadDate +
                ", dateCreated=" + dateCreated +
                ", dateModified=" + dateModified +
                ", datePublished=" + datePublished +
                ", contentUrl='" + StringUtils.abbreviate(contentUrl, 100) + '\'' +
                ", url='" + url + '\'' +
                '}';
    }
}
