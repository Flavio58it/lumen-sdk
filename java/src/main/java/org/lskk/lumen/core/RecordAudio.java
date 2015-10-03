package org.lskk.lumen.core;

/**
 * http://doc.aldebaran.com/1-14/naoqi/audio/alaudioplayer-api.html
 */
public class RecordAudio implements LumenThing {

    private Double duration;

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

    @Override
    public String toString() {
        return "RecordAudio{" +
                "duration=" + duration +
                '}';
    }
}
