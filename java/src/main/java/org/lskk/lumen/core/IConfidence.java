package org.lskk.lumen.core;

import java.util.Optional;

/**
 * Created by ceefour on 25/02/2016.
 */
public interface IConfidence {
    Float getConfidence();

    /**
     * Sorts highest-first by default.
     * Created by ceefour on 25/02/2016.
     */
    class Comparator implements java.util.Comparator<IConfidence> {
        @Override
        public int compare(IConfidence o1, IConfidence o2) {
            return (int) (Math.signum(Optional.ofNullable(o2.getConfidence()).orElse(0f) -
                    Optional.ofNullable(o1.getConfidence()).orElse(0f)));
        }
    }
}
