/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * ResourceCapacityDemand
 */
@Schema(description = "ResourceCapacityDemand")
public class ResourceCapacityDemand
{
	@JsonProperty("capacityDemandAmount")
	private Float capacityDemandAmount = null;

	@JsonProperty("@type")
	private String type = null;

	public ResourceCapacityDemand capacityDemandAmount(Float capacityDemandAmount)
	{
		this.capacityDemandAmount = capacityDemandAmount;
		return this;
	}

	/**
    * A positive floating point number
    *
    * @return capacityDemandAmount
    **/
	@Schema(description = "A positive floating point number")

	public Float getCapacityDemandAmount()
	{
		return capacityDemandAmount;
	}

	public void setCapacityDemandAmount(Float capacityDemandAmount)
	{
		this.capacityDemandAmount = capacityDemandAmount;
	}

	public ResourceCapacityDemand type(String type)
	{
		this.type = type;
		return this;
	}

	/**
    * Get type
    *
    * @return type
    **/
	@Schema(description = "")

	public String getType()
	{
		return type;
	}

	public void setType(String type)
	{
		this.type = type;
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
		ResourceCapacityDemand resourceCapacityDemand = (ResourceCapacityDemand) o;
		return Objects.equals(this.capacityDemandAmount, resourceCapacityDemand.capacityDemandAmount) &&
				Objects.equals(this.type, resourceCapacityDemand.type);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(capacityDemandAmount, type);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class ResourceCapacityDemand {\n");

		sb.append("    capacityDemandAmount: ").append(toIndentedString(capacityDemandAmount)).append("\n");
		sb.append("    type: ").append(toIndentedString(type)).append("\n");
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
