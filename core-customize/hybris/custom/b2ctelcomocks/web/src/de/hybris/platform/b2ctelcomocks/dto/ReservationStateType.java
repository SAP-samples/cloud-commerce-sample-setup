/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;


/**
 * State Type of the reservation.
 */
public enum ReservationStateType
{
	INITIALIZED("INITIALIZED"),
	CONFIRMED("CONFIRMED"),
	CANCELLED("CANCELLED"),
	COMPLETED("COMPLETED"),
	FAILED("FAILED"),
	REJECTED("REJECTED");

	private String value;

	ReservationStateType(String value)
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
	public static ReservationStateType fromValue(String text)
	{
		for (ReservationStateType b : ReservationStateType.values())
		{
			if (String.valueOf(b.value).equals(text))
			{
				return b;
			}
		}
		return null;
	}
}
