/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;


/**
 * The type of the technical resource.
 */
public enum TechnicalResourceType
{
	DIVISION("DIVISION"),
	INSTALLATION("INSTALLATION"),
	METER("METER"),
	READING_TYPE("READING_TYPE");

	private String value;

	TechnicalResourceType(String value)
	{
		this.value = value;
	}

	@Override
	@JsonValue
	public String toString()
	{
		return String.valueOf(value);
	}

	@JsonCreator
	public static TechnicalResourceType fromValue(String text)
	{
		for (TechnicalResourceType b : TechnicalResourceType.values())
		{
			if (String.valueOf(b.value).equals(text))
			{
				return b;
			}
		}
		return null;
	}
}
