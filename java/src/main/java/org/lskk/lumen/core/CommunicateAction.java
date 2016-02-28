package org.lskk.lumen.core;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonSetter;

import java.util.Locale;
import java.util.Optional;

/**
 * Speak a word or sentence using <a href="http://www.w3.org/TR/speech-synthesis/">Speech Synthesis Markup Language (SSML)</a>.
 * Created by ceefour on 21/04/2015.
 * @see <a href="https://schema.org/CommunicateAction">schema:CommunicateAction</a>
 */
public class CommunicateAction implements LumenThing {
    private Locale inLanguage;
    private String object;
    private float[] speechTruthValue;
    private ActionStatusType actionStatus;
    private String avatarId;
    private EmotionKind emotionKind;
    private ConversationStyle conversationStyle;
    private String voiceId;
    private Gender gender;
    private Boolean usedForSynthesis;
    private ImageObject image;
    private AudioObject audio;

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

    /**
     * Speech in <a href="http://www.w3.org/TR/speech-synthesis/">Speech Synthesis Markup Language (SSML)</a> format.
     * This can be empty String, which makes sense when {@link #getImage()} is set.
     * @return
     */
    public String getObject() {
        return object;
    }

    public void setObject(String object) {
        this.object = object;
    }

    /**
     * 3-element {@link SimpleTruthValue} of speech recognition.
     * <ol>
     *  <li>Strength: How strong the speaker says the utterance.</li>
     *  <li>Confidence: Confidence of speech recognizer.</li>
     *  <li>Count: Count (unused).</li>
     * </ol>
     * @return
     */
    public float[] getSpeechTruthValue() {
        return speechTruthValue;
    }

    public void setSpeechTruthValue(float[] speechTruthValue) {
        this.speechTruthValue = speechTruthValue;
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

    public ConversationStyle getConversationStyle() {
        return conversationStyle;
    }

    public void setConversationStyle(ConversationStyle conversationStyle) {
        this.conversationStyle = conversationStyle;
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

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    /**
     * If {@code true} and sent to {@link AvatarChannel#CHAT_OUTBOX}, speech-synthesis module will synthesize
     * the {@link CommunicateAction#getObject()} to {@link AvatarChannel#AUDIO_OUT}.
     * @return
     */
    public Boolean getUsedForSynthesis() {
        return usedForSynthesis;
    }

    public void setUsedForSynthesis(Boolean usedForSynthesis) {
        this.usedForSynthesis = usedForSynthesis;
    }

    public ImageObject getImage() {
        return image;
    }

    public void setImage(ImageObject image) {
        this.image = image;
    }

    public AudioObject getAudio() {
        return audio;
    }

    public void setAudio(AudioObject audio) {
        this.audio = audio;
    }

    @Override
    public String toString() {
        return "CommunicateAction{" +
                "inLanguage=" + Optional.ofNullable(inLanguage).map(Locale::toLanguageTag).orElse(null) +
                ", object='" + object + '\'' +
                ", actionStatus=" + actionStatus +
                ", avatarId='" + avatarId + '\'' +
                ", emotionKind=" + emotionKind +
                ", usedForSynthesis=" + usedForSynthesis +
                ", gender=" + gender +
                ", image=" + image +
                '}';
    }
}
