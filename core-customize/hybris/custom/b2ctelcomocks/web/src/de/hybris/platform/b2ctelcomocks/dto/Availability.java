/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import java.util.Objects;

import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * Availability
 */
@Schema(description = "Availability")
public class Availability
{
	@JsonProperty("appliedResourceCapacity")
	private AppliedResourceCapacity appliedResourceCapacity = null;

	public Availability appliedResourceCapacity(AppliedResourceCapacity appliedResourceCapacity)
	{
		this.appliedResourceCapacity = appliedResourceCapacity;
		return this;
	}

	/**
    * Get appliedResourceCapacity
    *
    * @return appliedResourceCapacity
    **/
	@Schema(description = "")

	@Valid
	public AppliedResourceCapacity getAppliedResourceCapacity()
	{
		return appliedResourceCapacity;
	}

	public void setAppliedResourceCapacity(AppliedResourceCapacity appliedResourceCapacity)
	{
		this.appliedResourceCapacity = appliedResourceCapacity;
	}


	@Override
	public boolean equals(Object o)
	{
		if (this == o)
		{
			return true;
		}
		if (o == null || getClass() != o.getClass())
		{
			return false;
		}
		Availability availability = (Availability) o;
		return Objects.equals(this.appliedResourceCapacity, availability.appliedResourceCapacity);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(appliedResourceCapacity);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class Availability {\n");

		sb.append("    appliedResourceCapacity: ").append(toIndentedString(appliedResourceCapacity)).append("\n");
		sb.append("}");
		return sb.toString();
	}

	/**
    * Convert the given object to string with each line indented by 4 spaces
    * (except the first line).
    */
	private String toIndentedString(Object o)
	{
		if (o == null)
		{
			return "null";
		}
		return o.toString().replace("\n", "\n    ");
	}
}
