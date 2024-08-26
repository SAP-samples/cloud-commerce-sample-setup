/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import de.hybris.platform.tuawebservicesresources.v2.dto.Quantity;
import de.hybris.platform.tuawebservicesresources.v2.dto.TimePeriod;

import java.util.Objects;

import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * An attachment by value or by reference.
 */
@Schema(description = "An attachment by value or by reference.")
public class AttachmentRefOrValue
{
	@JsonProperty("id")
	private String id = null;

	@JsonProperty("href")
	private String href = null;

	@JsonProperty("description")
	private String description = null;

	@JsonProperty("url")
	private String url = null;

	@JsonProperty("@referredType")
	private String atReferredType = null;

	@JsonProperty("name")
	private String name = null;

	@JsonProperty("attachmentType")
	private String attachmentType = null;

	@JsonProperty("mimeType")
	private String mimeType = null;

	@JsonProperty("isRef")
	private Boolean isRef = false;

	@JsonProperty("size")
	private Quantity size = null;

	@JsonProperty("validFor")
	private TimePeriod validFor = null;

	public AttachmentRefOrValue id(String id)
	{
		this.id = id;
		return this;
	}

	/**
    * A string. Unique identifier of the note
    *
    * @return id
    **/
	@Schema(description = "A string. Unique identifier of the note")

	public String getId()
	{
		return id;
	}

	public void setId(String id)
	{
		this.id = id;
	}

	public AttachmentRefOrValue href(String href)
	{
		this.href = href;
		return this;
	}

	/**
    * A string. Unique reference of the note
    *
    * @return href
    **/
	@Schema(description = "A string. Unique reference of the note")

	public String getHref()
	{
		return href;
	}

	public void setHref(String href)
	{
		this.href = href;
	}

	public AttachmentRefOrValue description(String description)
	{
		this.description = description;
		return this;
	}

	/**
    * Text of the note.
    *
    * @return description
    **/
	@Schema(description = "Text of the note.")

	public String getDescription()
	{
		return description;
	}

	public void setDescription(String description)
	{
		this.description = description;
	}

	public AttachmentRefOrValue url(String url)
	{
		this.url = url;
		return this;
	}

	/**
    * Text of the note.
    *
    * @return url
    **/
	@Schema(description = "Text of the note.")

	public String getUrl()
	{
		return url;
	}

	public void setUrl(String url)
	{
		this.url = url;
	}

	public AttachmentRefOrValue atReferredType(String atReferredType)
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

	public AttachmentRefOrValue name(String name)
	{
		this.name = name;
		return this;
	}

	/**
    * A string. Unique reference of the note
    *
    * @return name
    **/
	@Schema(description = "A string. Unique reference of the note")

	public String getName()
	{
		return name;
	}

	public void setName(String name)
	{
		this.name = name;
	}

	public AttachmentRefOrValue attachmentType(String attachmentType)
	{
		this.attachmentType = attachmentType;
		return this;
	}

	/**
    * A string. Unique reference of the note
    *
    * @return attachmentType
    **/
	@Schema(description = "A string. Unique reference of the note")

	public String getAttachmentType()
	{
		return attachmentType;
	}

	public void setAttachmentType(String attachmentType)
	{
		this.attachmentType = attachmentType;
	}

	public AttachmentRefOrValue mimeType(String mimeType)
	{
		this.mimeType = mimeType;
		return this;
	}

	/**
    * A string. Unique reference of the note
    *
    * @return mimeType
    **/
	@Schema(description = "A string. Unique reference of the note")

	public String getMimeType()
	{
		return mimeType;
	}

	public void setMimeType(String mimeType)
	{
		this.mimeType = mimeType;
	}

	public AttachmentRefOrValue isRef(Boolean isRef)
	{
		this.isRef = isRef;
		return this;
	}

	/**
    * A boolean.
    *
    * @return isRef
    **/
	@Schema(description = "A boolean. ")

	public Boolean isIsRef()
	{
		return isRef;
	}

	public void setIsRef(Boolean isRef)
	{
		this.isRef = isRef;
	}

	public AttachmentRefOrValue size(Quantity size)
	{
		this.size = size;
		return this;
	}

	/**
    * Get size
    *
    * @return size
    **/
	@Schema(description = "")

	@Valid
	public Quantity getSize()
	{
		return size;
	}

	public void setSize(Quantity size)
	{
		this.size = size;
	}

	public AttachmentRefOrValue validFor(TimePeriod validFor)
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
		AttachmentRefOrValue attachmentRefOrValue = (AttachmentRefOrValue) o;
		return Objects.equals(this.id, attachmentRefOrValue.id) &&
				Objects.equals(this.href, attachmentRefOrValue.href) &&
				Objects.equals(this.description, attachmentRefOrValue.description) &&
				Objects.equals(this.url, attachmentRefOrValue.url) &&
				Objects.equals(this.atReferredType, attachmentRefOrValue.atReferredType) &&
				Objects.equals(this.name, attachmentRefOrValue.name) &&
				Objects.equals(this.attachmentType, attachmentRefOrValue.attachmentType) &&
				Objects.equals(this.mimeType, attachmentRefOrValue.mimeType) &&
				Objects.equals(this.isRef, attachmentRefOrValue.isRef) &&
				Objects.equals(this.size, attachmentRefOrValue.size) &&
				Objects.equals(this.validFor, attachmentRefOrValue.validFor);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(id, href, description, url, atReferredType, name, attachmentType, mimeType, isRef, size, validFor);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class AttachmentRefOrValue {\n");

		sb.append("    id: ").append(toIndentedString(id)).append("\n");
		sb.append("    href: ").append(toIndentedString(href)).append("\n");
		sb.append("    description: ").append(toIndentedString(description)).append("\n");
		sb.append("    url: ").append(toIndentedString(url)).append("\n");
		sb.append("    atReferredType: ").append(toIndentedString(atReferredType)).append("\n");
		sb.append("    name: ").append(toIndentedString(name)).append("\n");
		sb.append("    attachmentType: ").append(toIndentedString(attachmentType)).append("\n");
		sb.append("    mimeType: ").append(toIndentedString(mimeType)).append("\n");
		sb.append("    isRef: ").append(toIndentedString(isRef)).append("\n");
		sb.append("    size: ").append(toIndentedString(size)).append("\n");
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
