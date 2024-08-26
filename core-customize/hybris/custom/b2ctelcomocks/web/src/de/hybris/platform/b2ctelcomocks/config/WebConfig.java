package de.hybris.platform.b2ctelcomocks.config;

import de.hybris.platform.swagger.ApiDocInfo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;


@Configuration
@ImportResource(value = "classpath*:/swagger/swaggerintegration/web/spring/*-web-spring.xml")
public class WebConfig
{
	@Bean("apiDocInfo")
	public ApiDocInfo apiDocInfo()
	{
		return () -> "b2ctelcomocks";
	}

}