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
 * TmfReservation resource
 */
@Schema(description = "TmfReservation resource")
public class TmfReservation
{
	@JsonProperty("@baseType")
	private String baseType = null;

	@JsonProperty("schemaLocation")
	private String schemaLocation = null;

	@JsonProperty("@type")
	private String type = null;

	@JsonProperty("description")
	private String description = null;

	@JsonProperty("href")
	private String href = null;

	@JsonProperty("id")
	private String id = null;

	@JsonProperty("reservationState")
	private String reservationState = null;

	@JsonProperty("validFor")
	private TmfValidDate validFor = null;

	@JsonProperty("reservationItem")
	@Valid
	private List<ReservationItem> reservationItem = null;

	@JsonProperty("relatedParty")
	@Valid
	private List<ReservationItem> relatedParty = null;

	public TmfReservation baseType(String baseType)
	{
		this.baseType = baseType;
		return this;
	}

	/**
    * Get baseType
    *
    * @return baseType
    **/
	@Schema(description = "")

	public String getBaseType()
	{
		return baseType;
	}

	public void setBaseType(String baseType)
	{
		this.baseType = baseType;
	}

	public TmfReservation schemaLocation(String schemaLocation)
	{
		this.schemaLocation = schemaLocation;
		return this;
	}

	/**
    * Get schemaLocation
    *
    * @return schemaLocation
    **/
	@Schema(description = "")

	public String getSchemaLocation()
	{
		return schemaLocation;
	}

	public void setSchemaLocation(String schemaLocation)
	{
		this.schemaLocation = schemaLocation;
	}

	public TmfReservation type(String type)
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

	public TmfReservation description(String description)
	{
		this.description = description;
		return this;
	}

	/**
    * Get description
    *
    * @return description
    **/
	@Schema(description = "")

	public String getDescription()
	{
		return description;
	}

	public void setDescription(String description)
	{
		this.description = description;
	}

	public TmfReservation href(String href)
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

	public TmfReservation id(String id)
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

	public TmfReservation reservationState(String reservationState)
	{
		this.reservationState = reservationState;
		return this;
	}

	/**
    * Get reservationState
    *
    * @return reservationState
    **/
	@Schema(description = "")

	public String getReservationState()
	{
		return reservationState;
	}

	public void setReservationState(String reservationState)
	{
		this.reservationState = reservationState;
	}

	public TmfReservation validFor(TmfValidDate validFor)
	{
		this.validFor = validFor;
		return this;
	}

	/**
    * Get validFor
    *
    * @return validFor
    **/
	@Schema(description = "")

	@Valid
	public TmfValidDate getValidFor()
	{
		return validFor;
	}

	public void setValidFor(TmfValidDate validFor)
	{
		this.validFor = validFor;
	}

	public TmfReservation reservationItem(List<ReservationItem> reservationItem)
	{
		this.reservationItem = reservationItem;
		return this;
	}

	public TmfReservation addReservationItemItem(ReservationItem reservationItemItem)
	{
		if (this.reservationItem == null)
		{
			this.reservationItem = new ArrayList<ReservationItem>();
		}
		this.reservationItem.add(reservationItemItem);
		return this;
	}

	/**
    * Get reservationItem
    *
    * @return reservationItem
    **/
	@Schema(description = "")
	@Valid
	public List<ReservationItem> getReservationItem()
	{
		return reservationItem;
	}

	public void setReservationItem(List<ReservationItem> reservationItem)
	{
		this.reservationItem = reservationItem;
	}

	public TmfReservation relatedParty(List<ReservationItem> relatedParty)
	{
		this.relatedParty = relatedParty;
		return this;
	}

	public TmfReservation addRelatedPartyItem(ReservationItem relatedPartyItem)
	{
		if (this.relatedParty == null)
		{
			this.relatedParty = new ArrayList<ReservationItem>();
		}
		this.relatedParty.add(relatedPartyItem);
		return this;
	}

	/**
    * Get relatedParty
    *
    * @return relatedParty
    **/
	@Schema(description = "")
	@Valid
	public List<ReservationItem> getRelatedParty()
	{
		return relatedParty;
	}

	public void setRelatedParty(List<ReservationItem> relatedParty)
	{
		this.relatedParty = relatedParty;
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
		TmfReservation tmfReservation = (TmfReservation) o;
		return Objects.equals(this.baseType, tmfReservation.baseType) &&
				Objects.equals(this.schemaLocation, tmfReservation.schemaLocation) &&
				Objects.equals(this.type, tmfReservation.type) &&
				Objects.equals(this.description, tmfReservation.description) &&
				Objects.equals(this.href, tmfReservation.href) &&
				Objects.equals(this.id, tmfReservation.id) &&
				Objects.equals(this.reservationState, tmfReservation.reservationState) &&
				Objects.equals(this.validFor, tmfReservation.validFor) &&
				Objects.equals(this.reservationItem, tmfReservation.reservationItem) &&
				Objects.equals(this.relatedParty, tmfReservation.relatedParty);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(baseType, schemaLocation, type, description, href, id, reservationState, validFor, reservationItem,
				relatedParty);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class TmfReservation {\n");

		sb.append("    baseType: ").append(toIndentedString(baseType)).append("\n");
		sb.append("    schemaLocation: ").append(toIndentedString(schemaLocation)).append("\n");
		sb.append("    type: ").append(toIndentedString(type)).append("\n");
		sb.append("    description: ").append(toIndentedString(description)).append("\n");
		sb.append("    href: ").append(toIndentedString(href)).append("\n");
		sb.append("    id: ").append(toIndentedString(id)).append("\n");
		sb.append("    reservationState: ").append(toIndentedString(reservationState)).append("\n");
		sb.append("    validFor: ").append(toIndentedString(validFor)).append("\n");
		sb.append("    reservationItem: ").append(toIndentedString(reservationItem)).append("\n");
		sb.append("    relatedParty: ").append(toIndentedString(relatedParty)).append("\n");
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
