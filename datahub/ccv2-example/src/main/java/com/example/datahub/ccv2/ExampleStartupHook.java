package com.example.datahub.ccv2;

import java.util.Properties;
import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ExampleStartupHook {    
    private static final Logger log = LoggerFactory.getLogger(ExampleStartupHook.class);

    @PostConstruct
    public void afterPropertiesSet() {
        log.info("Example Startup Hook");
    }

}