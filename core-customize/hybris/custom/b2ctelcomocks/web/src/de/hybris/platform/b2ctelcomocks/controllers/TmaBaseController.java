/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 */

package de.hybris.platform.b2ctelcomocks.controllers;

import de.hybris.platform.b2ctelcomocks.dto.ErrorRepresentation;
import de.hybris.platform.servicelayer.exceptions.ModelNotFoundException;
import de.hybris.platform.tuawebservicesresources.v2.dto.Error;
import de.hybris.platform.util.Config;
import de.hybris.platform.webservicescommons.mapping.DataMapper;
import de.hybris.platform.webservicescommons.util.YSanitizer;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Abstract Base Controller defining common methods and fields to be used by other API controllers.
 *
 * @since 2007
 */
public abstract class TmaBaseController
{
	static final String ERROR = "error";
	private static final Logger LOG = Logger.getLogger(TmaBaseController.class);
	static final String BAD_REQUEST = "BAD_REQUEST";
	static final String NOT_FOUND = "Resource not found";
	static final String DATE_FORMAT = Config.getParameter("b2ctelcomocks.simpleDateFormat");

	@Resource(name = "objectMapper")
	private ObjectMapper objectMapper;

	@Resource(name = "dataMapper")
	private DataMapper dataMapper;

	@PostConstruct
	public void init()
	{
		objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
	}

	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ResponseBody
	@ExceptionHandler({ ModelNotFoundException.class })
	public Error handleModelNotFoundException(final Exception ex)
	{

		LOG.info("Handling Exception for this request - " + ex.getClass().getSimpleName() + " - " + sanitize(ex.getMessage()));
		if (LOG.isDebugEnabled())
		{

			LOG.debug(ex);

		}
		return handleInternalError(ex.getMessage());
	}

	@SuppressWarnings({ "unchecked" })
	protected ResponseEntity getUnsuccessfulResponse(String errorMessage, Exception e, HttpStatus httpStatus)
	{
		LOG.error(errorMessage, e);
		final Error error = new Error();
		error.setCode(ERROR);
		error.setMessage(sanitize(e.getMessage()));
		return new ResponseEntity(error, httpStatus);
	}

	@SuppressWarnings({ "unchecked" })
	protected ResponseEntity getUnsuccessfulResponse(final String message, final HttpStatus httpStatus)
	{
		final Error error = new Error();
		error.setCode(ERROR);
		error.setMessage(sanitize(message));
		return new ResponseEntity(error, httpStatus);
	}

	@SuppressWarnings(
			{ "unchecked", "WeakerAccess" })
	protected ResponseEntity getUnsuccessfulResponseWithErrorRepresentation(final String errorMessage, final Exception e,
			final int errorCode, final String reason, final HttpStatus httpStatus)
	{
		final ErrorRepresentation errorRepresentation = new ErrorRepresentation();
		errorRepresentation.setCode(errorCode);
		errorRepresentation.setReason(reason);
		if (e != null)
		{
			LOG.error(errorMessage, e);
			errorRepresentation.setMessage(sanitize(e.getMessage()));
		}

		return new ResponseEntity(errorRepresentation, httpStatus);
	}

	@SuppressWarnings("WeakerAccess")
	protected Error handleInternalError(final String message)
	{
		final Error error = new Error();
		error.setCode(ERROR);
		error.setMessage(sanitize(message));
		return error;
	}

	@SuppressWarnings("WeakerAccess")
	protected String sanitize(final String input)
	{
		return YSanitizer.sanitize(input);
	}

	protected DataMapper getDataMapper()
	{
		return dataMapper;
	}
}
