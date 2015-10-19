package org.lskk.lumen.core;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * Usage:
 *
 * <pre>
 * @Import(LumenCoreConfig.class)
 * </pre>
 *
 * Created by ceefour on 10/15/15.
 */
@Configuration
@ComponentScan("org.lskk.lumen.core.util")
public class LumenCoreConfig {
}
