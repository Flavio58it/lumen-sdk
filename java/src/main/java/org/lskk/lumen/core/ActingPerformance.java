package org.lskk.lumen.core;

public class ActingPerformance implements LumenThing {

    private ActingScript script;

    public ActingScript getScript() {
        return script;
    }

    public void setScript(ActingScript script) {
        this.script = script;
    }

    @Override
    public String toString() {
        return "ActingPerformance{" +
                "script=" + script +
                '}';
    }
}
