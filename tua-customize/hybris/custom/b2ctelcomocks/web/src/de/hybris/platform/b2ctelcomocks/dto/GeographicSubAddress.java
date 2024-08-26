/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * Related Entity reference. A related place defines a place described by reference or by value linked to a specific entity.
 */
@Schema(description = "Related Entity reference. A related place defines a place described by reference or by value linked to a specific entity.")
public class GeographicSubAddress
{
	@JsonProperty("id")
	private String id = null;

	@JsonProperty("href")
	private String href = null;

	@JsonProperty("name")
	private String name = null;

	@JsonProperty("@type")
	private String type = null;

	@JsonProperty("subUnitType")
	private String subUnitType = null;

	@JsonProperty("subUnitNumber")
	private String subUnitNumber = null;

	@JsonProperty("levelType")
	private String levelType = null;

	@JsonProperty("levelNumber")
	private String levelNumber = null;

	@JsonProperty("buildingName")
	private String buildingName = null;

	@JsonProperty("privateStreetNumber")
	private String privateStreetNumber = null;

	@JsonProperty("privateStreetName")
	private String privateStreetName = null;

	public GeographicSubAddress id(String id)
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

	public GeographicSubAddress href(String href)
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

	public GeographicSubAddress name(String name)
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

	public GeographicSubAddress type(String type)
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

	public GeographicSubAddress subUnitType(String subUnitType)
	{
		this.subUnitType = subUnitType;
		return this;
	}

	/**
    * Get subUnitType
    *
    * @return subUnitType
    **/
	@Schema(description = "")

	public String getSubUnitType()
	{
		return subUnitType;
	}

	public void setSubUnitType(String subUnitType)
	{
		this.subUnitType = subUnitType;
	}

	public GeographicSubAddress subUnitNumber(String subUnitNumber)
	{
		this.subUnitNumber = subUnitNumber;
		return this;
	}

	/**
    * Get subUnitNumber
    *
    * @return subUnitNumber
    **/
	@Schema(description = "")

	public String getSubUnitNumber()
	{
		return subUnitNumber;
	}

	public void setSubUnitNumber(String subUnitNumber)
	{
		this.subUnitNumber = subUnitNumber;
	}

	public GeographicSubAddress levelType(String levelType)
	{
		this.levelType = levelType;
		return this;
	}

	/**
    * Get levelType
    *
    * @return levelType
    **/
	@Schema(description = "")

	public String getLevelType()
	{
		return levelType;
	}

	public void setLevelType(String levelType)
	{
		this.levelType = levelType;
	}

	public GeographicSubAddress levelNumber(String levelNumber)
	{
		this.levelNumber = levelNumber;
		return this;
	}

	/**
    * Get levelNumber
    *
    * @return levelNumber
    **/
	@Schema(description = "")

	public String getLevelNumber()
	{
		return levelNumber;
	}

	public void setLevelNumber(String levelNumber)
	{
		this.levelNumber = levelNumber;
	}

	public GeographicSubAddress buildingName(String buildingName)
	{
		this.buildingName = buildingName;
		return this;
	}

	/**
    * Get buildingName
    *
    * @return buildingName
    **/
	@Schema(description = "")

	public String getBuildingName()
	{
		return buildingName;
	}

	public void setBuildingName(String buildingName)
	{
		this.buildingName = buildingName;
	}

	public GeographicSubAddress privateStreetNumber(String privateStreetNumber)
	{
		this.privateStreetNumber = privateStreetNumber;
		return this;
	}

	/**
    * Get privateStreetNumber
    *
    * @return privateStreetNumber
    **/
	@Schema(description = "")

	public String getPrivateStreetNumber()
	{
		return privateStreetNumber;
	}

	public void setPrivateStreetNumber(String privateStreetNumber)
	{
		this.privateStreetNumber = privateStreetNumber;
	}

	public GeographicSubAddress privateStreetName(String privateStreetName)
	{
		this.privateStreetName = privateStreetName;
		return this;
	}

	/**
    * Get privateStreetName
    *
    * @return privateStreetName
    **/
	@Schema(description = "")

	public String getPrivateStreetName()
	{
		return privateStreetName;
	}

	public void setPrivateStreetName(String privateStreetName)
	{
		this.privateStreetName = privateStreetName;
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
		GeographicSubAddress geographicSubAddress = (GeographicSubAddress) o;
		return Objects.equals(this.id, geographicSubAddress.id) &&
				Objects.equals(this.href, geographicSubAddress.href) &&
				Objects.equals(this.name, geographicSubAddress.name) &&
				Objects.equals(this.type, geographicSubAddress.type) &&
				Objects.equals(this.subUnitType, geographicSubAddress.subUnitType) &&
				Objects.equals(this.subUnitNumber, geographicSubAddress.subUnitNumber) &&
				Objects.equals(this.levelType, geographicSubAddress.levelType) &&
				Objects.equals(this.levelNumber, geographicSubAddress.levelNumber) &&
				Objects.equals(this.buildingName, geographicSubAddress.buildingName) &&
				Objects.equals(this.privateStreetNumber, geographicSubAddress.privateStreetNumber) &&
				Objects.equals(this.privateStreetName, geographicSubAddress.privateStreetName);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(id, href, name, type, subUnitType, subUnitNumber, levelType, levelNumber, buildingName,
				privateStreetNumber, privateStreetName);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class GeographicSubAddress {\n");

		sb.append("    id: ").append(toIndentedString(id)).append("\n");
		sb.append("    href: ").append(toIndentedString(href)).append("\n");
		sb.append("    name: ").append(toIndentedString(name)).append("\n");
		sb.append("    type: ").append(toIndentedString(type)).append("\n");
		sb.append("    subUnitType: ").append(toIndentedString(subUnitType)).append("\n");
		sb.append("    subUnitNumber: ").append(toIndentedString(subUnitNumber)).append("\n");
		sb.append("    levelType: ").append(toIndentedString(levelType)).append("\n");
		sb.append("    levelNumber: ").append(toIndentedString(levelNumber)).append("\n");
		sb.append("    buildingName: ").append(toIndentedString(buildingName)).append("\n");
		sb.append("    privateStreetNumber: ").append(toIndentedString(privateStreetNumber)).append("\n");
		sb.append("    privateStreetName: ").append(toIndentedString(privateStreetName)).append("\n");
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
