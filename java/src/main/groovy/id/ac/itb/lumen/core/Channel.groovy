package id.ac.itb.lumen.core

import groovy.transform.CompileStatic

/**
 * All channels are using the following (Stomp) pattern:
 *
 * <ul>
 *     <li>/topic/lumen.AGENT_ID.CHANNEL_NAME</li>
 *     <li>/queue/lumen.AGENT_ID.CHANNEL_NAME</li>
 * </ul>
 *
 * <p>This class defines the channel names,
 * and to construct a topic/queue destination
 * using {@code agentId} and {@code channelName}.
 *
 * Created by ceefour on 19/01/15.
 */
@CompileStatic
enum Channel {

    PERSISTENCE_JOURNAL('persistence.journal'),
    PERSISTENCE_FACT('persistence.fact'),
    PERSISTENCE_KNOWLEDGE('persistence.knowledge'),
    MOTION('motion'),
    POSTURE('posture'),
    /**
     * @see id.ac.itb.lumen.core.ImageObject
     */
    CAMERA('camera'),
    /**
     * @see id.ac.itb.lumen.core.ImageObject
     */
    CAMERA_STREAM('camera.stream'),
    BATTERY('battery'),
    SENSORS('sensors'),
    SONAR('sonar'),
    SPEECH_SYNTHESIS('speech.synthesis'),
    SPEECH_RECOGNITION('speech.recognition'),
    HUMAN_RECOGNITION('human.recognition'),
    /**
     * @see id.ac.itb.lumen.core.HumanFaceRecognized
     */
    FACE_RECOGNITION('face.recognition'),
    ACTION_RECOGNITION('action.recognition'),
    SOCIAL_EXPRESSION('social.expression'),
    SOCIAL_PERCEPTION('social.perception')

    String keySuffix

    Channel(String keySuffix) {
        this.keySuffix = keySuffix;
    }

    def key(String agentId) {
        "lumen." + agentId + "." + keySuffix
    }

    @Override
    public String toString() {
        return keySuffix;
    }
}
