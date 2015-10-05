package org.lskk.lumen.core;

/**
 * Speech a word or sentence using SpeechML markup.
 * Created by ceefour on 21/04/2015.
 */
public class Speech implements LumenThing {
    private String markup;
    private String avatarId;

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

    public String getAvatarId() {
        return avatarId;
    }

    public void setAvatarId(String avatarId) {
        this.avatarId = avatarId;
    }

    @Override
    public String toString() {
        return "Speech{" +
                "markup='" + markup + '\'' +
                ", avatarId='" + avatarId + '\'' +
                '}';
    }
}
