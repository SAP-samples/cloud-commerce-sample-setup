/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import java.util.Objects;

import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * PremiseAddress item
 */
@Schema(description = "PremiseAddress item")
public class PremiseAddress
{
	@JsonProperty("streetDetail")
	private Street streetDetail = null;

	@JsonProperty("townDetail")
	private Town townDetail = null;

	public PremiseAddress streetDetail(Street streetDetail)
	{
		this.streetDetail = streetDetail;
		return this;
	}

	/**
    * Get streetDetail
    *
    * @return streetDetail
    **/
	@Schema(description = "")

	@Valid
	public Street getStreetDetail()
	{
		return streetDetail;
	}

	public void setStreetDetail(Street streetDetail)
	{
		this.streetDetail = streetDetail;
	}

	public PremiseAddress townDetail(Town townDetail)
	{
		this.townDetail = townDetail;
		return this;
	}

	/**
    * Get townDetail
    *
    * @return townDetail
    **/
	@Schema(description = "")

	@Valid
	public Town getTownDetail()
	{
		return townDetail;
	}

	public void setTownDetail(Town townDetail)
	{
		this.townDetail = townDetail;
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
		PremiseAddress premiseAddress = (PremiseAddress) o;
		return Objects.equals(this.streetDetail, premiseAddress.streetDetail) &&
				Objects.equals(this.townDetail, premiseAddress.townDetail);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(streetDetail, townDetail);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class PremiseAddress {\n");

		sb.append("    streetDetail: ").append(toIndentedString(streetDetail)).append("\n");
		sb.append("    townDetail: ").append(toIndentedString(townDetail)).append("\n");
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
