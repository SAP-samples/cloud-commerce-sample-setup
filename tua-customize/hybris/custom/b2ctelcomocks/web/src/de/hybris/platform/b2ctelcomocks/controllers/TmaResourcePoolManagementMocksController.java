/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.controllers;

import de.hybris.platform.b2ctelcomocks.api.ResourcePoolManagementApi;
import de.hybris.platform.b2ctelcomocks.dto.AppliedCapacityAmount;
import de.hybris.platform.b2ctelcomocks.dto.AppliedResourceCapacity;
import de.hybris.platform.b2ctelcomocks.dto.Availability;
import de.hybris.platform.b2ctelcomocks.dto.Reservation;
import de.hybris.platform.b2ctelcomocks.dto.ReservationItem;
import de.hybris.platform.b2ctelcomocks.dto.ReservationStateType;
import de.hybris.platform.b2ctelcomocks.dto.ResourceCapacityDemand;
import de.hybris.platform.tuawebservicesresources.v2.dto.ResourceRef;
import de.hybris.platform.b2ctelcomocks.dto.ValueRef;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;


@Controller
public class TmaResourcePoolManagementMocksController extends TmaBaseController implements ResourcePoolManagementApi
{
	private static final String MSISDNS_URL = "b2ctelcomocks/json/resourcePoolManagement/msisdns.json";
	private static final String RESERVATION_MSISDNS_URL = "b2ctelcomocks/json/resourcePoolManagement/reservationMsisdn.json";

	@Operation(summary = "Checks the availability", operationId = "availabilityCheck", description = "This operation checks the availability")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "201", description = "Created"),
			@ApiResponse(responseCode = "400", description = "Bad Request"),
			@ApiResponse(responseCode = "405", description = "Method Not allowed"),
			@ApiResponse(responseCode = "409", description = "Conflict"),
			@ApiResponse(responseCode = "500", description = "Internal Server Error") })
	@RequestMapping(value = "/resourcePoolManagement/availabilityCheck",
			produces = { "application/json;charset=utf-8" },
			consumes = { "application/json;charset=utf-8" },
			method = RequestMethod.POST)
	@Override
	public ResponseEntity<Availability> availabilityCheck()
	{
		try
		{
			final String randomId1 = Long.toHexString(Double.doubleToLongBits(Math.random()));
			final String randomId2 = Long.toHexString(Double.doubleToLongBits(Math.random()));
			final String randomId3 = Long.toHexString(Double.doubleToLongBits(Math.random()));
			final String randomId4 = Long.toHexString(Double.doubleToLongBits(Math.random()));
			final String randomId5 = Long.toHexString(Double.doubleToLongBits(Math.random()));
			final String randomId6 = Long.toHexString(Double.doubleToLongBits(Math.random()));

			final String content = new String(
					Files.readAllBytes(Paths.get(
							new ClassPathResource(MSISDNS_URL).getURI())));
			final ObjectMapper mapper = new ObjectMapper();
			final List<String> msisdns = mapper.readValue(content, new TypeReference<>()
			{
			});

			final AppliedResourceCapacity result = new AppliedResourceCapacity();
			result.setAppliedCapacityAmount("6");
			result.setResource(
					Arrays.asList(createResourceRef(randomId1, msisdns.get(0)), createResourceRef(randomId2, msisdns.get(1)),
							createResourceRef(randomId3, msisdns.get(2)), createResourceRef(randomId4, msisdns.get(3)),
							createResourceRef(randomId5, msisdns.get(4)), createResourceRef(randomId6, msisdns.get(5))));
			final Availability availability = new Availability();
			availability.setAppliedResourceCapacity(result);

			return new ResponseEntity<>(availability, HttpStatus.OK);
		}
		catch (final IOException e)
		{
			return getUnsuccessfulResponse(BAD_REQUEST, e, HttpStatus.BAD_REQUEST);
		}
	}

	@Operation(summary = "Creates an Reservation", operationId = "createReservation", description = "This operation creates a Reservation entity.")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "201", description = "Created"),
			@ApiResponse(responseCode = "400", description = "Bad Request"),
			@ApiResponse(responseCode = "405", description = "Method Not allowed"),
			@ApiResponse(responseCode = "409", description = "Conflict"),
			@ApiResponse(responseCode = "500", description = "Internal Server Error") })
	@RequestMapping(value = "/resourcePoolManagement/reservation",
			produces = { "application/json;charset=utf-8" },
			consumes = { "application/json;charset=utf-8" },
			method = RequestMethod.POST)
	@Override
	public ResponseEntity<Reservation> createReservation(
			@Parameter(description = "The Reservation to be created", required = true) @Valid @RequestBody Reservation reservation)
	{
		try
		{
			if (reservation.getProductOffering() == null)
			{
				return getUnsuccessfulResponse(BAD_REQUEST, HttpStatus.BAD_REQUEST);
			}

			final Reservation reservationContext = new Reservation();

			final ResourceRef resourceRefContext =
					reservation.getReservationItem().get(0).getAppliedCapacityAmount().get(0).getResource().get(0);

			final String dynamicId = Long.toHexString(Double.doubleToLongBits(Math.random()));

			final String content = new String(Files.readAllBytes(Paths.get(new ClassPathResource(MSISDNS_URL).getURI())));
			final ObjectMapper mapper = new ObjectMapper();
			final List<String> msisdns = mapper.readValue(content, new TypeReference<>()
			{
			});

			if (!msisdns.contains(resourceRefContext.getValue()))
			{
				return getUnsuccessfulResponse(BAD_REQUEST, HttpStatus.BAD_REQUEST);
			}
			msisdns.remove(resourceRefContext.getValue());
			final Random rnd = new Random();
			int num = rnd.nextInt(90000000) + 100000000;
			final File msisdnsFile = new File(
					new ClassPathResource(MSISDNS_URL).getURI());
			final FileWriter fileWriter = new FileWriter(msisdnsFile, false);
			msisdns.add("+91 7" + num);
			fileWriter.write(mapper.writeValueAsString(msisdns));
			fileWriter.close();

			final String contentReservationsMsisdn = new String(
					Files.readAllBytes(Paths.get(new ClassPathResource(MSISDNS_URL).getURI())));
			final List<String> reservationsMsisdn = mapper.readValue(contentReservationsMsisdn, new TypeReference<>()
			{
			});

			if (reservation.getRelatedParty() != null && reservationsMsisdn.contains(dynamicId))
			{
				return getUnsuccessfulResponse("A reservation is already created!", HttpStatus.BAD_REQUEST);
			}

			reservationContext.setId(dynamicId);
			reservationContext.setHref("https://hostname:port/ResourcePoolManagement/reservation/" + dynamicId);
			reservationContext.setAtType("resourceItemReservation");
			reservationContext.setReservationState(ReservationStateType.COMPLETED);

			if (CollectionUtils.isNotEmpty(reservation.getRelatedParty()))
			{
				reservationContext.setRelatedParty(Arrays.asList(reservation.getRelatedParty().get(0)));
			}

			if (reservation.getProductOffering() != null)
			{
				reservationContext.setProductOffering(reservation.getProductOffering());
			}

			reservationContext.setReservationItem(Arrays.asList(createReservationItem(Arrays.asList(createResourceCapacityDemand()),
					Arrays.asList(createAppliedCapacityAmount(Arrays.asList(resourceRefContext))))));


			final String contentReservationMsisdn = new String(
					Files.readAllBytes(Paths.get(new ClassPathResource(RESERVATION_MSISDNS_URL).getURI())));
			final List<Reservation> reservationMsisdnJsonList = mapper.readValue(contentReservationMsisdn, new TypeReference<>()
			{
			});

			reservationMsisdnJsonList.add(reservationContext);

			final File reservationMsisdnFile = new File(new ClassPathResource(RESERVATION_MSISDNS_URL).getURI());
			FileWriter fileWriter2 = new FileWriter(reservationMsisdnFile, false);
			fileWriter2.write(mapper.writeValueAsString(reservationMsisdnJsonList));
			fileWriter2.close();
			return new ResponseEntity<>(reservationContext, HttpStatus.CREATED);
		}
		catch (final IOException e)
		{
			return getUnsuccessfulResponse(BAD_REQUEST, e, HttpStatus.BAD_REQUEST);
		}
	}

	@Operation(summary = "Retrieves a list of Reservations", operationId = "reservationGet", description = "This operation retrieves a list of Reservation entity.")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Success"),
			@ApiResponse(responseCode = "400", description = "Bad Request  List of supported error codes: - 20: Invalid URL parameter value - 21: Missing body - 22: Invalid body - 23: Missing body field - 24: Invalid body field - 25: Missing header - 26: Invalid header value - 27: Missing query-string parameter - 28: Invalid query-string parameter value"),
			@ApiResponse(responseCode = "404", description = "Not Found  List of supported error codes: - 60: Resource not found"),
			@ApiResponse(responseCode = "405", description = "Method Not Allowed  List of supported error codes: - 61: Method not allowed"),
			@ApiResponse(responseCode = "409", description = "Conflict  The request could not be completed due to a conflict with the current state of the target resource."),
			@ApiResponse(responseCode = "422", description = "Unprocessable entity  Functional error"),
			@ApiResponse(responseCode = "500", description = "Internal Server Error  List of supported error codes: - 1: Internal error") })
	@RequestMapping(value = "/resourcePoolManagement/reservation",
			produces = { "application/json;charset=utf-8" },
			consumes = { "application/json;charset=utf-8" },
			method = RequestMethod.GET)
	@Override
	public ResponseEntity<Reservation> reservationGet(@NotNull @Parameter(description = "Identifier of the Related Party",
			required = true) @Valid @RequestParam(value = "relatedParty.id", required = true) String relatedPartyPeriodid,
			@NotNull @Parameter(description = "reservationItem.appliedCapacityAmount.resource.value", required = true) @Valid @RequestParam(value = "value", required = false) String value)
	{
		try
		{
			final String content = new String(
					Files.readAllBytes(Paths.get(
							new ClassPathResource(RESERVATION_MSISDNS_URL).getURI())));
			final ObjectMapper mapper = new ObjectMapper();
			final List<Reservation> reservationMsisdnJsonList = mapper.readValue(content, new TypeReference<>()
			{
			});

			if (!contains(reservationMsisdnJsonList, relatedPartyPeriodid))
			{
				return getUnsuccessfulResponse(BAD_REQUEST, HttpStatus.BAD_REQUEST);
			}
			return new ResponseEntity(retrieveReservations(reservationMsisdnJsonList, relatedPartyPeriodid), HttpStatus.OK);

		}
		catch (final IOException e)
		{
			return getUnsuccessfulResponse(BAD_REQUEST, e, HttpStatus.BAD_REQUEST);
		}
	}

	@Operation(summary = "Patch a Reservation", operationId = "reservationPatch", description = "This operation allows partial updates of a Reservation entity")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Success"),
			@ApiResponse(responseCode = "400", description = "Bad Request  List of supported error codes: - 20: Invalid URL parameter value - 21: Missing body - 22: Invalid body - 23: Missing body field - 24: Invalid body field - 25: Missing header - 26: Invalid header value - 27: Missing query-string parameter - 28: Invalid query-string parameter value"),
			@ApiResponse(responseCode = "404", description = "Not Found  List of supported error codes: - 60: Resource not found"),
			@ApiResponse(responseCode = "405", description = "Method Not Allowed  List of supported error codes: - 61: Method not allowed"),
			@ApiResponse(responseCode = "409", description = "Conflict  The request could not be completed due to a conflict with the current state of the target resource."),
			@ApiResponse(responseCode = "422", description = "Unprocessable entity  Functional error"),
			@ApiResponse(responseCode = "500", description = "Internal Server Error  List of supported error codes: - 1: Internal error") })
	@RequestMapping(value = "/resourcePoolManagement/reservation/{reservationId}",
			produces = { "application/json;charset=utf-8" },
			consumes = { "application/json;charset=utf-8" },
			method = RequestMethod.PATCH)
	@Override
	public ResponseEntity<Reservation> reservationPatch(
			@Parameter(description = "", required = true) @PathVariable("reservationId") String reservationId,
			@Parameter(description = "", required = true) @Valid @RequestBody ValueRef resourceRef)
	{
		try
		{
			final ObjectMapper mapper = new ObjectMapper();
			final String contentReservationMsisdn = new String(
					Files.readAllBytes(Paths.get(
							new ClassPathResource(RESERVATION_MSISDNS_URL).getURI())));
			final List<Reservation> reservationMsisdnJsonList = mapper.readValue(contentReservationMsisdn, new TypeReference<>()
			{
			});

			if (!containsReservation(reservationMsisdnJsonList, reservationId))
			{
				return getUnsuccessfulResponse("Requested reservation does not exists!", HttpStatus.NOT_FOUND);
			}

			final String content = new String(
					Files.readAllBytes(Paths.get(
							new ClassPathResource(MSISDNS_URL).getURI())));
			final List<String> msisdns = mapper.readValue(content, new TypeReference<>()
			{
			});

			if (!msisdns.contains(resourceRef.getValue().getValue()))
			{
				return getUnsuccessfulResponse(BAD_REQUEST, HttpStatus.BAD_REQUEST);
			}

			final Reservation result = retrieveReservation(reservationMsisdnJsonList, reservationId);
			result.getReservationItem().get(0).getAppliedCapacityAmount().get(0).getResource().get(0)
					.setId(resourceRef.getValue().getId());
			result.getReservationItem().get(0).getAppliedCapacityAmount().get(0).getResource().get(0)
					.setHref(resourceRef.getValue().getHref());
			result.getReservationItem().get(0).getAppliedCapacityAmount().get(0).getResource().get(0)
					.setValue(resourceRef.getValue().getValue());

			final List<Reservation> updatedList = removeReservation(reservationMsisdnJsonList, reservationId);
			updatedList.add(result);

			final String jsonResult = mapper.writeValueAsString(updatedList);
			final File reservationsFile = new File(
					new ClassPathResource(RESERVATION_MSISDNS_URL).getURI());
			FileWriter fileWriter = new FileWriter(reservationsFile, false);
			fileWriter.write(jsonResult);
			fileWriter.close();

			msisdns.remove(resourceRef.getValue().getValue());
			final Random rnd = new Random();
			int num = rnd.nextInt(90000000) + 100000000;
			final File msisdnsFile = new File(
					new ClassPathResource(MSISDNS_URL).getURI());
			final FileWriter fileWriter2 = new FileWriter(msisdnsFile, false);
			msisdns.add("+91 7" + num);
			fileWriter2.write(mapper.writeValueAsString(msisdns));
			fileWriter2.close();

			return new ResponseEntity<>(result, HttpStatus.OK);
		}
		catch (final IOException e)
		{
			return getUnsuccessfulResponse(BAD_REQUEST, e, HttpStatus.BAD_REQUEST);
		}
	}


	private boolean contains(final List<Reservation> list, final String id)
	{
		return !list.stream().filter(reservation -> reservation.getRelatedParty().get(0).getId().contains(id))
				.collect(Collectors.toList()).isEmpty();
	}

	private boolean containsReservation(final List<Reservation> list, final String id)
	{
		return !list.stream().filter(reservation -> reservation.getId().contains(id))
				.collect(Collectors.toList()).isEmpty();
	}

	private List<Reservation> retrieveReservations(final List<Reservation> list, final String id)
	{
		return list.stream().filter(reservation -> reservation.getRelatedParty().get(0).getId().contains(id)).toList();
	}

	private Reservation retrieveReservation(final List<Reservation> list, final String id)
	{
		return list.stream().filter(reservation -> reservation.getId().contains(id)).toList().get(0);
	}

	private List<Reservation> removeReservation(final List<Reservation> list,
			final String id)
	{
		return list.stream().filter(reservation -> !reservation.getId().contains(id)).collect(Collectors.toList());
	}

	private ReservationItem createReservationItem(final List<ResourceCapacityDemand> resourceCapacityDemandList,
			final List<AppliedCapacityAmount> appliedCapacityAmountList)
	{
		final ReservationItem reservationItem = new ReservationItem();
		reservationItem.setQuantity(1F);
		reservationItem.setResourceCapacity(resourceCapacityDemandList);
		reservationItem.setAppliedCapacityAmount(appliedCapacityAmountList);
		reservationItem.setSubReservationState("COMPLETED");
		return reservationItem;
	}

	private ResourceCapacityDemand createResourceCapacityDemand()
	{
		final ResourceCapacityDemand resourceCapacityDemand = new ResourceCapacityDemand();
		resourceCapacityDemand.setCapacityDemandAmount(1F);
		resourceCapacityDemand.setType("Resource");
		return resourceCapacityDemand;
	}

	private AppliedCapacityAmount createAppliedCapacityAmount(final List<ResourceRef> resourceRefList)
	{
		final AppliedCapacityAmount appliedCapacityAmount = new AppliedCapacityAmount();
		appliedCapacityAmount.setAppliedCapacityAmount(1F);
		appliedCapacityAmount.resource(resourceRefList);
		return appliedCapacityAmount;
	}

	private ResourceRef createResourceRef(final String id, final String msisdn)
	{
		final ResourceRef resourceRef = new ResourceRef();
		resourceRef.setId(id);
		resourceRef.setHref("http://server:port/resourceInventoryManagement/logicalResource/" + id);
		resourceRef.setAtReferredType("Resource");
		resourceRef.setValue(msisdn);
		return resourceRef;
	}
}
