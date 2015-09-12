package id.ac.itb.lumen.core;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by ceefour on 19/01/15.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type", defaultImpl = TactileSetLegacy.class)
@JsonSubTypes(@JsonSubTypes.Type(name = "TactileSetLegacy", value = TactileSetLegacy.class))
public class TactileSetLegacy {
    public List<String> getNames() {
        return names;
    }

    public void setNames(List<String> names) {
        this.names = names;
    }

    public List<Double> getValues() {
        return values;
    }

    public void setValues(List<Double> values) {
        this.values = values;
    }

    @JsonProperty("name")
    private List<String> names = new ArrayList<String>();
    @JsonProperty("value")
    private List<Double> values = new ArrayList<Double>();
}
