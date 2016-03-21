package org.lskk.lumen.core;

/**
 * Created by ceefour on 07/03/2016.
 * @see LumenProperty
 */
public enum LumenType {
    xsd_string("xsd:string"),
    xsd_integer("xsd:integer"),
    xsd_float("xsd:float"),
    xs_date("xs:date"),
    yago_yagoQuantity("yago:yagoQuantity"),
    yago_wordnet_sex_105006898("yago:wordnet_sex_105006898"),
    yago_wordnet_religion_105946687("yago:wordnet_religion_105946687");

    private String qName;

    LumenType(String qName) {
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
