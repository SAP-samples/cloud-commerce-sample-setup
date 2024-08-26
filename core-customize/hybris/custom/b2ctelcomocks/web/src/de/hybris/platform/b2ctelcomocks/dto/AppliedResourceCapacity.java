/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import de.hybris.platform.tuawebservicesresources.v2.dto.ResourceRef;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * AppliedResourceCapacity
 */
@Schema(description = "AppliedResourceCapacity")
public class AppliedResourceCapacity
{
	@JsonProperty("appliedCapacityAmount")
	private String appliedCapacityAmount = null;

	@JsonProperty("resource")
	@Valid
	private List<ResourceRef> resource = null;

	public AppliedResourceCapacity appliedCapacityAmount(String appliedCapacityAmount)
	{
		this.appliedCapacityAmount = appliedCapacityAmount;
		return this;
	}

	/**
    * Get appliedCapacityAmount
    *
    * @return appliedCapacityAmount
    **/
	@Schema(description = "")

	public String getAppliedCapacityAmount()
	{
		return appliedCapacityAmount;
	}

	public void setAppliedCapacityAmount(String appliedCapacityAmount)
	{
		this.appliedCapacityAmount = appliedCapacityAmount;
	}

	public AppliedResourceCapacity resource(List<ResourceRef> resource)
	{
		this.resource = resource;
		return this;
	}

	public AppliedResourceCapacity addResourceItem(ResourceRef resourceItem)
	{
		if (this.resource == null)
		{
			this.resource = new ArrayList<ResourceRef>();
		}
		this.resource.add(resourceItem);
		return this;
	}

	/**
    * Get resource
    *
    * @return resource
    **/
	@Schema(description = "")
	@Valid
	public List<ResourceRef> getResource()
	{
		return resource;
	}

	public void setResource(List<ResourceRef> resource)
	{
		this.resource = resource;
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
		AppliedResourceCapacity appliedResourceCapacity = (AppliedResourceCapacity) o;
		return Objects.equals(this.appliedCapacityAmount, appliedResourceCapacity.appliedCapacityAmount) &&
				Objects.equals(this.resource, appliedResourceCapacity.resource);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(appliedCapacityAmount, resource);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class AppliedResourceCapacity {\n");

		sb.append("    appliedCapacityAmount: ").append(toIndentedString(appliedCapacityAmount)).append("\n");
		sb.append("    resource: ").append(toIndentedString(resource)).append("\n");
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
