/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * Street item
 */
@Schema(description = "Street item")
public class Street
{
	@JsonProperty("name")
	private String name = null;

	@JsonProperty("number")
	private String number = null;

	@JsonProperty("suite")
	private String suite = null;

	public Street name(String name)
	{
		this.name = name;
		return this;
	}

	/**
    * Get name
    *
    * @return name
    **/
	@Schema(description = "")

	public String getName()
	{
		return name;
	}

	public void setName(String name)
	{
		this.name = name;
	}

	public Street number(String number)
	{
		this.number = number;
		return this;
	}

	/**
    * Get number
    *
    * @return number
    **/
	@Schema(description = "")

	public String getNumber()
	{
		return number;
	}

	public void setNumber(String number)
	{
		this.number = number;
	}

	public Street suite(String suite)
	{
		this.suite = suite;
		return this;
	}

	/**
    * Get suite
    *
    * @return suite
    **/
	@Schema(description = "")

	public String getSuite()
	{
		return suite;
	}

	public void setSuite(String suite)
	{
		this.suite = suite;
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
		Street street = (Street) o;
		return Objects.equals(this.name, street.name) &&
				Objects.equals(this.number, street.number) &&
				Objects.equals(this.suite, street.suite);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(name, number, suite);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class Street {\n");

		sb.append("    name: ").append(toIndentedString(name)).append("\n");
		sb.append("    number: ").append(toIndentedString(number)).append("\n");
		sb.append("    suite: ").append(toIndentedString(suite)).append("\n");
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
