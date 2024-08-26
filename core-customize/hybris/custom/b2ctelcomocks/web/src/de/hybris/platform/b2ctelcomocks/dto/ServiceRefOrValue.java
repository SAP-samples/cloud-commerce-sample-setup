/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import de.hybris.platform.tuawebservicesresources.v2.dto.Characteristic;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * ServiceRefOrValue
 */
@Schema(description = "ServiceRefOrValue")
public class ServiceRefOrValue
{
	@JsonProperty("place")
	@Valid
	private List<RelatedPlaceRefOrValue> place = null;

	@JsonProperty("serviceSpecification")
	private ServiceSpecificationRef serviceSpecification = null;

	@JsonProperty("serviceCharacteristic")
	@Valid
	private List<Characteristic> serviceCharacteristic = null;

	@JsonProperty("serialNumber")
	private String serialNumber = null;

	@JsonProperty("division")
	private String division = null;

	public ServiceRefOrValue place(List<RelatedPlaceRefOrValue> place)
	{
		this.place = place;
		return this;
	}

	public ServiceRefOrValue addPlaceItem(RelatedPlaceRefOrValue placeItem)
	{
		if (this.place == null)
		{
			this.place = new ArrayList<RelatedPlaceRefOrValue>();
		}
		this.place.add(placeItem);
		return this;
	}

	/**
    * Get place
    *
    * @return place
    **/
	@Schema(description = "")
	@Valid
	public List<RelatedPlaceRefOrValue> getPlace()
	{
		return place;
	}

	public void setPlace(List<RelatedPlaceRefOrValue> place)
	{
		this.place = place;
	}

	public ServiceRefOrValue serviceSpecification(ServiceSpecificationRef serviceSpecification)
	{
		this.serviceSpecification = serviceSpecification;
		return this;
	}

	public ServiceRefOrValue serialNumber(final String serialNumber)
	{
		this.serialNumber = serialNumber;
		return this;
	}

	public ServiceRefOrValue division(final String division)
	{
		this.division = division;
		return this;
	}

	/**
    * Get serviceSpecification
    *
    * @return serviceSpecification
    **/
	@Schema(description = "")
	@Valid
	public ServiceSpecificationRef getServiceSpecification()
	{
		return serviceSpecification;
	}

	public void setServiceSpecification(ServiceSpecificationRef serviceSpecification)
	{
		this.serviceSpecification = serviceSpecification;
	}

	/**
	 * Get serialNumber
	 *
	 * @return serialNumber
	 **/
	@Schema(description = "")
	@Valid
	public String getSerialNumber()
	{
		return serialNumber;
	}

	public void setSerialNumber(final String serialNumber)
	{
		this.serialNumber = serialNumber;
	}

	/**
	 * Get division
	 *
	 * @return division
	 **/
	@Schema(description = "")
	@Valid
	public String getDivision()
	{
		return division;
	}

	public void setDivision(final String division)
	{
		this.division = division;
	}

	public ServiceRefOrValue serviceCharacteristic(List<Characteristic> serviceCharacteristic)
	{
		this.serviceCharacteristic = serviceCharacteristic;
		return this;
	}

	public ServiceRefOrValue addServiceCharacteristicItem(Characteristic serviceCharacteristicItem)
	{
		if (this.serviceCharacteristic == null)
		{
			this.serviceCharacteristic = new ArrayList<Characteristic>();
		}
		this.serviceCharacteristic.add(serviceCharacteristicItem);
		return this;
	}

	/**
    * Get serviceCharacteristic
    *
    * @return serviceCharacteristic
    **/
	@Schema(description = "")
	@Valid
	public List<Characteristic> getServiceCharacteristic()
	{
		return serviceCharacteristic;
	}

	public void setServiceCharacteristic(List<Characteristic> serviceCharacteristic)
	{
		this.serviceCharacteristic = serviceCharacteristic;
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
		ServiceRefOrValue serviceRefOrValue = (ServiceRefOrValue) o;
		return Objects.equals(this.place, serviceRefOrValue.place) &&
				Objects.equals(this.serviceSpecification, serviceRefOrValue.serviceSpecification) &&
				Objects.equals(this.serviceCharacteristic, serviceRefOrValue.serviceCharacteristic) &&
				Objects.equals(this.serialNumber, serviceRefOrValue.serialNumber) &&
				Objects.equals(this.division, serviceRefOrValue.division);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(place, serviceSpecification, serviceCharacteristic, serialNumber, division);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class ServiceRefOrValue {\n");

		sb.append("    place: ").append(toIndentedString(place)).append("\n");
		sb.append("    serviceSpecification: ").append(toIndentedString(serviceSpecification)).append("\n");
		sb.append("    serviceCharacteristic: ").append(toIndentedString(serviceCharacteristic)).append("\n");
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
