/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.api;

import de.hybris.platform.b2ctelcomocks.dto.QueryServiceQualification;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;


public interface QueryServiceQualificationApi
{

	@Operation(summary = "Creates a QueryServiceQualification", description = "This operation creates a QueryServiceQualification entity.", tags = {
			"QueryServiceQualification" })
	@ApiResponses(value = {
			@ApiResponse(responseCode = "201", description = "Created", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = QueryServiceQualification.class))),

			@ApiResponse(responseCode = "400", description = "Bad Request", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = de.hybris.platform.tuawebservicesresources.v2.dto.Error.class))),

			@ApiResponse(responseCode = "405", description = "Method Not allowed", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = de.hybris.platform.tuawebservicesresources.v2.dto.Error.class))),

			@ApiResponse(responseCode = "409", description = "Conflict", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = de.hybris.platform.tuawebservicesresources.v2.dto.Error.class))),

			@ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content(mediaType = "application/json;charset&#x3D;utf-8", schema = @Schema(implementation = de.hybris.platform.tuawebservicesresources.v2.dto.Error.class))) })
	@RequestMapping(value = "/queryServiceQualification",
			produces = { "application/json;charset=utf-8" },
			consumes = { "application/json;charset=utf-8" },
			method = RequestMethod.POST)
	ResponseEntity<QueryServiceQualification> createQueryServiceQualification(
			@Parameter(in = ParameterIn.DEFAULT, description = "The QueryServiceQualification to be created", required = true, schema = @Schema()) @Valid @RequestBody QueryServiceQualification body);

}

