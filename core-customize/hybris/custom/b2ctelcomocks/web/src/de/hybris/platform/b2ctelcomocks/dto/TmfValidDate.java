/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import java.util.Date;
import java.util.Objects;

import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * TmaTimePeriodMock
 */
@Schema(description = "TmaTimePeriodMock")
public class TmfValidDate
{
	@JsonProperty("startDate")
	private Date startDate = null;

	@JsonProperty("endDate")
	private Date endDate = null;

	public TmfValidDate startDate(Date startDate)
	{
		this.startDate = startDate;
		return this;
	}

	/**
    * Start date time
    *
    * @return startDate
    **/
	@Schema(description = "Start date time")

	@Valid
	public Date getStartDate()
	{
		return startDate;
	}

	public void setStartDate(Date startDate)
	{
		this.startDate = startDate;
	}

	public TmfValidDate endDate(Date endDate)
	{
		this.endDate = endDate;
		return this;
	}

	/**
    * End date time
    *
    * @return endDate
    **/
	@Schema(description = "End date time")

	@Valid
	public Date getEndDate()
	{
		return endDate;
	}

	public void setEndDate(Date endDate)
	{
		this.endDate = endDate;
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
		TmfValidDate tmfValidDate = (TmfValidDate) o;
		return Objects.equals(this.startDate, tmfValidDate.startDate) &&
				Objects.equals(this.endDate, tmfValidDate.endDate);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(startDate, endDate);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class TmfValidDate {\n");

		sb.append("    startDate: ").append(toIndentedString(startDate)).append("\n");
		sb.append("    endDate: ").append(toIndentedString(endDate)).append("\n");
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
