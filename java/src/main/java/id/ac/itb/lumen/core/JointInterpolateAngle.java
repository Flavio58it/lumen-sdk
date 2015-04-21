package id.ac.itb.lumen.core;

/**
 * Created by ceefour on 21/04/2015.
 */
public class JointInterpolateAngle implements LumenThing {

    public static enum JointId {
        // Head
        HeadYaw,
        HeadPitch,
        // RArm
        RShoulderRoll,
        RShoulderPitch,
        RElbowYaw,
        RElbowRoll,
        RWristYaw,
        RHand,
        // LArm
        LShoulderRoll,
        LShoulderPitch,
        LElbowYaw,
        LElbowRoll,
        LWristYaw,
        LHand,
        // RLeg
        RHipPitch,
        RHipRoll,
        RKneePitch,
        RAnklePitch,
        RAnkleRoll,
        // LLeg
        LHipYawPitch,
        LHipPitch,
        LHipRoll,
        LKneePitch,
        LAnklePitch,
        LAnkleRoll
    }

    private JointId jointId;
    private Double targetCcwDeg;
    private Double duration;

    /**
     * Joint ID.
     * @return
     */
    public JointId getJointId() {
        return jointId;
    }

    public void setJointId(JointId jointId) {
        this.jointId = jointId;
    }

    /**
     * Target angle (CCW), in degrees.
     * @return
     */
    public Double getTargetCcwDeg() {
        return targetCcwDeg;
    }

    public void setTargetCcwDeg(Double targetCcwDeg) {
        this.targetCcwDeg = targetCcwDeg;
    }

    /**
     * Duration, in seconds.
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
        return "JointInterpolateAngle{" +
                "jointId='" + jointId + '\'' +
                ", targetCcwDeg=" + targetCcwDeg +
                ", duration=" + duration +
                '}';
    }
}
