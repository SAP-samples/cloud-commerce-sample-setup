/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.deserializers;

import de.hybris.platform.core.Registry;
import de.hybris.platform.util.config.ConfigIntf;

import java.io.IOException;
import java.util.*;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;


/**
 * JSON Deserializer used for deserialize {@link String} values by applying XSS filtering rules.
 *
 * @since 2302
 */
public class TmaXssStringDeserializer extends StdDeserializer<String>
{
	private static final Logger LOG = Logger.getLogger(TmaXssStringDeserializer.class);
	private static final String B2CTELCOTMFWEBSERVICES_XSS_FILTER_ENABLED_FLAG = "b2ctelcotmfwebservices.xss.filter.enabled";
	private static final String PLATFORM_XSS_FILTER_ENABLED_FLAG = "xss.filter.enabled";
	private static final Pattern NULL_CHAR = Pattern.compile("\u0000");

	private final ConfigIntf config = Registry.getMasterTenant().getConfig();

	private List<Pattern> xssPatternDefinitions;

	public TmaXssStringDeserializer()
	{
		super(String.class);
		initXSSSettings();
	}

	/**
	 * Deserialize JSON {@link String} values by applying XSS filtering rules.
	 */
	@Override
	public String deserialize(JsonParser jsonParser, DeserializationContext deserializationContext)
			throws IOException, JsonProcessingException
	{
		if (jsonParser.hasToken(JsonToken.VALUE_STRING))
		{
			return filterXss(jsonParser.getText());
		}
		return (String) deserializationContext.handleUnexpectedToken(this._valueClass, jsonParser);
	}

	protected final void initXSSSettings()
	{
		String extensionXssFilter = config.getParameter(B2CTELCOTMFWEBSERVICES_XSS_FILTER_ENABLED_FLAG);
		boolean xssFilterEnabled = StringUtils.isEmpty(extensionXssFilter) ?
				Boolean.parseBoolean(config.getParameter(PLATFORM_XSS_FILTER_ENABLED_FLAG)) :
				Boolean.parseBoolean(extensionXssFilter);

		if (xssFilterEnabled)
		{
			this.xssPatternDefinitions = compilePatterns(getPatternDefinitions());
		}
	}


	protected Map<String, String> getPatternDefinitions()
	{
		Map rules = new LinkedHashMap(config.getParametersMatching("xss\\.filter\\.rule\\..*(?i)"));
		rules.putAll(config.getParametersMatching("webservicescommons\\.(xss\\.filter\\.rule\\..*(?i))", true));
		rules.putAll(config.getParametersMatching("b2ctelcotmfwebservices\\.(xss\\.filter\\.rule\\..*(?i))", true));
		return rules;
	}

	protected List<Pattern> compilePatterns(final Map<String, String> rules)
	{
		ArrayList patterns = new ArrayList(rules.size() + 1);
		patterns.add(NULL_CHAR);
		Iterator rulesIterator = rules.entrySet().iterator();

		while (rulesIterator.hasNext())
		{
			Map.Entry rule = (Map.Entry) rulesIterator.next();
			this.addCompiledRule(patterns, rule);
		}
		return patterns;
	}

	protected void addCompiledRule(final List patterns, final Map.Entry rule)
	{
		String expr = (String) rule.getValue();

		if (StringUtils.isEmpty(expr))
		{
			return;
		}

		try
		{
			patterns.add(Pattern.compile(expr));
		}
		catch (IllegalArgumentException error)
		{
			LOG.error("Error parsing xss rule " + rule, error);
		}
	}

	protected String filterXss(final String value)
	{
		String processedValue = value;
		Pattern scriptPattern;
		if (value != null && !value.isEmpty())
		{
			for (Iterator patternsIterator = this.xssPatternDefinitions.iterator(); patternsIterator
					.hasNext(); processedValue = scriptPattern.matcher(processedValue).replaceAll(""))
			{
				scriptPattern = (Pattern) patternsIterator.next();
			}
		}

		return processedValue;
	}
}
