package org.lskk.lumen.core;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.io.Serializable;

/**
 * Created by ceefour on 19/01/15.
 *
 * @see <a href="http://schema.org/ImageObject">schema:ImageObject</a>
 * @see id.co.bippo.common.rs.commerceplug.ImageObjectLegacy
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type", defaultImpl = ImageObjectLegacy.class)
@JsonSubTypes(@JsonSubTypes.Type(name = "ImageObjectLegacy", value = ImageObjectLegacy.class))
public class ImageObjectLegacy implements Serializable {
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

    public String getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(String uploadDate) {
        this.uploadDate = uploadDate;
    }

    public String getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(String dateCreated) {
        this.dateCreated = dateCreated;
    }

    public String getDateModified() {
        return dateModified;
    }

    public void setDateModified(String dateModified) {
        this.dateModified = dateModified;
    }

    public String getDatePublished() {
        return datePublished;
    }

    public void setDatePublished(String datePublished) {
        this.datePublished = datePublished;
    }

    public String getContentUrl() {
        return contentUrl;
    }

    public void setContentUrl(String contentUrl) {
        this.contentUrl = contentUrl;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    private String name;
    private String contentType;
    private Long contentSize;
    private String uploadDate;
    private String dateCreated;
    private String dateModified;
    private String datePublished;
    /**
     * For uploading image, it can refer to actual URL (which will be download)
     * or using Data URI with base64 encoding, e.g. {@code data:image/png;base64,iV...II=}.
     */
    private String contentUrl;
    /**
     * Normal or thumbnail image, e.g. used by {@link Person#photo}
     */
    private String url;
}
