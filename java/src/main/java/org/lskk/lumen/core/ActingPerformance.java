package org.lskk.lumen.core;

public class ActingPerformance implements LumenThing {

    private ActingScript script;
    private Boolean restAfterPerformance;

    public ActingScript getScript() {
        return script;
    }

    public void setScript(ActingScript script) {
        this.script = script;
    }

    /**
     * Default is true.
     * @return
     */
    public Boolean getRestAfterPerformance() {
        return restAfterPerformance;
    }

    public void setRestAfterPerformance(Boolean restAfterPerformance) {
        this.restAfterPerformance = restAfterPerformance;
    }

    @Override
    public String toString() {
        return "ActingPerformance{" +
                "script=" + script +
                ", restAfterPerformance=" + restAfterPerformance +
                '}';
    }
}
