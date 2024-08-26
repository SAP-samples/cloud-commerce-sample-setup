/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * ServiceSpecificationRef
 */
@Schema(description = "ServiceSpecificationRef")
public class ServiceSpecificationRef
{
	@JsonProperty("id")
	private String id = null;

	@JsonProperty("name")
	private String name = null;

	@JsonProperty("href")
	private String href = null;

	@JsonProperty("@type")
	private String type = null;

	public ServiceSpecificationRef id(String id)
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

	public ServiceSpecificationRef name(String name)
	{
		this.name = name;
		return this;
	}

	/**
    * Get name
    *
    * @return name
    **/
	@Schema(description = "")

	public String getName()
	{
		return name;
	}

	public void setName(String name)
	{
		this.name = name;
	}

	public ServiceSpecificationRef href(String href)
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

	public ServiceSpecificationRef type(String type)
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
		ServiceSpecificationRef serviceSpecificationRef = (ServiceSpecificationRef) o;
		return Objects.equals(this.id, serviceSpecificationRef.id) &&
				Objects.equals(this.name, serviceSpecificationRef.name) &&
				Objects.equals(this.href, serviceSpecificationRef.href) &&
				Objects.equals(this.type, serviceSpecificationRef.type);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(id, name, href, type);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class ServiceSpecificationRef {\n");

		sb.append("    id: ").append(toIndentedString(id)).append("\n");
		sb.append("    name: ").append(toIndentedString(name)).append("\n");
		sb.append("    href: ").append(toIndentedString(href)).append("\n");
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
