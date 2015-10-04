package org.lskk.lumen.core;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by ceefour on 05/10/2015.
 */
public class RecognizedSpeech implements LumenThing {
    @JsonProperty("result")
    private List<SpeechResult> results = new ArrayList<>();

    public List<SpeechResult> getResults() {
        return results;
    }

    @Override
    public String toString() {
        return "RecognizedSpeech{" +
                "results=" + results +
                '}';
    }
}
