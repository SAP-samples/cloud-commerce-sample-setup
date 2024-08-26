/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * The requested time slot
 */
@Schema(description = "The requested time slot")
public class SearchTimeSlot
{
	@JsonProperty("id")
	private String id = null;

	@JsonProperty("availableTimeSlot")
	@Valid
	private List<TimeSlot> availableTimeSlot = null;

	@JsonProperty("searchResult")
	private String searchResult = null;

	@JsonProperty("status")
	private String status = null;

	@JsonProperty("requestedTimeSlot")
	@Valid
	private List<TimeSlot> requestedTimeSlot = null;

	@JsonProperty("searchDate")
	private Date searchDate = null;

	@JsonProperty("relatedPlace")
	private RelatedPlaceRefOrValue relatedPlace = null;

	@JsonProperty("href")
	private String href = null;

	@JsonProperty("@schemaLocation")
	private String atSchemaLocation = null;

	@JsonProperty("@type")
	private String atType = null;

	public SearchTimeSlot id(String id)
	{
		this.id = id;
		return this;
	}

	/**
    * Unique identifier of the time slot
    *
    * @return id
    **/
	@Schema(description = "Unique identifier of the time slot")

	public String getId()
	{
		return id;
	}

	public void setId(String id)
	{
		this.id = id;
	}

	public SearchTimeSlot availableTimeSlot(List<TimeSlot> availableTimeSlot)
	{
		this.availableTimeSlot = availableTimeSlot;
		return this;
	}

	public SearchTimeSlot addAvailableTimeSlotItem(TimeSlot availableTimeSlotItem)
	{
		if (this.availableTimeSlot == null)
		{
			this.availableTimeSlot = new ArrayList<TimeSlot>();
		}
		this.availableTimeSlot.add(availableTimeSlotItem);
		return this;
	}

	/**
    * Get availableTimeSlot
    *
    * @return availableTimeSlot
    **/
	@Schema(description = "")
	@Valid
	public List<TimeSlot> getAvailableTimeSlot()
	{
		return availableTimeSlot;
	}

	public void setAvailableTimeSlot(List<TimeSlot> availableTimeSlot)
	{
		this.availableTimeSlot = availableTimeSlot;
	}

	public SearchTimeSlot searchResult(String searchResult)
	{
		this.searchResult = searchResult;
		return this;
	}

	/**
    * Search result
    *
    * @return searchResult
    **/
	@Schema(description = "Search result")

	public String getSearchResult()
	{
		return searchResult;
	}

	public void setSearchResult(String searchResult)
	{
		this.searchResult = searchResult;
	}

	public SearchTimeSlot status(String status)
	{
		this.status = status;
		return this;
	}

	/**
    * Status
    *
    * @return status
    **/
	@Schema(description = "Status")

	public String getStatus()
	{
		return status;
	}

	public void setStatus(String status)
	{
		this.status = status;
	}

	public SearchTimeSlot requestedTimeSlot(List<TimeSlot> requestedTimeSlot)
	{
		this.requestedTimeSlot = requestedTimeSlot;
		return this;
	}

	public SearchTimeSlot addRequestedTimeSlotItem(TimeSlot requestedTimeSlotItem)
	{
		if (this.requestedTimeSlot == null)
		{
			this.requestedTimeSlot = new ArrayList<TimeSlot>();
		}
		this.requestedTimeSlot.add(requestedTimeSlotItem);
		return this;
	}

	/**
    * Get requestedTimeSlot
    *
    * @return requestedTimeSlot
    **/
	@Schema(description = "")
	@Valid
	public List<TimeSlot> getRequestedTimeSlot()
	{
		return requestedTimeSlot;
	}

	public void setRequestedTimeSlot(List<TimeSlot> requestedTimeSlot)
	{
		this.requestedTimeSlot = requestedTimeSlot;
	}

	public SearchTimeSlot searchDate(Date searchDate)
	{
		this.searchDate = searchDate;
		return this;
	}

	/**
    * A date time (DateTime). Appointment creation date.
    *
    * @return searchDate
    **/
	@Schema(description = "A date time (DateTime). Appointment creation date.")

	@Valid
	public Date getSearchDate()
	{
		return searchDate;
	}

	public void setSearchDate(Date searchDate)
	{
		this.searchDate = searchDate;
	}

	public SearchTimeSlot relatedPlace(RelatedPlaceRefOrValue relatedPlace)
	{
		this.relatedPlace = relatedPlace;
		return this;
	}

	/**
    * Get relatedPlace
    *
    * @return relatedPlace
    **/
	@Schema(description = "")

	@Valid
	public RelatedPlaceRefOrValue getRelatedPlace()
	{
		return relatedPlace;
	}

	public void setRelatedPlace(RelatedPlaceRefOrValue relatedPlace)
	{
		this.relatedPlace = relatedPlace;
	}

	public SearchTimeSlot href(String href)
	{
		this.href = href;
		return this;
	}

	/**
    * Reference of the related party
    *
    * @return href
    **/
	@Schema(description = "Reference of the related party")

	public String getHref()
	{
		return href;
	}

	public void setHref(String href)
	{
		this.href = href;
	}

	public SearchTimeSlot atSchemaLocation(String atSchemaLocation)
	{
		this.atSchemaLocation = atSchemaLocation;
		return this;
	}

	/**
    * A URI to a JSON-Schema file that defines additional attributes and relationships
    *
    * @return atSchemaLocation
    **/
	@Schema(description = "A URI to a JSON-Schema file that defines additional attributes and relationships")

	public String getAtSchemaLocation()
	{
		return atSchemaLocation;
	}

	public void setAtSchemaLocation(String atSchemaLocation)
	{
		this.atSchemaLocation = atSchemaLocation;
	}

	public SearchTimeSlot atType(String atType)
	{
		this.atType = atType;
		return this;
	}

	/**
    * When sub-classing, this defines the sub-class entity name
    *
    * @return atType
    **/
	@Schema(description = "When sub-classing, this defines the sub-class entity name")

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
		SearchTimeSlot searchTimeSlot = (SearchTimeSlot) o;
		return Objects.equals(this.id, searchTimeSlot.id) &&
				Objects.equals(this.availableTimeSlot, searchTimeSlot.availableTimeSlot) &&
				Objects.equals(this.searchResult, searchTimeSlot.searchResult) &&
				Objects.equals(this.status, searchTimeSlot.status) &&
				Objects.equals(this.requestedTimeSlot, searchTimeSlot.requestedTimeSlot) &&
				Objects.equals(this.searchDate, searchTimeSlot.searchDate) &&
				Objects.equals(this.relatedPlace, searchTimeSlot.relatedPlace) &&
				Objects.equals(this.href, searchTimeSlot.href) &&
				Objects.equals(this.atSchemaLocation, searchTimeSlot.atSchemaLocation) &&
				Objects.equals(this.atType, searchTimeSlot.atType);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(id, availableTimeSlot, searchResult, status, requestedTimeSlot, searchDate, relatedPlace, href,
				atSchemaLocation, atType);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class SearchTimeSlot {\n");

		sb.append("    id: ").append(toIndentedString(id)).append("\n");
		sb.append("    availableTimeSlot: ").append(toIndentedString(availableTimeSlot)).append("\n");
		sb.append("    searchResult: ").append(toIndentedString(searchResult)).append("\n");
		sb.append("    status: ").append(toIndentedString(status)).append("\n");
		sb.append("    requestedTimeSlot: ").append(toIndentedString(requestedTimeSlot)).append("\n");
		sb.append("    searchDate: ").append(toIndentedString(searchDate)).append("\n");
		sb.append("    relatedPlace: ").append(toIndentedString(relatedPlace)).append("\n");
		sb.append("    href: ").append(toIndentedString(href)).append("\n");
		sb.append("    atSchemaLocation: ").append(toIndentedString(atSchemaLocation)).append("\n");
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
