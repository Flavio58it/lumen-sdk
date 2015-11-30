package org.lskk.lumen.core;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by student on 11/28/2015.
 */
public class RobotPoseState implements LumenThing {
    private List<String> poseNames = new ArrayList<>();
    private String actualPoseName;
    private Float actualPoseTime;

    public List<String> getPoseNames() {
        return poseNames;
    }

    @Override
    public String toString() {
        return "RobotPoseState{" +
                "poseNames=" + poseNames +
                ", actualPoseName='" + actualPoseName + '\'' +
                ", actualPoseTime=" + actualPoseTime +
                '}';
    }

    public String getActualPoseName() {
        return actualPoseName;
    }

    public void setActualPoseName(String actualPoseName) {
        this.actualPoseName = actualPoseName;
    }

    public Float getActualPoseTime() {
        return actualPoseTime;
    }

    public void setActualPoseTime(Float actualPoseTime) {
        this.actualPoseTime = actualPoseTime;
    }
}
