package org.lskk.lumen.core;

import java.util.Locale;

/**
 * Speak a word or sentence using <a href="http://www.w3.org/TR/speech-synthesis/">Speech Synthesis Markup Language (SSML)</a>.
 * Created by ceefour on 21/04/2015.
 * @see <a href="https://schema.org/CommunicateAction">schema:CommunicateAction</a>
 */
public class CommunicateAction implements LumenThing {
    private Locale inLanguage;
    private String object;
    private ActionStatusType actionStatus;
    private String avatarId;
    private EmotionKind emotionKind;
    private String voiceId;

    public CommunicateAction() {
    }

    public CommunicateAction(Locale inLanguage, String object, String avatarId) {
        this.inLanguage = inLanguage;
        this.object = object;
        this.avatarId = avatarId;
    }

    public ActionStatusType getActionStatus() {
        return actionStatus;
    }

    public void setActionStatus(ActionStatusType actionStatus) {
        this.actionStatus = actionStatus;
    }

    /**
     *
     * @return
     */
    public Locale getInLanguage() {
        return inLanguage;
    }

    public void setInLanguage(Locale inLanguage) {
        this.inLanguage = inLanguage;
    }

    /**
     * Speech in <a href="http://www.w3.org/TR/speech-synthesis/">Speech Synthesis Markup Language (SSML)</a> format.
     * @return
     */
    public String getObject() {
        return object;
    }

    public void setObject(String object) {
        this.object = object;
    }

    /**
     * Destination avatar ID.
     * @return
     */
    public String getAvatarId() {
        return avatarId;
    }

    public void setAvatarId(String avatarId) {
        this.avatarId = avatarId;
    }

    public EmotionKind getEmotionKind() {
        return emotionKind;
    }

    public void setEmotionKind(EmotionKind emotionKind) {
        this.emotionKind = emotionKind;
    }

    /**
     * The chosen voice ID. The text-to-speech engine will update this when it has chosen the
     * voice based on {@link #getInLanguage()}.
     * @return
     */
    public String getVoiceId() {
        return voiceId;
    }

    /**
     * Manually set the voice ID, usually this is inferred by {@link #getInLanguage()}.
     * @param voiceId
     */
    public void setVoiceId(String voiceId) {
        this.voiceId = voiceId;
    }

    @Override
    public String toString() {
        return "CommunicateAction{" +
                "inLanguage=" + inLanguage +
                ", object='" + object + '\'' +
                ", actionStatus=" + actionStatus +
                ", avatarId='" + avatarId + '\'' +
                ", emotionKind=" + emotionKind +
                '}';
    }
}
