/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import de.hybris.platform.tuawebservicesresources.v2.dto.RelatedParty;
import de.hybris.platform.tuawebservicesresources.v2.dto.TimePeriod;

import java.util.Objects;

import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * The requested time slot
 */
@Schema(description = "The requested time slot")
public class TimeSlot
{
	@JsonProperty("id")
	private String id = null;

	@JsonProperty("href")
	private String href = null;

	@JsonProperty("relatedParty")
	private RelatedParty relatedParty = null;

	@JsonProperty("validFor")
	private TimePeriod validFor = null;

	public TimeSlot id(String id)
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

	public TimeSlot href(String href)
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

	public TimeSlot relatedParty(RelatedParty relatedParty)
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

	public TimeSlot validFor(TimePeriod validFor)
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
	public TimePeriod getValidFor()
	{
		return validFor;
	}

	public void setValidFor(TimePeriod validFor)
	{
		this.validFor = validFor;
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
		TimeSlot timeSlot = (TimeSlot) o;
		return Objects.equals(this.id, timeSlot.id) &&
				Objects.equals(this.href, timeSlot.href) &&
				Objects.equals(this.relatedParty, timeSlot.relatedParty) &&
				Objects.equals(this.validFor, timeSlot.validFor);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(id, href, relatedParty, validFor);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class TimeSlot {\n");

		sb.append("    id: ").append(toIndentedString(id)).append("\n");
		sb.append("    href: ").append(toIndentedString(href)).append("\n");
		sb.append("    relatedParty: ").append(toIndentedString(relatedParty)).append("\n");
		sb.append("    validFor: ").append(toIndentedString(validFor)).append("\n");
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
