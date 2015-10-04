package org.lskk.lumen.core;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.io.Serializable;

/**
 * Created by ceefour on 05/10/2015.
 */
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class SpeechAlternative implements Serializable {

    private String transcript;
    private Double confidence;

    public String getTranscript() {
        return transcript;
    }

    public void setTranscript(String transcript) {
        this.transcript = transcript;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    @Override
    public String toString() {
        return "SpeechAlternative{" +
                "transcript='" + transcript + '\'' +
                ", confidence=" + confidence +
                '}';
    }
}
