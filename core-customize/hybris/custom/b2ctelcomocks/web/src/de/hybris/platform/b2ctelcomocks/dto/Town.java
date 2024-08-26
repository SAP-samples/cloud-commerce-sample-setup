/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * Town item
 */
@Schema(description = "Town item")
public class Town
{
	@JsonProperty("code")
	private String code = null;

	@JsonProperty("country")
	private String country = null;

	@JsonProperty("name")
	private String name = null;

	@JsonProperty("regionCode")
	private String regionCode = null;

	public Town code(String code)
	{
		this.code = code;
		return this;
	}

	/**
    * Get code
    *
    * @return code
    **/
	@Schema(description = "")

	public String getCode()
	{
		return code;
	}

	public void setCode(String code)
	{
		this.code = code;
	}

	public Town country(String country)
	{
		this.country = country;
		return this;
	}

	/**
    * Get country
    *
    * @return country
    **/
	@Schema(description = "")

	public String getCountry()
	{
		return country;
	}

	public void setCountry(String country)
	{
		this.country = country;
	}

	public Town name(String name)
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

	public Town regionCode(String regionCode)
	{
		this.regionCode = regionCode;
		return this;
	}

	/**
    * Get regionCode
    *
    * @return regionCode
    **/
	@Schema(description = "")

	public String getRegionCode()
	{
		return regionCode;
	}

	public void setRegionCode(String regionCode)
	{
		this.regionCode = regionCode;
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
		Town town = (Town) o;
		return Objects.equals(this.code, town.code) &&
				Objects.equals(this.country, town.country) &&
				Objects.equals(this.name, town.name) &&
				Objects.equals(this.regionCode, town.regionCode);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(code, country, name, regionCode);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class Town {\n");

		sb.append("    code: ").append(toIndentedString(code)).append("\n");
		sb.append("    country: ").append(toIndentedString(country)).append("\n");
		sb.append("    name: ").append(toIndentedString(name)).append("\n");
		sb.append("    regionCode: ").append(toIndentedString(regionCode)).append("\n");
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
