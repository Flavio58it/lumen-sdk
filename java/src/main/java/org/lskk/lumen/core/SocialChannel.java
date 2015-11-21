package org.lskk.lumen.core;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.io.Serializable;

/**
 * Created by ceefour on 19/01/15.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type", defaultImpl = SocialChannel.class)
@JsonSubTypes(@JsonSubTypes.Type(name = "SocialChannel", value = SocialChannel.class))
public class SocialChannel implements Serializable {

    /**
     * Direct chat using RabbitMQ.
     */
    public static final SocialChannel DIRECT = new SocialChannel("direct", "Direct");
    /**
     * A physical robot such as NAO.
     */
    public static final SocialChannel ROBOT = new SocialChannel("robot", "Robot");
    /**
     * A virtual avatar.
     */
    public static final SocialChannel ANIME = new SocialChannel("anime", "Anime");
    /**
     * Facebook wall, comment, or message, both user-based and page-based.
     */
    public static final SocialChannel FACEBOOK = new SocialChannel("facebook", "Facebook");
    /**
     * Twitter tweet, mention, or direct message.
     */
    public static final SocialChannel TWITTER = new SocialChannel("twitter", "Twitter");

    /**
     * i.e. {@code facebook}
     */
    @JsonProperty("id")
    private String thingId;
    /**
     * i.e. {@code Facebook}
     */
    private String name;

    public SocialChannel() {
    }

    public SocialChannel(String thingId, String name) {
        this.thingId = thingId;
        this.name = name;
    }

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

}
