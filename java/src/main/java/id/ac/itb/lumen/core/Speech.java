package id.ac.itb.lumen.core;

/**
 * Speech a word or sentence using SpeechML markup.
 * Created by ceefour on 21/04/2015.
 */
public class Speech implements LumenThing {
    private String markup;

    public Speech() {
    }

    public Speech(String markup) {
        this.markup = markup;
    }

    /**
     * SpeechML markup.
     * @return
     */
    public String getMarkup() {
        return markup;
    }

    public void setMarkup(String markup) {
        this.markup = markup;
    }

    @Override
    public String toString() {
        return "Speech{" +
                "markup='" + markup + '\'' +
                '}';
    }
}
