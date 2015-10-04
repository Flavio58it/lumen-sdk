package org.lskk.lumen.core;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by ceefour on 05/10/2015.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class SpeechResult implements Serializable {

    @JsonProperty("alternative")
    private List<SpeechAlternative> alternatives = new ArrayList<>();
    @JsonProperty("final")
    private Boolean finalResult;

    public List<SpeechAlternative> getAlternatives() {
        return alternatives;
    }

    public Boolean getFinalResult() {
        return finalResult;
    }

    public void setFinalResult(Boolean finalResult) {
        this.finalResult = finalResult;
    }

    @Override
    public String toString() {
        return "SpeechResult{" +
                "alternatives=" + alternatives +
                ", finalResult=" + finalResult +
                '}';
    }
}
