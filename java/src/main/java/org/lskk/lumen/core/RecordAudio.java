package org.lskk.lumen.core;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonSetter;

import java.util.Locale;

/**
 * http://doc.aldebaran.com/1-14/naoqi/audio/alaudioplayer-api.html
 */
public class RecordAudio implements LumenThing {

    private Double duration;
    private Boolean usedForChat;
    private Locale inLanguage;

    /**
     * Default is 5.0 (seconds).
     * @return
     */
    public Double getDuration() {
        return duration;
    }

    public void setDuration(Double duration) {
        this.duration = duration;
    }

    /**
     * After audio is recorded, this will set {@link AudioObject#setUsedForChat(Boolean)}.
     * @return
     * @see AudioObject#getUsedForChat()
     */
    public Boolean getUsedForChat() {
        return usedForChat;
    }

    public void setUsedForChat(Boolean usedForChat) {
        this.usedForChat = usedForChat;
    }

    public Locale getInLanguage() {
        return inLanguage;
    }

    @JsonGetter("inLanguage")
    public String getInLanguageAsString() {
        return inLanguage != null ? inLanguage.toLanguageTag() : null;
    }

    public void setInLanguage(Locale inLanguage) {
        this.inLanguage = inLanguage;
    }

    @JsonSetter
    public void setInLanguage(String inLanguage) {
        this.inLanguage = inLanguage != null ? Locale.forLanguageTag(inLanguage) : null;
    }

    @Override
    public String toString() {
        return "RecordAudio{" +
                "duration=" + duration +
                ", usedForChat=" + usedForChat +
                ", inLanguage=" + inLanguage +
                '}';
    }
}
