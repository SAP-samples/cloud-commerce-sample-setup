/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;


/**
 * Status Type of the appointment.
 */
public enum AppointmentStateType
{
	INITIALIZED("INITIALIZED"),
	CONFIRMED("CONFIRMED"),
	CANCELLED("CANCELLED"),
	COMPLETED("COMPLETED"),
	FAILED("FAILED");

	private String value;

	AppointmentStateType(String value)
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
	public static AppointmentStateType fromValue(String text)
	{
		for (AppointmentStateType b : AppointmentStateType.values())
		{
			if (String.valueOf(b.value).equals(text))
			{
				return b;
			}
		}
		return null;
	}
}
