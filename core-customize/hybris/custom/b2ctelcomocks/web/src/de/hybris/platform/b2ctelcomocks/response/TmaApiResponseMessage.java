/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.response;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlTransient;


/**
 * Populate Api response message with code and message.
 *
 * @since 2302
 */

@javax.xml.bind.annotation.XmlRootElement
public class TmaApiResponseMessage implements Serializable
{
	static final long serialVersionUID = -3387516993124229948L;
	public static final int ERROR = 1;
	public static final int WARNING = 2;
	public static final int INFO = 3;
	public static final int OK = 4;
	public static final int TOO_BUSY = 5;

	int code;
	String type;
	String message;

	public TmaApiResponseMessage()
	{
	}

	public TmaApiResponseMessage(final int code, final String message)
	{
		this.code = code;
		switch (code)
		{
			case ERROR:
				this.type = "error";
				break;
			case WARNING:
				this.type = "warning";
				break;
			case INFO:
				this.type = "info";
				break;
			case OK:
				this.type = "ok";
				break;
			case TOO_BUSY:
				this.type = "too busy";
				break;
			default:
				this.type = "unknown";
				break;
		}
		this.message = message;
	}

	@XmlTransient
	public int getCode()
	{
		return code;
	}

	public void setCode(final int code)
	{
		this.code = code;
	}

	public String getType()
	{
		return type;
	}

	public void setType(final String type)
	{
		this.type = type;
	}

	public String getMessage()
	{
		return message;
	}

	public void setMessage(final String message)
	{
		this.message = message;
	}
}
