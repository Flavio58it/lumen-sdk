package org.lskk.lumen.core.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.guava.GuavaModule;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import com.google.common.base.Throwables;
import org.apache.camel.Body;
import org.apache.camel.CamelContext;
import org.apache.camel.Exchange;
import org.apache.camel.TypeConversionException;
import org.apache.camel.support.TypeConverterSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.io.IOException;
import java.io.Serializable;
import java.nio.charset.StandardCharsets;
import java.util.function.Function;

/**
 * Created by ceefour on 19/01/15.
 */
@Service
public class ToJson extends TypeConverterSupport implements Function<Object, String> {

    private static final Logger log = LoggerFactory.getLogger(ToJson.class);

    @Inject
    protected ObjectMapper mapper;
    @Autowired(required = false)
    private CamelContext camel;

//    public ToJson() {
//        mapper = new ObjectMapper();
//        mapper.registerModule(new JodaModule());
//        mapper.registerModule(new GuavaModule());
//        mapper.enable(SerializationFeature.INDENT_OUTPUT);
//        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
//    }

    @Override
    public String apply(@Body Object o) {
        try {
            return o != null ? mapper.writeValueAsString(o) : null;
        } catch (JsonProcessingException e) {
            Throwables.propagate(e);
            return null;
        }
    }

    public ObjectMapper getMapper() {
        return mapper;
    }

    @Override
    public <T> T convertTo(Class<T> type, Exchange exchange, Object value) throws TypeConversionException {
        if (value instanceof byte[] && Serializable.class.isAssignableFrom(type)) {
            try {
                return mapper.readValue((byte[]) value, type);
            } catch (Exception e) {
                throw new TypeConversionException("Cannot deserialize JSON from " + new String((byte[]) value, StandardCharsets.UTF_8),
                        type, e);
            }
        } else if (value instanceof Serializable && byte[].class == type) {
            try {
                return (T) mapper.writeValueAsBytes(value);
            } catch (Exception e) {
                throw new TypeConversionException("Cannot serialize JSON from " + value, type, e);
            }
        } else {
            return null;
        }
    }

    @PostConstruct
    public void init() {
        if (camel != null) {
            camel.getTypeConverterRegistry().addFallbackTypeConverter(this, false);
        } else {
            log.warn("CamelContext not found, not registering fallback type converter");
        }
    }
}
