/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import java.util.Objects;

import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * InstallationAddress item
 */
@Schema(description = "InstallationAddress item")
public class PremiseDetails
{
	@JsonProperty("premiseAddress")
	private PremiseAddress premiseAddress = null;

	@JsonProperty("serialNumber")
	private String serialNumber = null;

	@JsonProperty("division")
	private String division = null;

	public PremiseDetails premiseAddress(PremiseAddress premiseAddress)
	{
		this.premiseAddress = premiseAddress;
		return this;
	}

	/**
    * Get premiseAddress
    *
    * @return premiseAddress
    **/
	@Schema(description = "")

	@Valid
	public PremiseAddress getPremiseAddress()
	{
		return premiseAddress;
	}

	public void setPremiseAddress(PremiseAddress premiseAddress)
	{
		this.premiseAddress = premiseAddress;
	}

	public PremiseDetails serialNumber(String serialNumber)
	{
		this.serialNumber = serialNumber;
		return this;
	}

	/**
    * Get serialNumber
    *
    * @return serialNumber
    **/
	@Schema(description = "")

	public String getSerialNumber()
	{
		return serialNumber;
	}

	public void setSerialNumber(String serialNumber)
	{
		this.serialNumber = serialNumber;
	}

	public PremiseDetails division(String division)
	{
		this.division = division;
		return this;
	}

	/**
    * Get division
    *
    * @return division
    **/
	@Schema(description = "")

	public String getDivision()
	{
		return division;
	}

	public void setDivision(String division)
	{
		this.division = division;
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
		PremiseDetails premiseDetails = (PremiseDetails) o;
		return Objects.equals(this.premiseAddress, premiseDetails.premiseAddress) &&
				Objects.equals(this.serialNumber, premiseDetails.serialNumber) &&
				Objects.equals(this.division, premiseDetails.division);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(premiseAddress, serialNumber, division);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class PremiseDetails {\n");

		sb.append("    premiseAddress: ").append(toIndentedString(premiseAddress)).append("\n");
		sb.append("    serialNumber: ").append(toIndentedString(serialNumber)).append("\n");
		sb.append("    division: ").append(toIndentedString(division)).append("\n");
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
