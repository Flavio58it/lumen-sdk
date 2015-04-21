package id.ac.itb.lumen.core;

/**
 * Created by ceefour on 21/04/2015.
 */
public class AudioVolume implements LumenThing {
    double volume;

    /**
     * Range: 0.0 (silence) to 1.0 (full volume).
     * @return
     */
    public double getVolume() {
        return volume;
    }

    public void setVolume(double volume) {
        this.volume = volume;
    }

    @Override
    public String toString() {
        return "AudioVolume{" +
                "volume=" + volume +
                '}';
    }
}
