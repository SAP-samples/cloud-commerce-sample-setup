package de.hybris.platform.b2ctelcomocks.config;

import de.hybris.platform.servicelayer.config.ConfigurationService;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.DelegatingWebMvcConfiguration;
import org.springframework.web.servlet.mvc.annotation.ResponseStatusExceptionResolver;
import org.springframework.web.servlet.mvc.method.annotation.ExceptionHandlerExceptionResolver;
import org.springframework.web.servlet.mvc.support.DefaultHandlerExceptionResolver;


/**
 * Spring configuration which replace <mvc:annotation-driven> tag. It allows override default
 * RequestMappingHandlerMapping with our own mapping handler
 */

@Configuration
@ImportResource({ "WEB-INF/springmvc-servlet.xml" })
public class B2ctelcomocksSwaggerConfig extends DelegatingWebMvcConfiguration
{
	private static final String LEGACY_CONTENT_NEGOTIATION = "b2ctelcomocks.content.negotiation.legacy";

	@Resource(name = "configurationService")
	private ConfigurationService configurationService;

	@Resource(name = "tmaV3JsonHttpMessageConverter")
	private MappingJackson2HttpMessageConverter tmaV3JsonHttpMessageConverter;

	@Resource(name = "tmaStringHttpMessageConverter")
	private StringHttpMessageConverter messageConverter;

	private ApplicationContext applicationContext;

	@Resource(name = "exceptionResolvers")
	private List<HandlerExceptionResolver> exceptionResolvers;

	@Override
	public void setApplicationContext(final ApplicationContext applicationContext) throws BeansException
	{
		super.setApplicationContext(applicationContext);
		this.applicationContext = applicationContext;
	}

	@Override
	public void configureContentNegotiation(final ContentNegotiationConfigurer configurer)
	{
		if (isLegacyContentNegotiationEnabled())
		{
			configurer.favorPathExtension(false).favorParameter(true);
		}
	}

	@Override
	protected void configureHandlerExceptionResolvers(final List<HandlerExceptionResolver> exceptionResolvers)
	{
		final ExceptionHandlerExceptionResolver exceptionHandlerExceptionResolver = new ExceptionHandlerExceptionResolver();
		exceptionHandlerExceptionResolver.setApplicationContext(applicationContext);
		exceptionHandlerExceptionResolver.setContentNegotiationManager(mvcContentNegotiationManager());
		exceptionHandlerExceptionResolver.setMessageConverters(getMessageConverters());
		exceptionHandlerExceptionResolver.afterPropertiesSet();

		exceptionResolvers.add(exceptionHandlerExceptionResolver);
		exceptionResolvers.addAll(this.exceptionResolvers);
		exceptionResolvers.add(new ResponseStatusExceptionResolver());
		exceptionResolvers.add(new DefaultHandlerExceptionResolver());
	}

	protected boolean isLegacyContentNegotiationEnabled()
	{
		return configurationService.getConfiguration().getBoolean(LEGACY_CONTENT_NEGOTIATION, false);
	}

	@Override
	public void configureMessageConverters(List<HttpMessageConverter<?>> converters)
	{
		converters.add(messageConverter);
		converters.add(tmaV3JsonHttpMessageConverter);
		super.addDefaultHttpMessageConverters(this.getMessageConverters());
	}
}
