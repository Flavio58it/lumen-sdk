package org.lskk.lumen.core;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.joda.time.DateTime;

/**
 * Used to either consume from someone's Facebook wall
 * or to publish status update to agent's own Facebook profile.
 * Created by ceefour on 19/01/15.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type", defaultImpl = StatusUpdate.class)
@JsonSubTypes(@JsonSubTypes.Type(name = "StatusUpdate", value = StatusUpdate.class))
public class StatusUpdate {
    public String getThingId() {
        return thingId;
    }

    public void setThingId(String thingId) {
        this.thingId = thingId;
    }

    public Person getFrom() {
        return from;
    }

    public void setFrom(Person from) {
        this.from = from;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public SocialChannel getChannel() {
        return channel;
    }

    public void setChannel(SocialChannel channel) {
        this.channel = channel;
    }

    public DateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(DateTime dateCreated) {
        this.dateCreated = dateCreated;
    }

    public DateTime getDatePublished() {
        return datePublished;
    }

    public void setDatePublished(DateTime datePublished) {
        this.datePublished = datePublished;
    }

    public DateTime getDateModified() {
        return dateModified;
    }

    public void setDateModified(DateTime dateModified) {
        this.dateModified = dateModified;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    /**
     * e.g. 10203536415231264_425825740901928
     */
    @JsonProperty("id")
    private String thingId;
    /**
     * When publishing to {@link LumenChannel#SOCIAL_EXPRESSION}, this must be left empty.
     */
    private Person from;
    private String message;
    private SocialChannel channel;
    private DateTime dateCreated;
    private DateTime datePublished;
    private DateTime dateModified;
    /**
     * i.e. https://www.facebook.com/photo.php?fbid=10153036202501672&set=a.10152279921616672.1073741830.596326671&type=1
     */
    private String url;
}
