package id.ac.itb.lumen.core;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

/**
 * Created by ceefour on 19/01/15.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type", defaultImpl = SocialChannel.class)
@JsonSubTypes(@JsonSubTypes.Type(name = "SocialChannel", value = SocialChannel.class))
public class SocialChannel {
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

    /**
     * i.e. {@code facebook}
     */
    @JsonProperty("id")
    private String thingId;
    /**
     * i.e. {@code Facebook}
     */
    private String name;
}
