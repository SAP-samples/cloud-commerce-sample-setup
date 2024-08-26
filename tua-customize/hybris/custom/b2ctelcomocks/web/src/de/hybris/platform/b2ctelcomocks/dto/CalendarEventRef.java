/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * A calendar event reference
 */
@Schema(description = "A calendar event reference")
public class CalendarEventRef
{
	@JsonProperty("id")
	private String id = null;

	@JsonProperty("href")
	private String href = null;

	@JsonProperty("name")
	private String name = null;

	@JsonProperty("@referredType")
	private String atReferredType = null;

	public CalendarEventRef id(String id)
	{
		this.id = id;
		return this;
	}

	/**
    * A string. Unique identifier of the calendar event.
    *
    * @return id
    **/
	@Schema(description = "A string. Unique identifier of the calendar event.")

	public String getId()
	{
		return id;
	}

	public void setId(String id)
	{
		this.id = id;
	}

	public CalendarEventRef href(String href)
	{
		this.href = href;
		return this;
	}

	/**
    * A string. Unique reference of the calendar event.
    *
    * @return href
    **/
	@Schema(description = "A string. Unique reference of the calendar event.")

	public String getHref()
	{
		return href;
	}

	public void setHref(String href)
	{
		this.href = href;
	}

	public CalendarEventRef name(String name)
	{
		this.name = name;
		return this;
	}

	/**
    * A user-friendly name for the calendar event
    *
    * @return name
    **/
	@Schema(description = "A user-friendly name for the calendar event")

	public String getName()
	{
		return name;
	}

	public void setName(String name)
	{
		this.name = name;
	}

	public CalendarEventRef atReferredType(String atReferredType)
	{
		this.atReferredType = atReferredType;
		return this;
	}

	/**
    * The actual type of the target instance when needed for disambiguation.
    *
    * @return atReferredType
    **/
	@Schema(description = "The actual type of the target instance when needed for disambiguation.")

	public String getAtReferredType()
	{
		return atReferredType;
	}

	public void setAtReferredType(String atReferredType)
	{
		this.atReferredType = atReferredType;
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
		CalendarEventRef calendarEventRef = (CalendarEventRef) o;
		return Objects.equals(this.id, calendarEventRef.id) &&
				Objects.equals(this.href, calendarEventRef.href) &&
				Objects.equals(this.name, calendarEventRef.name) &&
				Objects.equals(this.atReferredType, calendarEventRef.atReferredType);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(id, href, name, atReferredType);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class CalendarEventRef {\n");

		sb.append("    id: ").append(toIndentedString(id)).append("\n");
		sb.append("    href: ").append(toIndentedString(href)).append("\n");
		sb.append("    name: ").append(toIndentedString(name)).append("\n");
		sb.append("    atReferredType: ").append(toIndentedString(atReferredType)).append("\n");
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
