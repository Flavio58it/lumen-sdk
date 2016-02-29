package org.lskk.lumen.core;

import com.google.common.base.MoreObjects;

/**
 * Created by ceefour on 29/02/2016.
 */
public enum LumenProperty {
    rdfs_label("rdfs:label"),
    skos_prefLabel("skos:prefLabel"),
    yago_isPreferredMeaningOf("yago:isPreferredMeaningOf"),
    yago_hasGivenName("yago:hasGivenName"),
    yago_hasFamilyName("yago:hasFamilyName"),
    yago_hasGloss("yago:hasGloss"),
    yago_wasBornOnDate("yago:wasBornOnDate");

    private String qName;

    LumenProperty(String qName) {
        this.qName = qName;
    }

    public String getQName() {
        return qName;
    }

    @Override
    public String toString() {
        return qName;
    }
}
