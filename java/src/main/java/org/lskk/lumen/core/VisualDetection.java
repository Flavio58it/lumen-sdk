package org.lskk.lumen.core;

import java.util.ArrayList;
import java.util.List;

/**
 * Hasil dari deteksi atau pengenalan visual.
 * @see PhysicalEntity
 */
public class VisualDetection implements LumenThing {

    /**
     * List of detected physical entities, each with its own truth value.
     * @return
     */
    private List<PhysicalEntity> physicalEntities = new ArrayList<>();
    /**
     * List of detected scenes, each with its own truth value.
     * @return
     */
    private List<Scene> scenes = new ArrayList<>();

    public List<PhysicalEntity> getPhysicalEntities() {
        return physicalEntities;
    }

    public List<Scene> getScenes() {
        return scenes;
    }

    @Override
    public String toString() {
        return "VisualDetection{" +
                "physicalEntities=" + physicalEntities +
                ", scenes=" + scenes +
                '}';
    }
}
