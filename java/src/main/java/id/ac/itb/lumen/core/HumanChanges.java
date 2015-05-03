package id.ac.itb.lumen.core;

import java.util.ArrayList;
import java.util.List;

/**
 * DUMMY
 * Created by ceefour on 03/05/2015.
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
