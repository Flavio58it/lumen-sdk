package org.lskk.lumen.core;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Sigit on 03/05/2015.
 */
public class HumanChanges implements LumenThing {

    private List<HumanDetected> humanDetecteds = new ArrayList<>();
    private List<HumanMoving> humanMovings = new ArrayList<>();

    public List<HumanDetected> getHumanDetecteds() {
        return humanDetecteds;
    }

    public List<HumanMoving> getHumanMovings() {
        return humanMovings;
    }

}
