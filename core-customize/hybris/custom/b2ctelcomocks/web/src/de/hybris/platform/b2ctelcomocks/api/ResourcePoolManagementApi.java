/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.api;

import de.hybris.platform.b2ctelcomocks.dto.Availability;
import de.hybris.platform.b2ctelcomocks.dto.ErrorRepresentation;
import de.hybris.platform.b2ctelcomocks.dto.Reservation;
import de.hybris.platform.b2ctelcomocks.dto.ValueRef;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;


public interface ResourcePoolManagementApi
{

	@Operation(summary = "Checks the availability", description = "This operation checks the availability", tags = {
			"AvailabilityCheck" })
	@ApiResponses(value = {
			@ApiResponse(responseCode = "201", description = "Created", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = Availability.class))),

			@ApiResponse(responseCode = "400", description = "Bad Request", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = de.hybris.platform.tuawebservicesresources.v2.dto.Error.class))),

			@ApiResponse(responseCode = "405", description = "Method Not allowed", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = de.hybris.platform.tuawebservicesresources.v2.dto.Error.class))),

			@ApiResponse(responseCode = "409", description = "Conflict", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = de.hybris.platform.tuawebservicesresources.v2.dto.Error.class))),

			@ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = de.hybris.platform.tuawebservicesresources.v2.dto.Error.class))) })
	@RequestMapping(value = "/resourcePoolManagement/availabilityCheck",
			produces = { "application/json;charset=utf-8" },
			method = RequestMethod.POST)
	ResponseEntity<Availability> availabilityCheck();


	@Operation(summary = "Creates an Reservation", description = "This operation creates a Reservation entity.", tags = {
			"Reservation" })
	@ApiResponses(value = {
			@ApiResponse(responseCode = "201", description = "Created", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = Reservation.class))),

			@ApiResponse(responseCode = "400", description = "Bad Request", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = de.hybris.platform.tuawebservicesresources.v2.dto.Error.class))),

			@ApiResponse(responseCode = "405", description = "Method Not allowed", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = de.hybris.platform.tuawebservicesresources.v2.dto.Error.class))),

			@ApiResponse(responseCode = "409", description = "Conflict", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = de.hybris.platform.tuawebservicesresources.v2.dto.Error.class))),

			@ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = de.hybris.platform.tuawebservicesresources.v2.dto.Error.class))) })
	@RequestMapping(value = "/resourcePoolManagement/reservation",
			produces = { "application/json;charset=utf-8" },
			consumes = { "application/json;charset=utf-8" },
			method = RequestMethod.POST)
	ResponseEntity<Reservation> createReservation(
			@Parameter(in = ParameterIn.DEFAULT, description = "The Reservation to be created", required = true, schema = @Schema()) @Valid @RequestBody Reservation body);


	@Operation(summary = "Retrieves a list of Reservations", description = "This operation retrieves a list of Reservation entity.", tags = {
			"Reservation" })
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Success", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = Reservation.class))),

			@ApiResponse(responseCode = "400", description = "Bad Request  List of supported error codes: - 20: Invalid URL parameter value - 21: Missing body - 22: Invalid body - 23: Missing body field - 24: Invalid body field - 25: Missing header - 26: Invalid header value - 27: Missing query-string parameter - 28: Invalid query-string parameter value", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = ErrorRepresentation.class))),

			@ApiResponse(responseCode = "404", description = "Not Found  List of supported error codes: - 60: Resource not found", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = ErrorRepresentation.class))),

			@ApiResponse(responseCode = "405", description = "Method Not Allowed  List of supported error codes: - 61: Method not allowed", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = ErrorRepresentation.class))),

			@ApiResponse(responseCode = "409", description = "Conflict  The request could not be completed due to a conflict with the current state of the target resource.", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = ErrorRepresentation.class))),

			@ApiResponse(responseCode = "422", description = "Unprocessable entity  Functional error", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = ErrorRepresentation.class))),

			@ApiResponse(responseCode = "500", description = "Internal Server Error  List of supported error codes: - 1: Internal error", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = ErrorRepresentation.class))) })
	@RequestMapping(value = "/resourcePoolManagement/reservation",
			produces = { "application/json;charset=utf-8" },
			method = RequestMethod.GET)
	ResponseEntity<Reservation> reservationGet(
			@NotNull @Parameter(in = ParameterIn.QUERY, description = "Identifier of the Related Party", required = true, schema = @Schema()) @Valid @RequestParam(value = "relatedParty.id", required = true) String relatedPartyId,
			@Parameter(in = ParameterIn.QUERY, description = "reservationItem.appliedCapacityAmount.resource.value", schema = @Schema()) @Valid @RequestParam(value = "value", required = false) String value);


	@Operation(summary = "Patch a Reservation", description = "This operation allows partial updates of a Reservation entity", tags = {
			"Reservation" })
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Success", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = Reservation.class))),

			@ApiResponse(responseCode = "400", description = "Bad Request  List of supported error codes: - 20: Invalid URL parameter value - 21: Missing body - 22: Invalid body - 23: Missing body field - 24: Invalid body field - 25: Missing header - 26: Invalid header value - 27: Missing query-string parameter - 28: Invalid query-string parameter value", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = ErrorRepresentation.class))),

			@ApiResponse(responseCode = "404", description = "Not Found  List of supported error codes: - 60: Resource not found", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = ErrorRepresentation.class))),

			@ApiResponse(responseCode = "405", description = "Method Not Allowed  List of supported error codes: - 61: Method not allowed", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = ErrorRepresentation.class))),

			@ApiResponse(responseCode = "409", description = "Conflict  The request could not be completed due to a conflict with the current state of the target resource.", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = ErrorRepresentation.class))),

			@ApiResponse(responseCode = "422", description = "Unprocessable entity  Functional error", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = ErrorRepresentation.class))),

			@ApiResponse(responseCode = "500", description = "Internal Server Error  List of supported error codes: - 1: Internal error", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = ErrorRepresentation.class))) })
	@RequestMapping(value = "/resourcePoolManagement/reservation/{reservationId}",
			produces = { "application/json;charset=utf-8" },
			consumes = { "application/json;charset=utf-8" },
			method = RequestMethod.PATCH)
	ResponseEntity<Reservation> reservationPatch(
			@Parameter(in = ParameterIn.PATH, description = "", required = true, schema = @Schema()) @PathVariable("reservationId") String reservationId,
			@Parameter(in = ParameterIn.DEFAULT, description = "", required = true, schema = @Schema()) @Valid @RequestBody ValueRef body);

}

