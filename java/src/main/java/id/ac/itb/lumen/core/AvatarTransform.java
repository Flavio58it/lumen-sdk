package id.ac.itb.lumen.core;

/**
 * Inform the current position and/or rotation of the avatar.
 * Created by Sigit on 23/04/2015.
 */
public class AvatarTransform implements LumenThing {
    private Vector3 position;
    private Rotation3 rotation;

    public Vector3 getPosition() {
        return position;
    }

    public void setPosition(Vector3 position) {
        this.position = position;
    }

    public Rotation3 getRotation() {
        return rotation;
    }

    public void setRotation(Rotation3 rotation) {
        this.rotation = rotation;
    }

    @Override
    public String toString() {
        return "AvatarTransform{" +
                "position=" + position +
                ", rotation=" + rotation +
                '}';
    }
}
