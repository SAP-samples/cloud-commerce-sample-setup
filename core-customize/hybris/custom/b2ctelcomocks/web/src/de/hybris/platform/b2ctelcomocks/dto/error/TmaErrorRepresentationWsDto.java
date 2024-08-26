/*
 * Copyright (c) 2022 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto.error;

import java.io.Serializable;
import java.util.Objects;

import javax.validation.constraints.NotNull;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * Standard TMF error representation
 *
 * @since 2302.
 */
@Schema(description = "Standard TMF error representation")
@Validated
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TmaErrorRepresentationWsDto implements Serializable
{
	private static final long serialVersionUID = 1L;

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

	public TmaErrorRepresentationWsDto code(final Integer code)
	{
		this.code = code;
		return this;
	}

	/**
	 * Application related code (as defined in the API or from a common list)
	 *
	 * @return code
	 **/
	@Schema(required = true, description = "Application related code (as defined in the API or from a common list)")
	@NotNull
	public Integer getCode()
	{
		return code;
	}

	public void setCode(final Integer code)
	{
		this.code = code;
	}

	public TmaErrorRepresentationWsDto reason(final String reason)
	{
		this.reason = reason;
		return this;
	}

	/**
	 * Text that explains the reason for error. This can be shown to a client user.
	 *
	 * @return reason
	 **/
	@Schema(description = "Text that explains the reason for error. This can be shown to a client user.")


	public String getReason()
	{
		return reason;
	}

	public void setReason(final String reason)
	{
		this.reason = reason;
	}

	public TmaErrorRepresentationWsDto message(final String message)
	{
		this.message = message;
		return this;
	}

	/**
	 * Text that provides more details and corrective actions related to the error. This can be shown to a client user.
	 *
	 * @return message
	 **/
	@Schema(description = "Text that provides more details and corrective actions related to the error. This can be shown to a client user.")


	public String getMessage()
	{
		return message;
	}

	public void setMessage(final String message)
	{
		this.message = message;
	}

	public TmaErrorRepresentationWsDto status(final String status)
	{
		this.status = status;
		return this;
	}

	/**
	 * http error code extension like 400-2
	 *
	 * @return status
	 **/
	@Schema(description = "http error code extension like 400-2")


	public String getStatus()
	{
		return status;
	}

	public void setStatus(final String status)
	{
		this.status = status;
	}

	public TmaErrorRepresentationWsDto referenceError(final String referenceError)
	{
		this.referenceError = referenceError;
		return this;
	}

	/**
	 * URL pointing to documentation describing the error
	 *
	 * @return referenceError
	 **/
	@Schema(description = "URL pointing to documentation describing the error")


	public String getReferenceError()
	{
		return referenceError;
	}

	public void setReferenceError(final String referenceError)
	{
		this.referenceError = referenceError;
	}


	@Override
	public boolean equals(final Object o)
	{
		if (this == o)
		{
			return true;
		}
		if (o == null || getClass() != o.getClass())
		{
			return false;
		}
		final TmaErrorRepresentationWsDto errorRepresentation = (TmaErrorRepresentationWsDto) o;
		return Objects.equals(this.code, errorRepresentation.code) &&
				Objects.equals(this.reason, errorRepresentation.reason) &&
				Objects.equals(this.message, errorRepresentation.message) &&
				Objects.equals(this.status, errorRepresentation.status) &&
				Objects.equals(this.referenceError, errorRepresentation.referenceError);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(code, reason, message, status, referenceError);
	}

	@Override
	public String toString()
	{
		final StringBuilder sb = new StringBuilder();
		sb.append("class ErrorRepresentation {\n");

		sb.append("    code: ").append(toIndentedString(code)).append("\n");
		sb.append("    reason: ").append(toIndentedString(reason)).append("\n");
		sb.append("    message: ").append(toIndentedString(message)).append("\n");
		sb.append("    status: ").append(toIndentedString(status)).append("\n");
		sb.append("    referenceError: ").append(toIndentedString(referenceError)).append("\n");
		sb.append("}");
		return sb.toString();
	}

	/**
	 * Convert the given object to string with each line indented by 4 spaces
	 * (except the first line).
	 */
	private String toIndentedString(final Object o)
	{
		if (o == null)
		{
			return "null";
		}
		return o.toString().replace("\n", "\n    ");
	}
}

