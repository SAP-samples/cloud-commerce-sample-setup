/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import java.util.Objects;

import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * TechnicalResource item
 */
@Schema(description = "TechnicalResource item")
public class TechnicalResource
{
	@JsonProperty("id")
	private String id = null;

	@JsonProperty("@type")
	private TechnicalResourceType type = null;

	public TechnicalResource id(String id)
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

	public TechnicalResource type(TechnicalResourceType type)
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

	@Valid
	public TechnicalResourceType getType()
	{
		return type;
	}

	public void setType(TechnicalResourceType type)
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
		TechnicalResource technicalResource = (TechnicalResource) o;
		return Objects.equals(this.id, technicalResource.id) &&
				Objects.equals(this.type, technicalResource.type);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(id, type);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class TechnicalResource {\n");

		sb.append("    id: ").append(toIndentedString(id)).append("\n");
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
