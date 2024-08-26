/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import java.util.Objects;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * Error Representation
 */
@Schema(description = "Error Representation")
public class ErrorRepresentation
{
	@JsonProperty("code")
	private Integer code = null;

	@JsonProperty("reason")
	private String reason = null;

	@JsonProperty("message")
	private String message = null;

	@JsonProperty("status")
	private String status = null;

	@JsonProperty("referenceError")
	private String referenceError = null;

	@JsonProperty("@type")
	private String atType = null;

	@JsonProperty("@schemaLocation")
	private String atSchemaLocation = null;

	public ErrorRepresentation code(Integer code)
	{
		this.code = code;
		return this;
	}

	/**
    * Get code
    *
    * @return code
    **/
	@Schema(required = true, description = "")
	@NotNull

	public Integer getCode()
	{
		return code;
	}

	public void setCode(Integer code)
	{
		this.code = code;
	}

	public ErrorRepresentation reason(String reason)
	{
		this.reason = reason;
		return this;
	}

	/**
    * Get reason
    *
    * @return reason
    **/
	@Schema(required = true, description = "")
	@NotNull

	public String getReason()
	{
		return reason;
	}

	public void setReason(String reason)
	{
		this.reason = reason;
	}

	public ErrorRepresentation message(String message)
	{
		this.message = message;
		return this;
	}

	/**
    * Get message
    *
    * @return message
    **/
	@Schema(description = "")

	public String getMessage()
	{
		return message;
	}

	public void setMessage(String message)
	{
		this.message = message;
	}

	public ErrorRepresentation status(String status)
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

	public ErrorRepresentation referenceError(String referenceError)
	{
		this.referenceError = referenceError;
		return this;
	}

	/**
    * Get referenceError
    *
    * @return referenceError
    **/
	@Schema(description = "")

	public String getReferenceError()
	{
		return referenceError;
	}

	public void setReferenceError(String referenceError)
	{
		this.referenceError = referenceError;
	}

	public ErrorRepresentation atType(String atType)
	{
		this.atType = atType;
		return this;
	}

	/**
    * Get atType
    *
    * @return atType
    **/
	@Schema(description = "")

	public String getAtType()
	{
		return atType;
	}

	public void setAtType(String atType)
	{
		this.atType = atType;
	}

	public ErrorRepresentation atSchemaLocation(String atSchemaLocation)
	{
		this.atSchemaLocation = atSchemaLocation;
		return this;
	}

	/**
    * Get atSchemaLocation
    *
    * @return atSchemaLocation
    **/
	@Schema(description = "")

	public String getAtSchemaLocation()
	{
		return atSchemaLocation;
	}

	public void setAtSchemaLocation(String atSchemaLocation)
	{
		this.atSchemaLocation = atSchemaLocation;
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
		ErrorRepresentation errorRepresentation = (ErrorRepresentation) o;
		return Objects.equals(this.code, errorRepresentation.code) &&
				Objects.equals(this.reason, errorRepresentation.reason) &&
				Objects.equals(this.message, errorRepresentation.message) &&
				Objects.equals(this.status, errorRepresentation.status) &&
				Objects.equals(this.referenceError, errorRepresentation.referenceError) &&
				Objects.equals(this.atType, errorRepresentation.atType) &&
				Objects.equals(this.atSchemaLocation, errorRepresentation.atSchemaLocation);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(code, reason, message, status, referenceError, atType, atSchemaLocation);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class ErrorRepresentation {\n");

		sb.append("    code: ").append(toIndentedString(code)).append("\n");
		sb.append("    reason: ").append(toIndentedString(reason)).append("\n");
		sb.append("    message: ").append(toIndentedString(message)).append("\n");
		sb.append("    status: ").append(toIndentedString(status)).append("\n");
		sb.append("    referenceError: ").append(toIndentedString(referenceError)).append("\n");
		sb.append("    atType: ").append(toIndentedString(atType)).append("\n");
		sb.append("    atSchemaLocation: ").append(toIndentedString(atSchemaLocation)).append("\n");
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
