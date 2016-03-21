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
 * <p>You usually want {@link RabbitMqConfig} as well.</p>
 *
 * Created by ceefour on 10/15/15.
 *
 * @see RabbitMqConfig
 */
@Configuration
@ComponentScan("org.lskk.lumen.core.util")
public class LumenCoreConfig {
}
