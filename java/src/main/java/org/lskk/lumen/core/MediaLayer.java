package org.lskk.lumen.core;

/**
 * Used by {@link AudioObject} to specify which layer the audio applies to.
 * Created by ceefour on 20/11/2015.
 */
public enum MediaLayer {
    /**
     * Audio containing speech (can be synthesized using TTS).
     */
    SPEECH,
    /**
     * Audio containing emotional expression (aah, ooh, gasp, etc.) which are usually not a sentence.
     */
    EMOTION,
    /**
     * Audio containing sound effects.
     */
    EFFECT,
    /**
     * Audio containing foreground music.
     */
    FOREGROUND,
    /**
     * Audio containing background music.
     */
    BACKGROUND,
    /**
     * Audio containing ambience (wind, sea, trees, crowd, etc.).
     */
    AMBIENCE
}
