/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */

package de.hybris.platform.b2ctelcomocks.controllers;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;


@Controller
public class TmaResetFilesController extends TmaBaseController
{
	@Operation(summary = "Reset files content", operationId = "resetFiles", description = "resetFiles")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Success"),
			@ApiResponse(responseCode = "400", description = "Bad Request"),
			@ApiResponse(responseCode = "405", description = "Method Not allowed"),
			@ApiResponse(responseCode = "409", description = "Conflict"),
			@ApiResponse(responseCode = "500", description = "Internal Server Error") })
	@RequestMapping(value = "/resetFiles",
			produces = { "application/json;charset=utf-8" },
			method = RequestMethod.DELETE)
	public ResponseEntity<?> resetFiles()
	{
		try
		{
			final List<String> filesSizes = new ArrayList<>();
			final String appointmentBackup = new String(
					Files.readAllBytes(
							Paths.get(new ClassPathResource("b2ctelcomocks/json/appointment/appointment_backup.json").getURI())));
			final File appointmentFile = new File(new ClassPathResource("b2ctelcomocks/json/appointment/appointment.json").getURI());
			filesSizes.add(getSizeInMegaBytes(appointmentFile));

			final FileWriter appointmentFileWriter = new FileWriter(appointmentFile);
			appointmentFileWriter.write(appointmentBackup);
			appointmentFileWriter.close();

			final String reservationMsisdnBackup = new String(
					Files.readAllBytes(Paths.get(
							new ClassPathResource("b2ctelcomocks/json/resourcePoolManagement/reservationMsisdn_backup.json").getURI())));
			final File reservationMsisdnFile = new File(
					new ClassPathResource("b2ctelcomocks/json/resourcePoolManagement/reservationMsisdn.json").getURI());
			filesSizes.add(getSizeInMegaBytes(reservationMsisdnFile));

			final FileWriter reservationMsisdnFileWriter = new FileWriter(reservationMsisdnFile);
			reservationMsisdnFileWriter.write(reservationMsisdnBackup);
			reservationMsisdnFileWriter.close();

			return new ResponseEntity<>(filesSizes.toString(), HttpStatus.OK);
		}
		catch (final IOException e)
		{
			return getUnsuccessfulResponse(BAD_REQUEST, e, HttpStatus.BAD_REQUEST);
		}
	}

	private static String getSizeInMegaBytes(File file)
	{
		return "File name: " + file.getName() + " File size= " + (double) file.length() / (1024 * 1024) + " mb";
	}
}
