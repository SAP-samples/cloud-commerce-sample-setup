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
 * PremiseLookupResp item
 */
@Schema(description = "PremiseLookupResp item")
public class PremiseLookupResp
{
	@JsonProperty("status")
	private String status = null;

	@JsonProperty("technicalResources")
	@Valid
	private List<TechnicalResource> technicalResources = null;

	public PremiseLookupResp status(String status)
	{
		this.status = status;
		return this;
	}

	/**
    * Get status
    *
    * @return status
    **/
	@Schema(description = "")

	public String getStatus()
	{
		return status;
	}

	public void setStatus(String status)
	{
		this.status = status;
	}

	public PremiseLookupResp technicalResources(List<TechnicalResource> technicalResources)
	{
		this.technicalResources = technicalResources;
		return this;
	}

	public PremiseLookupResp addTechnicalResourcesItem(TechnicalResource technicalResourcesItem)
	{
		if (this.technicalResources == null)
		{
			this.technicalResources = new ArrayList<TechnicalResource>();
		}
		this.technicalResources.add(technicalResourcesItem);
		return this;
	}

	/**
    * Get technicalResources
    *
    * @return technicalResources
    **/
	@Schema(description = "")
	@Valid
	public List<TechnicalResource> getTechnicalResources()
	{
		return technicalResources;
	}

	public void setTechnicalResources(List<TechnicalResource> technicalResources)
	{
		this.technicalResources = technicalResources;
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
		PremiseLookupResp premiseLookupResp = (PremiseLookupResp) o;
		return Objects.equals(this.status, premiseLookupResp.status) &&
				Objects.equals(this.technicalResources, premiseLookupResp.technicalResources);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(status, technicalResources);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class PremiseLookupResp {\n");

		sb.append("    status: ").append(toIndentedString(status)).append("\n");
		sb.append("    technicalResources: ").append(toIndentedString(technicalResources)).append("\n");
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
