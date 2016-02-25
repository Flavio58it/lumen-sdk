package org.lskk.lumen.core;

import java.util.Comparator;
import java.util.Optional;

/**
 * Sorts highest-first by default.
 * Created by ceefour on 25/02/2016.
 */
public class ConfidenceComparator implements Comparator<IConfidenceAware> {
    @Override
    public int compare(IConfidenceAware o1, IConfidenceAware o2) {
        return (int) (Math.signum(Optional.ofNullable(o2.getConfidence()).orElse(0f) -
                Optional.ofNullable(o1.getConfidence()).orElse(0f)));
    }
}
