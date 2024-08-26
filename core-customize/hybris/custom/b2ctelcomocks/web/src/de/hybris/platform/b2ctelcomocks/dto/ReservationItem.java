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
 * ReservationItem
 */
@Schema(description = "ReservationItem")
public class ReservationItem
{
	@JsonProperty("quantity")
	private Float quantity = null;

	@JsonProperty("subReservationState")
	private String subReservationState = null;

	@JsonProperty("resourceCapacity")
	@Valid
	private List<ResourceCapacityDemand> resourceCapacity = null;

	@JsonProperty("appliedCapacityAmount")
	@Valid
	private List<AppliedCapacityAmount> appliedCapacityAmount = null;

	public ReservationItem quantity(Float quantity)
	{
		this.quantity = quantity;
		return this;
	}

	/**
    * A positive floating point number
    *
    * @return quantity
    **/
	@Schema(description = "A positive floating point number")

	public Float getQuantity()
	{
		return quantity;
	}

	public void setQuantity(Float quantity)
	{
		this.quantity = quantity;
	}

	public ReservationItem subReservationState(String subReservationState)
	{
		this.subReservationState = subReservationState;
		return this;
	}

	/**
    * Get subReservationState
    *
    * @return subReservationState
    **/
	@Schema(description = "")

	public String getSubReservationState()
	{
		return subReservationState;
	}

	public void setSubReservationState(String subReservationState)
	{
		this.subReservationState = subReservationState;
	}

	public ReservationItem resourceCapacity(List<ResourceCapacityDemand> resourceCapacity)
	{
		this.resourceCapacity = resourceCapacity;
		return this;
	}

	public ReservationItem addResourceCapacityItem(ResourceCapacityDemand resourceCapacityItem)
	{
		if (this.resourceCapacity == null)
		{
			this.resourceCapacity = new ArrayList<ResourceCapacityDemand>();
		}
		this.resourceCapacity.add(resourceCapacityItem);
		return this;
	}

	/**
    * Get resourceCapacity
    *
    * @return resourceCapacity
    **/
	@Schema(description = "")
	@Valid
	public List<ResourceCapacityDemand> getResourceCapacity()
	{
		return resourceCapacity;
	}

	public void setResourceCapacity(List<ResourceCapacityDemand> resourceCapacity)
	{
		this.resourceCapacity = resourceCapacity;
	}

	public ReservationItem appliedCapacityAmount(List<AppliedCapacityAmount> appliedCapacityAmount)
	{
		this.appliedCapacityAmount = appliedCapacityAmount;
		return this;
	}

	public ReservationItem addAppliedCapacityAmountItem(AppliedCapacityAmount appliedCapacityAmountItem)
	{
		if (this.appliedCapacityAmount == null)
		{
			this.appliedCapacityAmount = new ArrayList<AppliedCapacityAmount>();
		}
		this.appliedCapacityAmount.add(appliedCapacityAmountItem);
		return this;
	}

	/**
    * Get appliedCapacityAmount
    *
    * @return appliedCapacityAmount
    **/
	@Schema(description = "")
	@Valid
	public List<AppliedCapacityAmount> getAppliedCapacityAmount()
	{
		return appliedCapacityAmount;
	}

	public void setAppliedCapacityAmount(List<AppliedCapacityAmount> appliedCapacityAmount)
	{
		this.appliedCapacityAmount = appliedCapacityAmount;
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
		ReservationItem reservationItem = (ReservationItem) o;
		return Objects.equals(this.quantity, reservationItem.quantity) &&
				Objects.equals(this.subReservationState, reservationItem.subReservationState) &&
				Objects.equals(this.resourceCapacity, reservationItem.resourceCapacity) &&
				Objects.equals(this.appliedCapacityAmount, reservationItem.appliedCapacityAmount);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(quantity, subReservationState, resourceCapacity, appliedCapacityAmount);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class ReservationItem {\n");

		sb.append("    quantity: ").append(toIndentedString(quantity)).append("\n");
		sb.append("    subReservationState: ").append(toIndentedString(subReservationState)).append("\n");
		sb.append("    resourceCapacity: ").append(toIndentedString(resourceCapacity)).append("\n");
		sb.append("    appliedCapacityAmount: ").append(toIndentedString(appliedCapacityAmount)).append("\n");
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
