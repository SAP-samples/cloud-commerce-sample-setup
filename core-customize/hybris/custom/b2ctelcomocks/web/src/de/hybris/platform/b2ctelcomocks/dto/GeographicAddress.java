/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import java.util.Objects;
import de.hybris.platform.tuawebservicesresources.v2.dto.RelatedParty;

import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * Related Entity reference. A related place defines a place described by reference or by value linked to a specific entity.
 */
@Schema(description = "Related Entity reference. A related place defines a place described by reference or by value linked to a specific entity.")
public class GeographicAddress
{
	@JsonProperty("id")
	private String id = null;

	@JsonProperty("href")
	private String href = null;

	@JsonProperty("streetNr")
	private String streetNr = null;

	@JsonProperty("streetNrLast")
	private String streetNrLast = null;

	@JsonProperty("streetNrLastSuffix")
	private String streetNrLastSuffix = null;

	@JsonProperty("streetName")
	private String streetName = null;

	@JsonProperty("streetType")
	private String streetType = null;

	@JsonProperty("streetSuffix")
	private String streetSuffix = null;

	@JsonProperty("postcode")
	private String postcode = null;

	@JsonProperty("locality")
	private String locality = null;

	@JsonProperty("city")
	private String city = null;

	@JsonProperty("stateOfProvince")
	private String stateOfProvince = null;

	@JsonProperty("country")
	private String country = null;

	@JsonProperty("relatedParty")
	private RelatedParty relatedParty = null;

	@JsonProperty("geographicSubAddress")
	private GeographicSubAddress geographicSubAddress = null;

	@JsonProperty("isInstallationAddress")
	private Boolean isInstallationAddress = false;

	@JsonProperty("isUnloadingAddress")
	private Boolean isUnloadingAddress = false;

	@JsonProperty("isContactAddress")
	private Boolean isContactAddress = false;

	@JsonProperty("isShippingAddress")
	private Boolean isShippingAddress = false;

	@JsonProperty("isBillingAddress")
	private Boolean isBillingAddress = false;

	@JsonProperty("@type")
	private String atType = null;

	public GeographicAddress id(String id)
	{
		this.id = id;
		return this;
	}

	/**
    * Get id
    *
    * @return id
    **/
	@Schema(description = "")

	public String getId()
	{
		return id;
	}

	public void setId(String id)
	{
		this.id = id;
	}

	public GeographicAddress href(String href)
	{
		this.href = href;
		return this;
	}

	/**
    * Get href
    *
    * @return href
    **/
	@Schema(description = "")

	public String getHref()
	{
		return href;
	}

	public void setHref(String href)
	{
		this.href = href;
	}

	public GeographicAddress streetNr(String streetNr)
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

	public GeographicAddress streetNrLast(String streetNrLast)
	{
		this.streetNrLast = streetNrLast;
		return this;
	}

	/**
    * Get streetNrLast
    *
    * @return streetNrLast
    **/
	@Schema(description = "")

	public String getStreetNrLast()
	{
		return streetNrLast;
	}

	public void setStreetNrLast(String streetNrLast)
	{
		this.streetNrLast = streetNrLast;
	}

	public GeographicAddress streetNrLastSuffix(String streetNrLastSuffix)
	{
		this.streetNrLastSuffix = streetNrLastSuffix;
		return this;
	}

	/**
    * Get streetNrLastSuffix
    *
    * @return streetNrLastSuffix
    **/
	@Schema(description = "")

	public String getStreetNrLastSuffix()
	{
		return streetNrLastSuffix;
	}

	public void setStreetNrLastSuffix(String streetNrLastSuffix)
	{
		this.streetNrLastSuffix = streetNrLastSuffix;
	}

	public GeographicAddress streetName(String streetName)
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

	public GeographicAddress streetType(String streetType)
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

	public GeographicAddress streetSuffix(String streetSuffix)
	{
		this.streetSuffix = streetSuffix;
		return this;
	}

	/**
    * Get streetSuffix
    *
    * @return streetSuffix
    **/
	@Schema(description = "")

	public String getStreetSuffix()
	{
		return streetSuffix;
	}

	public void setStreetSuffix(String streetSuffix)
	{
		this.streetSuffix = streetSuffix;
	}

	public GeographicAddress postcode(String postcode)
	{
		this.postcode = postcode;
		return this;
	}

	/**
    * Get postcode
    *
    * @return postcode
    **/
	@Schema(description = "")

	public String getPostcode()
	{
		return postcode;
	}

	public void setPostcode(String postcode)
	{
		this.postcode = postcode;
	}

	public GeographicAddress locality(String locality)
	{
		this.locality = locality;
		return this;
	}

	/**
    * Get locality
    *
    * @return locality
    **/
	@Schema(description = "")

	public String getLocality()
	{
		return locality;
	}

	public void setLocality(String locality)
	{
		this.locality = locality;
	}

	public GeographicAddress city(String city)
	{
		this.city = city;
		return this;
	}

	/**
    * Get city
    *
    * @return city
    **/
	@Schema(description = "")

	public String getCity()
	{
		return city;
	}

	public void setCity(String city)
	{
		this.city = city;
	}

	public GeographicAddress stateOfProvince(String stateOfProvince)
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

	public GeographicAddress country(String country)
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

	public GeographicAddress relatedParty(RelatedParty relatedParty)
	{
		this.relatedParty = relatedParty;
		return this;
	}

	/**
    * Get relatedParty
    *
    * @return relatedParty
    **/
	@Schema(description = "")

	@Valid
	public RelatedParty getRelatedParty()
	{
		return relatedParty;
	}

	public void setRelatedParty(RelatedParty relatedParty)
	{
		this.relatedParty = relatedParty;
	}

	public GeographicAddress geographicSubAddress(GeographicSubAddress geographicSubAddress)
	{
		this.geographicSubAddress = geographicSubAddress;
		return this;
	}

	/**
    * Get geographicSubAddress
    *
    * @return geographicSubAddress
    **/
	@Schema(description = "")

	@Valid
	public GeographicSubAddress getGeographicSubAddress()
	{
		return geographicSubAddress;
	}

	public void setGeographicSubAddress(GeographicSubAddress geographicSubAddress)
	{
		this.geographicSubAddress = geographicSubAddress;
	}

	public GeographicAddress isInstallationAddress(Boolean isInstallationAddress)
	{
		this.isInstallationAddress = isInstallationAddress;
		return this;
	}

	/**
    * A boolean.
    *
    * @return isInstallationAddress
    **/
	@Schema(description = "A boolean. ")

	public Boolean isIsInstallationAddress()
	{
		return isInstallationAddress;
	}

	public void setIsInstallationAddress(Boolean isInstallationAddress)
	{
		this.isInstallationAddress = isInstallationAddress;
	}

	public GeographicAddress isUnloadingAddress(Boolean isUnloadingAddress)
	{
		this.isUnloadingAddress = isUnloadingAddress;
		return this;
	}

	/**
    * A boolean.
    *
    * @return isUnloadingAddress
    **/
	@Schema(description = "A boolean. ")

	public Boolean isIsUnloadingAddress()
	{
		return isUnloadingAddress;
	}

	public void setIsUnloadingAddress(Boolean isUnloadingAddress)
	{
		this.isUnloadingAddress = isUnloadingAddress;
	}

	public GeographicAddress isContactAddress(Boolean isContactAddress)
	{
		this.isContactAddress = isContactAddress;
		return this;
	}

	/**
    * A boolean.
    *
    * @return isContactAddress
    **/
	@Schema(description = "A boolean. ")

	public Boolean isIsContactAddress()
	{
		return isContactAddress;
	}

	public void setIsContactAddress(Boolean isContactAddress)
	{
		this.isContactAddress = isContactAddress;
	}

	public GeographicAddress isShippingAddress(Boolean isShippingAddress)
	{
		this.isShippingAddress = isShippingAddress;
		return this;
	}

	/**
    * A boolean.
    *
    * @return isShippingAddress
    **/
	@Schema(description = "A boolean. ")

	public Boolean isIsShippingAddress()
	{
		return isShippingAddress;
	}

	public void setIsShippingAddress(Boolean isShippingAddress)
	{
		this.isShippingAddress = isShippingAddress;
	}

	public GeographicAddress isBillingAddress(Boolean isBillingAddress)
	{
		this.isBillingAddress = isBillingAddress;
		return this;
	}

	/**
    * A boolean.
    *
    * @return isBillingAddress
    **/
	@Schema(description = "A boolean. ")

	public Boolean isIsBillingAddress()
	{
		return isBillingAddress;
	}

	public void setIsBillingAddress(Boolean isBillingAddress)
	{
		this.isBillingAddress = isBillingAddress;
	}

	public GeographicAddress atType(String atType)
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
		GeographicAddress geographicAddress = (GeographicAddress) o;
		return Objects.equals(this.id, geographicAddress.id) &&
				Objects.equals(this.href, geographicAddress.href) &&
				Objects.equals(this.streetNr, geographicAddress.streetNr) &&
				Objects.equals(this.streetNrLast, geographicAddress.streetNrLast) &&
				Objects.equals(this.streetNrLastSuffix, geographicAddress.streetNrLastSuffix) &&
				Objects.equals(this.streetName, geographicAddress.streetName) &&
				Objects.equals(this.streetType, geographicAddress.streetType) &&
				Objects.equals(this.streetSuffix, geographicAddress.streetSuffix) &&
				Objects.equals(this.postcode, geographicAddress.postcode) &&
				Objects.equals(this.locality, geographicAddress.locality) &&
				Objects.equals(this.city, geographicAddress.city) &&
				Objects.equals(this.stateOfProvince, geographicAddress.stateOfProvince) &&
				Objects.equals(this.country, geographicAddress.country) &&
				Objects.equals(this.relatedParty, geographicAddress.relatedParty) &&
				Objects.equals(this.geographicSubAddress, geographicAddress.geographicSubAddress) &&
				Objects.equals(this.isInstallationAddress, geographicAddress.isInstallationAddress) &&
				Objects.equals(this.isUnloadingAddress, geographicAddress.isUnloadingAddress) &&
				Objects.equals(this.isContactAddress, geographicAddress.isContactAddress) &&
				Objects.equals(this.isShippingAddress, geographicAddress.isShippingAddress) &&
				Objects.equals(this.isBillingAddress, geographicAddress.isBillingAddress) &&
				Objects.equals(this.atType, geographicAddress.atType);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(id, href, streetNr, streetNrLast, streetNrLastSuffix, streetName, streetType, streetSuffix, postcode,
				locality, city, stateOfProvince, country, relatedParty, geographicSubAddress, isInstallationAddress,
				isUnloadingAddress, isContactAddress, isShippingAddress, isBillingAddress, atType);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class GeographicAddress {\n");

		sb.append("    id: ").append(toIndentedString(id)).append("\n");
		sb.append("    href: ").append(toIndentedString(href)).append("\n");
		sb.append("    streetNr: ").append(toIndentedString(streetNr)).append("\n");
		sb.append("    streetNrLast: ").append(toIndentedString(streetNrLast)).append("\n");
		sb.append("    streetNrLastSuffix: ").append(toIndentedString(streetNrLastSuffix)).append("\n");
		sb.append("    streetName: ").append(toIndentedString(streetName)).append("\n");
		sb.append("    streetType: ").append(toIndentedString(streetType)).append("\n");
		sb.append("    streetSuffix: ").append(toIndentedString(streetSuffix)).append("\n");
		sb.append("    postcode: ").append(toIndentedString(postcode)).append("\n");
		sb.append("    locality: ").append(toIndentedString(locality)).append("\n");
		sb.append("    city: ").append(toIndentedString(city)).append("\n");
		sb.append("    stateOfProvince: ").append(toIndentedString(stateOfProvince)).append("\n");
		sb.append("    country: ").append(toIndentedString(country)).append("\n");
		sb.append("    relatedParty: ").append(toIndentedString(relatedParty)).append("\n");
		sb.append("    geographicSubAddress: ").append(toIndentedString(geographicSubAddress)).append("\n");
		sb.append("    isInstallationAddress: ").append(toIndentedString(isInstallationAddress)).append("\n");
		sb.append("    isUnloadingAddress: ").append(toIndentedString(isUnloadingAddress)).append("\n");
		sb.append("    isContactAddress: ").append(toIndentedString(isContactAddress)).append("\n");
		sb.append("    isShippingAddress: ").append(toIndentedString(isShippingAddress)).append("\n");
		sb.append("    isBillingAddress: ").append(toIndentedString(isBillingAddress)).append("\n");
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
