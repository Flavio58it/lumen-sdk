package org.lskk.lumen.core;

/**
 * Created by ceefour on 20/04/2015.
 */
public class MoveTo implements LumenThing {

    private double backDistance;
    private double rightDistance;
    private double turnCcwDeg;

    public double getBackDistance() {
        return backDistance;
    }

    public void setBackDistance(double backDistance) {
        this.backDistance = backDistance;
    }

    public double getRightDistance() {
        return rightDistance;
    }

    public void setRightDistance(double rightDistance) {
        this.rightDistance = rightDistance;
    }

    public double getTurnCcwDeg() {
        return turnCcwDeg;
    }

    public void setTurnCcwDeg(double turnCcwDeg) {
        this.turnCcwDeg = turnCcwDeg;
    }

    @Override
    public String toString() {
        return "MoveTo{" +
                "backDistance=" + backDistance +
                ", rightDistance=" + rightDistance +
                ", turnCcwDeg=" + turnCcwDeg +
                '}';
    }
}
