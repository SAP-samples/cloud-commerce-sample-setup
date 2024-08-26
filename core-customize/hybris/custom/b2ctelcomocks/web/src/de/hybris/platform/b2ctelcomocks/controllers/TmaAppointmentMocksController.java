/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.controllers;

import de.hybris.platform.b2ctelcomocks.api.AppointmentApi;
import de.hybris.platform.b2ctelcomocks.dto.Appointment;
import de.hybris.platform.b2ctelcomocks.dto.AppointmentStateType;
import de.hybris.platform.b2ctelcomocks.dto.SearchTimeSlot;
import de.hybris.platform.b2ctelcomocks.dto.TimeSlot;
import de.hybris.platform.servicelayer.exceptions.ModelNotFoundException;
import de.hybris.platform.tuawebservicesresources.v2.dto.RelatedParty;
import de.hybris.platform.tuawebservicesresources.v2.dto.TimePeriod;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;


@Controller
@RequestMapping(value = "/appointment/v4")
public class TmaAppointmentMocksController extends TmaBaseController implements AppointmentApi
{
	private static final String SEARCHTIMESLOT_HREF_ROOT = "https://host:port/appointment/searchtimeslot/";
	private static final String AVAILABLETIMESLOT_HREF_ROOT = SEARCHTIMESLOT_HREF_ROOT + "/99/availableTimeSlot/";
	private static final String CREATERELATEDPARTY_HREF_ROOT = "https://host:port/partyManagement/individual/";
	private static final String APPOINTMENT_JSON_URL = "b2ctelcomocks/json/appointment/appointment.json";

	@Operation(summary = "Appointment", operationId = "appointmentGet", description = "This operation retrieves a appointment entity.")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Success"),
			@ApiResponse(responseCode = "400", description = "Bad Request  List of supported error codes: - 20: Invalid URL parameter value - 21: Missing body - 22: Invalid body - 23: Missing body field - 24: Invalid body field - 25: Missing header - 26: Invalid header value - 27: Missing query-string parameter - 28: Invalid query-string parameter value"),
			@ApiResponse(responseCode = "404", description = "Not Found  List of supported error codes: - 60: Resource not found"),
			@ApiResponse(responseCode = "405", description = "Method Not Allowed  List of supported error codes: - 61: Method not allowed"),
			@ApiResponse(responseCode = "409", description = "Conflict  The request could not be completed due to a conflict with the current state of the target resource."),
			@ApiResponse(responseCode = "422", description = "Unprocessable entity  Functional error"),
			@ApiResponse(responseCode = "500", description = "Internal Server Error  List of supported error codes: - 1: Internal error") })
	@RequestMapping(value = "/appointment/{appointmentId}",
			produces = { "application/json;charset=utf-8" },
			method = RequestMethod.GET)
	@Override
	public ResponseEntity<Appointment> appointmentGet(
			@Parameter(description = "Identifier of the Appointment", required = true) @PathVariable("appointmentId") final String id)
	{
		try
		{
			final String content = new String(
					Files.readAllBytes(Paths.get(new ClassPathResource(APPOINTMENT_JSON_URL).getURI())));
			final ObjectMapper mapper = new ObjectMapper();
			final List<Appointment> participantJsonList = mapper.readValue(content, new TypeReference<>()
			{
			});

			if (!contains(participantJsonList, id))
			{
				ModelNotFoundException e = new ModelNotFoundException("No resource with given id");
				return getUnsuccessfulResponseWithErrorRepresentation(NOT_FOUND, e, 60, NOT_FOUND,
						HttpStatus.NOT_FOUND);
			}
			return new ResponseEntity(retrieveAppointment(participantJsonList, id), HttpStatus.OK);

		}
		catch (final IOException e)
		{
			return getUnsuccessfulResponse(BAD_REQUEST, e, HttpStatus.BAD_REQUEST);
		}
	}

	@Operation(summary = "Patch an appointment", operationId = "appointmentPatch", description = "This operation allows partial updates of a appointment entity")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Success"),
			@ApiResponse(responseCode = "400", description = "Bad Request  List of supported error codes: - 20: Invalid URL parameter value - 21: Missing body - 22: Invalid body - 23: Missing body field - 24: Invalid body field - 25: Missing header - 26: Invalid header value - 27: Missing query-string parameter - 28: Invalid query-string parameter value"),
			@ApiResponse(responseCode = "404", description = "Not Found  List of supported error codes: - 60: Resource not found"),
			@ApiResponse(responseCode = "405", description = "Method Not Allowed  List of supported error codes: - 61: Method not allowed"),
			@ApiResponse(responseCode = "409", description = "Conflict  The request could not be completed due to a conflict with the current state of the target resource."),
			@ApiResponse(responseCode = "422", description = "Unprocessable entity  Functional error"),
			@ApiResponse(responseCode = "500", description = "Internal Server Error  List of supported error codes: - 1: Internal error") })
	@RequestMapping(value = "/appointment/{appointmentId}",
			produces = { "application/json;charset=utf-8" },
			consumes = { "application/json;charset=utf-8" },
			method = RequestMethod.PATCH)
	@Override
	public ResponseEntity<Appointment> appointmentPatch(
			@Parameter(description = "", required = true) @PathVariable("appointmentId") String appointmentId,
			@Parameter(description = "", required = true) @Valid @RequestBody Appointment appointment)
	{
		try
		{
			final String content = new String(
					Files.readAllBytes(Paths.get(new ClassPathResource(APPOINTMENT_JSON_URL).getURI())));
			final ObjectMapper mapper = new ObjectMapper();
			final List<Appointment> appointments = mapper.readValue(content, new TypeReference<>()
			{
			});

			if (!contains(appointments, appointmentId))
			{
				ModelNotFoundException e = new ModelNotFoundException("No resource with given id");
				return getUnsuccessfulResponseWithErrorRepresentation(NOT_FOUND, e, 60, NOT_FOUND,
						HttpStatus.NOT_FOUND);
			}
			final Appointment appointmentMockResponseWsDTO = retrieveAppointment(appointments,
					appointmentId);
			getDataMapper().map(appointment, appointmentMockResponseWsDTO, false);
			final List<Appointment> updatedList = removeAppointment(appointments, appointmentId);
			updatedList.add(appointmentMockResponseWsDTO);

			final String jsonResult = mapper.writeValueAsString(updatedList);
			final File appointmentFile = new File(
					new ClassPathResource(APPOINTMENT_JSON_URL).getURI());
			final FileWriter fileWriter = new FileWriter(appointmentFile, false);
			fileWriter.write(jsonResult);
			fileWriter.close();
			return new ResponseEntity<>(appointmentMockResponseWsDTO, HttpStatus.OK);
		}
		catch (final IOException e)
		{
			return getUnsuccessfulResponse(BAD_REQUEST, e, HttpStatus.BAD_REQUEST);
		}
	}

	@Operation(summary = "Creates an Appointment", operationId = "createAppointment", description = "This operation creates a Appointment entity.")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "201", description = "Created"),
			@ApiResponse(responseCode = "400", description = "Bad Request"),
			@ApiResponse(responseCode = "405", description = "Method Not allowed"),
			@ApiResponse(responseCode = "409", description = "Conflict"),
			@ApiResponse(responseCode = "500", description = "Internal Server Error") })
	@RequestMapping(value = "/appointment",
			produces = { "application/json;charset=utf-8" },
			consumes = { "application/json;charset=utf-8" },
			method = RequestMethod.POST)
	@Override
	public ResponseEntity<Appointment> createAppointment(
			@Parameter(description = "The Appointment to be created", required = true) @Valid @RequestBody Appointment appointment)
	{
		try
		{
			final Appointment result = getDataMapper().map(appointment,
					Appointment.class);
			final SimpleDateFormat format = new SimpleDateFormat(DATE_FORMAT, Locale.US);
			result.setId(Long.toHexString(Double.doubleToLongBits(Math.random())));
			result.setHref("https://localhost:9002/b2ctelcomocks/appointment/" + result.getId());
			result.setLastUpdate(format.parse("2019-08-21T12:11:13"));
			result.setAtSchemaLocation("https://api-appointment-v4-0-0.mybluemix.net/docs/#/");
			result.setAtType("Appointment");
			result.setAtBaseType("Appointment");
			result.setCreationTime(format.parse("2019-08-21T12:11:13"));
			result.setStatus(AppointmentStateType.INITIALIZED);

			final String content = new String(
					Files.readAllBytes(Paths.get(new ClassPathResource(APPOINTMENT_JSON_URL).getURI())));
			final ObjectMapper mapper = new ObjectMapper();
			final List<Appointment> appointments = mapper.readValue(content, new TypeReference<>()
			{
			});
			appointments.add(result);

			final String jsonResult = mapper.writeValueAsString(appointments);
			final File appointmentFile = new File(new ClassPathResource(APPOINTMENT_JSON_URL).getURI());
			final FileWriter fileWriter = new FileWriter(appointmentFile, false);
			fileWriter.write(jsonResult);
			fileWriter.close();
			return new ResponseEntity<>(result, HttpStatus.CREATED);
		}
		catch (final ParseException | IOException e)
		{
			return getUnsuccessfulResponse(BAD_REQUEST, e, HttpStatus.BAD_REQUEST);
		}
	}

	@Operation(summary = "Search a time slot", operationId = "searchTimeSlot", description = "This operation search a Time Slot entity.")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "201", description = "Created"),
			@ApiResponse(responseCode = "400", description = "Bad Request"),
			@ApiResponse(responseCode = "405", description = "Method Not allowed"),
			@ApiResponse(responseCode = "409", description = "Conflict"),
			@ApiResponse(responseCode = "500", description = "Internal Server Error") })
	@RequestMapping(value = "/searchTimeSlot",
			produces = { "application/json;charset=utf-8" },
			consumes = { "application/json;charset=utf-8" },
			method = RequestMethod.POST)
	@Override
	public ResponseEntity<SearchTimeSlot> searchTimeSlot(
			@Parameter(description = "The Time Slot to be created", required = true) @Valid @RequestBody SearchTimeSlot searchTimeSlot)
	{
		final SearchTimeSlot result = new SearchTimeSlot();
		final SimpleDateFormat format = new SimpleDateFormat(DATE_FORMAT, Locale.US);
		getDataMapper().map(searchTimeSlot, result, false);
		result.setId("99");
		result.setHref(SEARCHTIMESLOT_HREF_ROOT + result.getId());
		result.setStatus("created");
		try
		{
			result.setSearchDate(format.parse("2018-08-28T00:00:00"));
		}
		catch (ParseException e)
		{
			throw new RuntimeException(e);
		}
		result.setSearchResult("success");

		final TimeSlot availableTimeSlotMockWsDTO = new TimeSlot();
		availableTimeSlotMockWsDTO.setId("365");
		availableTimeSlotMockWsDTO.setHref(AVAILABLETIMESLOT_HREF_ROOT + availableTimeSlotMockWsDTO.getId());

		if (CollectionUtils.isEmpty(searchTimeSlot.getRequestedTimeSlot())
				|| searchTimeSlot.getRequestedTimeSlot().get(0).getValidFor() == null
				|| searchTimeSlot.getRequestedTimeSlot().get(0).getValidFor().getStartDateTime() == null)
		{
			final Exception e = new Exception("Error occurred due to bad request");
			return getUnsuccessfulResponse(BAD_REQUEST, e, HttpStatus.BAD_REQUEST);
		}

		final Date startDate = searchTimeSlot.getRequestedTimeSlot().get(0).getValidFor().getStartDateTime();

		final SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT);
		final Calendar calendarStart = Calendar.getInstance();
		final Calendar calendarEnd = Calendar.getInstance();
		calendarStart.setTime(startDate);
		calendarStart.add(Calendar.HOUR, 8);
		calendarEnd.setTime(startDate);
		calendarEnd.add(Calendar.HOUR, 10);

		final TimeSlot availableTimeSlotMockWsDTO1 = createAvailableTimeSlot("365",
				createRelatedParty("56", "John Doe", "technician"), createValidFor(dateFormat.format(calendarStart.getTime()),
						dateFormat.format(calendarEnd.getTime())));

		calendarStart.add(Calendar.HOUR, 2);
		calendarEnd.add(Calendar.HOUR, 2);
		final TimeSlot availableTimeSlotMockWsDTO2 = createAvailableTimeSlot("921",
				createRelatedParty("56", "John Doe", "technician"), createValidFor(dateFormat.format(calendarStart.getTime()),
						dateFormat.format(calendarEnd.getTime())));

		calendarStart.add(Calendar.HOUR, 2);
		calendarEnd.add(Calendar.HOUR, 2);
		final TimeSlot availableTimeSlotMockWsDTO3 = createAvailableTimeSlot("325", createRelatedParty("58", "Adam Smith", "technician"),
				createValidFor(dateFormat.format(calendarStart.getTime()),
						dateFormat.format(calendarEnd.getTime())));

		calendarStart.add(Calendar.HOUR, 2);
		calendarEnd.add(Calendar.HOUR, 2);
		final TimeSlot availableTimeSlotMockWsDTO4 = createAvailableTimeSlot("326",
				createRelatedParty("58", "Adam Smith", "technician"), createValidFor(dateFormat.format(calendarStart.getTime()),
						dateFormat.format(calendarEnd.getTime())));

		calendarStart.add(Calendar.HOUR, 2);
		calendarEnd.add(Calendar.HOUR, 2);
		final TimeSlot availableTimeSlotMockWsDTO5 = createAvailableTimeSlot("327",
				createRelatedParty("59", "Dave Hunt", "technician"), createValidFor(dateFormat.format(calendarStart.getTime()),
						dateFormat.format(calendarEnd.getTime())));

		calendarStart.add(Calendar.HOUR, 2);
		calendarEnd.add(Calendar.HOUR, 2);
		final TimeSlot availableTimeSlotMockWsDTO6 = createAvailableTimeSlot("328",
				createRelatedParty("59", "Dave Hunt", "technician"), createValidFor(dateFormat.format(calendarStart.getTime()),
						dateFormat.format(calendarEnd.getTime())));

		final List<TimeSlot> tmaAvailableTimeSlotMockWsDTOList = new ArrayList<>();
		tmaAvailableTimeSlotMockWsDTOList.add(availableTimeSlotMockWsDTO1);
		tmaAvailableTimeSlotMockWsDTOList.add(availableTimeSlotMockWsDTO2);
		tmaAvailableTimeSlotMockWsDTOList.add(availableTimeSlotMockWsDTO3);
		tmaAvailableTimeSlotMockWsDTOList.add(availableTimeSlotMockWsDTO4);
		tmaAvailableTimeSlotMockWsDTOList.add(availableTimeSlotMockWsDTO5);
		tmaAvailableTimeSlotMockWsDTOList.add(availableTimeSlotMockWsDTO6);
		result.setAvailableTimeSlot(tmaAvailableTimeSlotMockWsDTOList);

		return new ResponseEntity<>(result, HttpStatus.CREATED);
	}

	private boolean contains(final List<Appointment> list, final String id)
	{
		return !list.stream().filter(appointment -> appointment.getId().contains(id))
				.collect(Collectors.toList()).isEmpty();
	}

	private Appointment retrieveAppointment(final List<Appointment> list, final String id)
	{
		return list.stream().filter(appointment -> appointment.getId().contains(id)).toList().get(0);
	}

	private List<Appointment> removeAppointment(final List<Appointment> list,
			final String id)
	{
		return list.stream().filter(appointment -> !appointment.getId().contains(id)).collect(Collectors.toList());
	}

	private TimeSlot createAvailableTimeSlot(final String id,
			final RelatedParty relatedParty, final TimePeriod period)
	{
		final TimeSlot availableTimeSlot = new TimeSlot();
		availableTimeSlot.setId(id);
		availableTimeSlot.setHref(AVAILABLETIMESLOT_HREF_ROOT + availableTimeSlot.getId());
		availableTimeSlot.setRelatedParty(relatedParty);
		availableTimeSlot.setValidFor(period);
		return availableTimeSlot;
	}

	private TimePeriod createValidFor(final String startDateTime, final String endDateTime)
	{
		final SimpleDateFormat format = new SimpleDateFormat(DATE_FORMAT, Locale.US);
		final TimePeriod validForMockWsDTO = new TimePeriod();
		try
		{
			validForMockWsDTO.setEndDateTime(format.parse(endDateTime));
			validForMockWsDTO.setStartDateTime(format.parse(startDateTime));
		}
		catch (ParseException e)
		{
			throw new RuntimeException(e);
		}
		return validForMockWsDTO;
	}

	private RelatedParty createRelatedParty(final String id, final String name, final String role)
	{
		final RelatedParty tmaTmfRelatedParty = new RelatedParty();
		tmaTmfRelatedParty.setId(id);
		tmaTmfRelatedParty.setHref(CREATERELATEDPARTY_HREF_ROOT + tmaTmfRelatedParty.getId());
		tmaTmfRelatedParty.setName(name);
		tmaTmfRelatedParty.setRole(role);
		return tmaTmfRelatedParty;
	}
}
