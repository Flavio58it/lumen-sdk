package org.lskk.lumen.core;

/**
 * All Lumen avatar-independent channels are using the following (Stomp) pattern:
 * <p>
 * <ul>
 * <li>/topic/lumen.CHANNEL_NAME</li>
 * <li>/queue/lumen.CHANNEL_NAME</li>
 * </ul>
 * <p>
 * <p>This class defines the channel names,
 * and to construct a topic/queue destination
 * using {@code agentId} and {@code channelName}.
 * <p>
 * Created by ceefour on 19/01/15.
 */
public enum LumenChannel {
    PERSISTENCE_JOURNAL("persistence.journal"),
    PERSISTENCE_FACT("persistence.fact"),
    PERSISTENCE_KNOWLEDGE("persistence.knowledge"),
    SPEECH_SYNTHESIS("speech.synthesis"),
    SPEECH_RECOGNITION("speech.recognition"),
    HUMAN_RECOGNITION("human.recognition"),
    FACE_RECOGNITION("face.recognition"),
    ACTION_RECOGNITION("action.recognition"),
    SOCIAL_EXPRESSION("social.expression"),
    SOCIAL_PERCEPTION("social.perception"),
    FACEBOOK_TIMELINE_OUT("facebook.timeline.out");

    LumenChannel(String keySuffix) {
        this.keySuffix = keySuffix;
    }

    public String key() {
        return "lumen." + keySuffix;
    }

    public String key(String agentId) {
        return "lumen." + agentId + "." + keySuffix;
    }

    @Override
    public String toString() {
        return key();
    }

    public String getKeySuffix() {
        return keySuffix;
    }

    public void setKeySuffix(String keySuffix) {
        this.keySuffix = keySuffix;
    }

    private String keySuffix;
}
