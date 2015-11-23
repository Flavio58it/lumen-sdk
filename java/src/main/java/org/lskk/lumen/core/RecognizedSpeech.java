package org.lskk.lumen.core;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.joda.time.DateTime;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by ceefour on 05/10/2015.
 */
public class RecognizedSpeech implements LumenThing {
    private String avatarId;
    @JsonProperty("result")
    private List<SpeechResult> results = new ArrayList<>();
    private DateTime dateCreated;

    public String getAvatarId() {
        return avatarId;
    }

    public void setAvatarId(String avatarId) {
        this.avatarId = avatarId;
    }

    public List<SpeechResult> getResults() {
        return results;
    }

    public DateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(DateTime dateCreated) {
        this.dateCreated = dateCreated;
    }

    public void setResults(List<SpeechResult> results) {
        this.results = results;
    }

    @Override
    public String toString() {
        return "RecognizedSpeech{" +
                "results=" + results +
                ", avatarId=" + avatarId +
                ", dateCreated=" + dateCreated +
                '}';
    }
}
