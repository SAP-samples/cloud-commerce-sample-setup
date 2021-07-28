/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.util;

import de.hybris.platform.commerceservices.util.QuoteExpirationTimeUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import org.apache.commons.lang.StringUtils;


/**
 * Utility class for converting quote expiration time.
 */
public final class QuoteExpirationTimeConverter
{
	private QuoteExpirationTimeConverter()
	{
		throw new IllegalAccessError("Utility class may not be instantiated");
	}

	/**
	 * Converts quote expiration time from {@link Date} to {@link String}.
	 *
	 * @param date
	 *           the date to be converted
	 * @param pattern
	 *           the date pattern to be used for conversion
	 * @param locale
	 *           the locale to be used for conversion
	 * @return null or the string representation of the date as per provided date pattern
	 */
	public static String convertDateToString(final Date date, final String pattern, final Locale locale)
	{
		if (date == null)
		{
			return null;
		}

		final SimpleDateFormat dateFormat = new SimpleDateFormat(pattern, locale);
		return dateFormat.format(date);
	}

	/**
	 * Converts quote expiration time from {@link String} to {@link Date} by adjusting the time part to end of day
	 * (23:59:59).
	 *
	 * @param date
	 *           the string representation of quote expiration time
	 * @param pattern
	 *           the date pattern to be used for conversion
	 * @param locale
	 *           the locale to be used for conversion
	 * @return null if the string representation of expiration time is null or empty, otherwise the {@link Date} object
	 */
	public static Date convertStringToDate(final String date, final String pattern, final Locale locale)
	{
		if (StringUtils.isEmpty(date))
		{
			return null;
		}

		final SimpleDateFormat dateFormat = new SimpleDateFormat(pattern, locale);

		try
		{
			return QuoteExpirationTimeUtils.getEndOfDay(dateFormat.parse(date));
		}
		catch (final ParseException e)
		{
			throw new IllegalArgumentException(String.format("Failed to parse date [%s] using [%s] parsing format.", date, pattern),
					e);
		}
	}
}
