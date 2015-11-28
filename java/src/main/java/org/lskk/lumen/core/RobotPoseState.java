package org.lskk.lumen.core;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by student on 11/28/2015.
 */
public class RobotPoseState implements LumenThing {
    private List<String> poseNames = new ArrayList<>();
    private String actualPoseAndTime;

    public List<String> getPoseNames() {
        return poseNames;
    }

    public String getActualPoseAndTime() {
        return actualPoseAndTime;
    }

    public void setActualPoseAndTime(String actualPoseAndTime) {
        this.actualPoseAndTime = actualPoseAndTime;
    }

    @Override
    public String toString() {
        return "RobotPoseState{" +
                "poseNames=" + poseNames +
                ", actualPoseAndTime='" + actualPoseAndTime + '\'' +
                '}';
    }
}
