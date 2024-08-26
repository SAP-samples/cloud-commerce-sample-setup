/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import de.hybris.platform.tuawebservicesresources.v2.dto.ResourceRef;

import java.util.Objects;

import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * Value resource
 */
@Schema(description = "Value resource")
public class ValueRef
{
	@JsonProperty("op")
	private String op = null;

	@JsonProperty("value")
	private ResourceRef value = null;

	public ValueRef op(String op)
	{
		this.op = op;
		return this;
	}

	/**
    * Get op
    *
    * @return op
    **/
	@Schema(description = "")

	public String getOp()
	{
		return op;
	}

	public void setOp(String op)
	{
		this.op = op;
	}

	public ValueRef value(ResourceRef value)
	{
		this.value = value;
		return this;
	}

	/**
    * Get value
    *
    * @return value
    **/
	@Schema(description = "")

	@Valid
	public ResourceRef getValue()
	{
		return value;
	}

	public void setValue(ResourceRef value)
	{
		this.value = value;
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
		ValueRef valueRef = (ValueRef) o;
		return Objects.equals(this.op, valueRef.op) &&
				Objects.equals(this.value, valueRef.value);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(op, value);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class ValueRef {\n");

		sb.append("    op: ").append(toIndentedString(op)).append("\n");
		sb.append("    value: ").append(toIndentedString(value)).append("\n");
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
