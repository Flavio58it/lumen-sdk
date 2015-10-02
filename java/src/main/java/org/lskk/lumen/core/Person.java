package org.lskk.lumen.core;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import groovy.transform.CompileStatic;

/**
 * Created by ceefour on 19/01/15.
 */
@CompileStatic
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type", defaultImpl = Person.class)
@JsonSubTypes(@JsonSubTypes.Type(name = "Person", value = Person.class))
public class Person {
    public String getThingId() {
        return thingId;
    }

    public void setThingId(String thingId) {
        this.thingId = thingId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public ImageObject getPhoto() {
        return photo;
    }

    public void setPhoto(ImageObject photo) {
        this.photo = photo;
    }

    /**
     * i.e. 10206034239078191
     */
    @JsonProperty("id")
    private String thingId;
    /**
     * i.e. {@code Ahmad Syarif}
     */
    private String name;
    /**
     * e.g. https://www.facebook.com/marzuki.rd
     */
    private String url;
    /**
     * Username/slug (usually case-insensitive and punctuation-insensitive) e.g. {@code marzuki.rd}
     */
    private String slug;
    private ImageObject photo;
}
