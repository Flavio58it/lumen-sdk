package org.lskk.lumen.core;

import java.util.ArrayList;
import java.util.List;

/**
 * Sequential animation of commands, usually motion (JointInterpolateAngle) but can also use ActingPerformance,CommunicateAction, etc.
 *
 * <p>Melakukan animasi secara sekuensial. Isi frames yang didukung adalah:</p>
 *
 * <ul>
 *     <li>{@link JointInterpolateAngle}</li>
 *     <li>{@link CommunicateAction}</li>
 *     <li>{@link Rest}</li>
 *     <li>{@link WakeUp}</li>
 *     <li>{@link MoveTo}</li>
 *     <li>{@link AudioObject}</li>
 *     <li>{@link LedOperation}</li>
 *     <li>{@link ActingPerformance}</li>
 * </ul>
 *
 * Created by ceefour on 28/11/2015.
 */
public class Animation implements LumenThing {
    private List<LumenThing> frames = new ArrayList<>();

    public List<LumenThing> getFrames() {
        return frames;
    }

    @Override
    public String toString() {
        return "Animation{" +
                "frames=" + frames +
                '}';
    }
}
