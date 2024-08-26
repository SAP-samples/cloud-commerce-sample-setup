/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * Related Entity reference. A related place defines a place described by reference or by value linked to a specific entity.
 */
@Schema(description = "Related Entity reference. A related place defines a place described by reference or by value linked to a specific entity.")
public class RelatedPlaceRefOrValue
{
	@JsonProperty("role")
	private String role = null;

	@JsonProperty("city")
	private String city = null;

	@JsonProperty("postcode")
	private String postcode = null;

	@JsonProperty("streetName")
	private String streetName = null;

	@JsonProperty("streetType")
	private String streetType = null;

	@JsonProperty("streetNr")
	private String streetNr = null;

	@JsonProperty("country")
	private String country = null;

	@JsonProperty("stateOfProvince")
	private String stateOfProvince = null;

	@JsonProperty("geographicAddress")
	@Valid
	private List<GeographicAddress> geographicAddress = null;

	@JsonProperty("@type")
	private String atType = null;

	public RelatedPlaceRefOrValue role(String role)
	{
		this.role = role;
		return this;
	}

	/**
    * Role played by the related party
    *
    * @return role
    **/
	@Schema(description = "Role played by the related party")

	public String getRole()
	{
		return role;
	}

	public void setRole(String role)
	{
		this.role = role;
	}

	public RelatedPlaceRefOrValue city(String city)
	{
		this.city = city;
		return this;
	}

	/**
    * The city
    *
    * @return city
    **/
	@Schema(description = "The city")

	public String getCity()
	{
		return city;
	}

	public void setCity(String city)
	{
		this.city = city;
	}

	public RelatedPlaceRefOrValue postcode(String postcode)
	{
		this.postcode = postcode;
		return this;
	}

	/**
    * The postcode
    *
    * @return postcode
    **/
	@Schema(description = "The postcode")

	public String getPostcode()
	{
		return postcode;
	}

	public void setPostcode(String postcode)
	{
		this.postcode = postcode;
	}

	public RelatedPlaceRefOrValue streetName(String streetName)
	{
		this.streetName = streetName;
		return this;
	}

	/**
    * Get streetName
    *
    * @return streetName
    **/
	@Schema(description = "")

	public String getStreetName()
	{
		return streetName;
	}

	public void setStreetName(String streetName)
	{
		this.streetName = streetName;
	}

	public RelatedPlaceRefOrValue streetType(String streetType)
	{
		this.streetType = streetType;
		return this;
	}

	/**
    * Get streetType
    *
    * @return streetType
    **/
	@Schema(description = "")

	public String getStreetType()
	{
		return streetType;
	}

	public void setStreetType(String streetType)
	{
		this.streetType = streetType;
	}

	public RelatedPlaceRefOrValue streetNr(String streetNr)
	{
		this.streetNr = streetNr;
		return this;
	}

	/**
    * Get streetNr
    *
    * @return streetNr
    **/
	@Schema(description = "")

	public String getStreetNr()
	{
		return streetNr;
	}

	public void setStreetNr(String streetNr)
	{
		this.streetNr = streetNr;
	}

	public RelatedPlaceRefOrValue country(String country)
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

	public RelatedPlaceRefOrValue stateOfProvince(String stateOfProvince)
	{
		this.stateOfProvince = stateOfProvince;
		return this;
	}

	/**
    * Get stateOfProvince
    *
    * @return stateOfProvince
    **/
	@Schema(description = "")

	public String getStateOfProvince()
	{
		return stateOfProvince;
	}

	public void setStateOfProvince(String stateOfProvince)
	{
		this.stateOfProvince = stateOfProvince;
	}

	public RelatedPlaceRefOrValue geographicAddress(List<GeographicAddress> geographicAddress)
	{
		this.geographicAddress = geographicAddress;
		return this;
	}

	public RelatedPlaceRefOrValue addGeographicAddressItem(GeographicAddress geographicAddressItem)
	{
		if (this.geographicAddress == null)
		{
			this.geographicAddress = new ArrayList<GeographicAddress>();
		}
		this.geographicAddress.add(geographicAddressItem);
		return this;
	}

	/**
    * Get geographicAddress
    *
    * @return geographicAddress
    **/
	@Schema(description = "")
	@Valid
	public List<GeographicAddress> getGeographicAddress()
	{
		return geographicAddress;
	}

	public void setGeographicAddress(List<GeographicAddress> geographicAddress)
	{
		this.geographicAddress = geographicAddress;
	}

	public RelatedPlaceRefOrValue atType(String atType)
	{
		this.atType = atType;
		return this;
	}

	/**
    * The actual type of the target instance when needed for disambiguation.
    *
    * @return atType
    **/
	@Schema(description = "The actual type of the target instance when needed for disambiguation.")

	public String getAtType()
	{
		return atType;
	}

	public void setAtType(String atType)
	{
		this.atType = atType;
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
		RelatedPlaceRefOrValue relatedPlaceRefOrValue = (RelatedPlaceRefOrValue) o;
		return Objects.equals(this.role, relatedPlaceRefOrValue.role) &&
				Objects.equals(this.city, relatedPlaceRefOrValue.city) &&
				Objects.equals(this.postcode, relatedPlaceRefOrValue.postcode) &&
				Objects.equals(this.streetName, relatedPlaceRefOrValue.streetName) &&
				Objects.equals(this.streetType, relatedPlaceRefOrValue.streetType) &&
				Objects.equals(this.streetNr, relatedPlaceRefOrValue.streetNr) &&
				Objects.equals(this.country, relatedPlaceRefOrValue.country) &&
				Objects.equals(this.stateOfProvince, relatedPlaceRefOrValue.stateOfProvince) &&
				Objects.equals(this.geographicAddress, relatedPlaceRefOrValue.geographicAddress) &&
				Objects.equals(this.atType, relatedPlaceRefOrValue.atType);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(role, city, postcode, streetName, streetType, streetNr, country, stateOfProvince, geographicAddress,
				atType);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class RelatedPlaceRefOrValue {\n");

		sb.append("    role: ").append(toIndentedString(role)).append("\n");
		sb.append("    city: ").append(toIndentedString(city)).append("\n");
		sb.append("    postcode: ").append(toIndentedString(postcode)).append("\n");
		sb.append("    streetName: ").append(toIndentedString(streetName)).append("\n");
		sb.append("    streetType: ").append(toIndentedString(streetType)).append("\n");
		sb.append("    streetNr: ").append(toIndentedString(streetNr)).append("\n");
		sb.append("    country: ").append(toIndentedString(country)).append("\n");
		sb.append("    stateOfProvince: ").append(toIndentedString(stateOfProvince)).append("\n");
		sb.append("    geographicAddress: ").append(toIndentedString(geographicAddress)).append("\n");
		sb.append("    atType: ").append(toIndentedString(atType)).append("\n");
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
