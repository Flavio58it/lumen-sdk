package org.lskk.lumen.core;

import com.google.common.base.Splitter;

/**
 * All avatar channels are using the following (Stomp) pattern:
 * <p/>
 * <ul>
 * <li>/topic/avatar.AVATAR_ID.CHANNEL_NAME</li>
 * <li>/queue/avatar.AVATAR_ID.CHANNEL_NAME</li>
 * </ul>
 * <p/>
 * <p>This class defines the channel names,
 * and to construct a topic/queue destination
 * using {@code agentId} and {@code channelName}.
 * <p/>
 * Created by ceefour on 19/01/15.
 */
public enum AvatarChannel {
    /**
     * Sequential animation of commands, usually motion ({@link JointInterpolateAngle}) but can also use {@link ActingPerformance},
     * {@link CommunicateAction}, etc.
     */
    ANIMATION("animation"),
    AUDIO("audio"),
    AUDIO_IN("audio.in"),
    AUDIO_OUT("audio.out"),
    MOTION("motion"),
    POSTURE("posture"),
    CAMERA("camera"),
    CAMERA_MAIN("camera.main"),
    CAMERA_BOTTOM("camera.bottom"),
    CHAT_INBOX("chat.inbox"),
    CHAT_OUTBOX("chat.outbox"),
    BATTERY("battery"),
    SENSORS("sensors"),
    SONAR("sonar"),
    PERSISTENCE_JOURNAL("persistence.journal"),
    PERSISTENCE_FACT("persistence.fact"),
    PERSISTENCE_KNOWLEDGE("persistence.knowledge"),
    HUMAN_RECOGNITION("human.recognition"),
    FACE_RECOGNITION("face.recognition"),
    ACTION_RECOGNITION("action.recognition"),
    SOCIAL_EXPRESSION("social.expression"),
    SOCIAL_PERCEPTION("social.perception"),
    LEDS("leds"),
    /**
     * For {@link ActingPerformance}.
     */
    ACTING("acting"),
    @Deprecated
    COMMAND("command");

    AvatarChannel(String keySuffix) {
        this.keySuffix = keySuffix;
    }

    public String key(String avatarId) {
        return "avatar." + avatarId + "." + keySuffix;
    }

    public String wildcard() {
        return "avatar.*." + keySuffix;
    }

    @Override
    public String toString() {
        return keySuffix;
    }

    public String getKeySuffix() {
        return keySuffix;
    }

    public void setKeySuffix(String keySuffix) {
        this.keySuffix = keySuffix;
    }

    private String keySuffix;

    public static String getAvatarId(String topic) {
        return Splitter.on('.').splitToList(topic).get(1);
    }
}
