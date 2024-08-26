/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import java.util.Objects;

import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * ServiceQualificationItem
 */
@Schema(description = "ServiceQualificationItem")
public class ServiceQualificationItem
{
	@JsonProperty("id")
	private String id = null;

	@JsonProperty("service")
	private ServiceRefOrValue service = null;

	@JsonProperty("@type")
	private String type = null;

	public ServiceQualificationItem id(String id)
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

	public ServiceQualificationItem service(ServiceRefOrValue service)
	{
		this.service = service;
		return this;
	}

	/**
    * Get service
    *
    * @return service
    **/
	@Schema(description = "")

	@Valid
	public ServiceRefOrValue getService()
	{
		return service;
	}

	public void setService(ServiceRefOrValue service)
	{
		this.service = service;
	}

	public ServiceQualificationItem type(String type)
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
		ServiceQualificationItem serviceQualificationItem = (ServiceQualificationItem) o;
		return Objects.equals(this.id, serviceQualificationItem.id) &&
				Objects.equals(this.service, serviceQualificationItem.service) &&
				Objects.equals(this.type, serviceQualificationItem.type);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(id, service, type);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class ServiceQualificationItem {\n");

		sb.append("    id: ").append(toIndentedString(id)).append("\n");
		sb.append("    service: ").append(toIndentedString(service)).append("\n");
		sb.append("    type: ").append(toIndentedString(type)).append("\n");
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
