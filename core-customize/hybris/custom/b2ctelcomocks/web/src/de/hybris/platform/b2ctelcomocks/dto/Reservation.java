/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import de.hybris.platform.tuawebservicesresources.v2.dto.ProductOfferingRef;
import de.hybris.platform.tuawebservicesresources.v2.dto.RelatedParty;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * TmfAppliedCapacityAmount resource
 */
@Schema(description = "TmfAppliedCapacityAmount resource")
public class Reservation
{
	@JsonProperty("@baseType")
	private String atBaseType = null;

	@JsonProperty("@schemaLocation")
	private String atSchemaLocation = null;

	@JsonProperty("@type")
	private String atType = null;

	@JsonProperty("description")
	private String description = null;

	@JsonProperty("href")
	private String href = null;

	@JsonProperty("id")
	private String id = null;

	@JsonProperty("reservationState")
	private ReservationStateType reservationState = null;

	@JsonProperty("reservationItem")
	@Valid
	private List<ReservationItem> reservationItem = null;

	@JsonProperty("relatedParty")
	@Valid
	private List<RelatedParty> relatedParty = null;

	@JsonProperty("productOffering")
	private ProductOfferingRef productOffering = null;

	public Reservation atBaseType(String atBaseType)
	{
		this.atBaseType = atBaseType;
		return this;
	}

	/**
    * Get atBaseType
    *
    * @return atBaseType
    **/
	@Schema(description = "")

	public String getAtBaseType()
	{
		return atBaseType;
	}

	public void setAtBaseType(String atBaseType)
	{
		this.atBaseType = atBaseType;
	}

	public Reservation atSchemaLocation(String atSchemaLocation)
	{
		this.atSchemaLocation = atSchemaLocation;
		return this;
	}

	/**
    * Get atSchemaLocation
    *
    * @return atSchemaLocation
    **/
	@Schema(description = "")

	public String getAtSchemaLocation()
	{
		return atSchemaLocation;
	}

	public void setAtSchemaLocation(String atSchemaLocation)
	{
		this.atSchemaLocation = atSchemaLocation;
	}

	public Reservation atType(String atType)
	{
		this.atType = atType;
		return this;
	}

	/**
    * Get atType
    *
    * @return atType
    **/
	@Schema(description = "")

	public String getAtType()
	{
		return atType;
	}

	public void setAtType(String atType)
	{
		this.atType = atType;
	}

	public Reservation description(String description)
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

	public Reservation href(String href)
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

	public Reservation id(String id)
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

	public Reservation reservationState(ReservationStateType reservationState)
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

	@Valid
	public ReservationStateType getReservationState()
	{
		return reservationState;
	}

	public void setReservationState(ReservationStateType reservationState)
	{
		this.reservationState = reservationState;
	}

	public Reservation reservationItem(List<ReservationItem> reservationItem)
	{
		this.reservationItem = reservationItem;
		return this;
	}

	public Reservation addReservationItemItem(ReservationItem reservationItemItem)
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

	public Reservation relatedParty(List<RelatedParty> relatedParty)
	{
		this.relatedParty = relatedParty;
		return this;
	}

	public Reservation addRelatedPartyItem(RelatedParty relatedPartyItem)
	{
		if (this.relatedParty == null)
		{
			this.relatedParty = new ArrayList<RelatedParty>();
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
	public List<RelatedParty> getRelatedParty()
	{
		return relatedParty;
	}

	public void setRelatedParty(List<RelatedParty> relatedParty)
	{
		this.relatedParty = relatedParty;
	}

	public Reservation productOffering(ProductOfferingRef productOffering)
	{
		this.productOffering = productOffering;
		return this;
	}

	/**
    * Get productOffering
    *
    * @return productOffering
    **/
	@Schema(description = "")

	@Valid
	public ProductOfferingRef getProductOffering()
	{
		return productOffering;
	}

	public void setProductOffering(ProductOfferingRef productOffering)
	{
		this.productOffering = productOffering;
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
		Reservation reservation = (Reservation) o;
		return Objects.equals(this.atBaseType, reservation.atBaseType) &&
				Objects.equals(this.atSchemaLocation, reservation.atSchemaLocation) &&
				Objects.equals(this.atType, reservation.atType) &&
				Objects.equals(this.description, reservation.description) &&
				Objects.equals(this.href, reservation.href) &&
				Objects.equals(this.id, reservation.id) &&
				Objects.equals(this.reservationState, reservation.reservationState) &&
				Objects.equals(this.reservationItem, reservation.reservationItem) &&
				Objects.equals(this.relatedParty, reservation.relatedParty) &&
				Objects.equals(this.productOffering, reservation.productOffering);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(atBaseType, atSchemaLocation, atType, description, href, id, reservationState, reservationItem,
				relatedParty, productOffering);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class Reservation {\n");

		sb.append("    atBaseType: ").append(toIndentedString(atBaseType)).append("\n");
		sb.append("    atSchemaLocation: ").append(toIndentedString(atSchemaLocation)).append("\n");
		sb.append("    atType: ").append(toIndentedString(atType)).append("\n");
		sb.append("    description: ").append(toIndentedString(description)).append("\n");
		sb.append("    href: ").append(toIndentedString(href)).append("\n");
		sb.append("    id: ").append(toIndentedString(id)).append("\n");
		sb.append("    reservationState: ").append(toIndentedString(reservationState)).append("\n");
		sb.append("    reservationItem: ").append(toIndentedString(reservationItem)).append("\n");
		sb.append("    relatedParty: ").append(toIndentedString(relatedParty)).append("\n");
		sb.append("    productOffering: ").append(toIndentedString(productOffering)).append("\n");
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
