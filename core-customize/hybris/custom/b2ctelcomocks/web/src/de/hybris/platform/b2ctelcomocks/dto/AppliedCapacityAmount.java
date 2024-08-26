/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import de.hybris.platform.tuawebservicesresources.v2.dto.ResourceRef;

import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * TmfAppliedCapacityAmount resource
 */
@Schema(description = "TmfAppliedCapacityAmount resource")
public class AppliedCapacityAmount
{
	@JsonProperty("appliedCapacityAmount")
	private Float appliedCapacityAmount = null;

	@JsonProperty("@type")
	private String type = null;

	@JsonProperty("@baseType")
	private String baseType = null;

	@JsonProperty("resource")
	@Valid
	private List<ResourceRef> resource = null;

	public AppliedCapacityAmount appliedCapacityAmount(Float appliedCapacityAmount)
	{
		this.appliedCapacityAmount = appliedCapacityAmount;
		return this;
	}

	/**
    * A positive floating point number
    *
    * @return appliedCapacityAmount
    **/
	@Schema(description = "A positive floating point number")

	public Float getAppliedCapacityAmount()
	{
		return appliedCapacityAmount;
	}

	public void setAppliedCapacityAmount(Float appliedCapacityAmount)
	{
		this.appliedCapacityAmount = appliedCapacityAmount;
	}

	public AppliedCapacityAmount type(String type)
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

	public AppliedCapacityAmount baseType(String baseType)
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

	public AppliedCapacityAmount resource(List<ResourceRef> resource)
	{
		this.resource = resource;
		return this;
	}

	public AppliedCapacityAmount addResourceItem(ResourceRef resourceItem)
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
		AppliedCapacityAmount appliedCapacityAmount = (AppliedCapacityAmount) o;
		return Objects.equals(this.appliedCapacityAmount, appliedCapacityAmount.appliedCapacityAmount) &&
				Objects.equals(this.type, appliedCapacityAmount.type) &&
				Objects.equals(this.baseType, appliedCapacityAmount.baseType) &&
				Objects.equals(this.resource, appliedCapacityAmount.resource);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(appliedCapacityAmount, type, baseType, resource);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class AppliedCapacityAmount {\n");

		sb.append("    appliedCapacityAmount: ").append(toIndentedString(appliedCapacityAmount)).append("\n");
		sb.append("    type: ").append(toIndentedString(type)).append("\n");
		sb.append("    baseType: ").append(toIndentedString(baseType)).append("\n");
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
