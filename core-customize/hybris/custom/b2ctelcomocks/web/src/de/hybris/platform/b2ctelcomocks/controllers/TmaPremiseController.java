/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.controllers;

import de.hybris.platform.b2ctelcomocks.api.PremiseApi;
import de.hybris.platform.b2ctelcomocks.dto.PremiseAddress;
import de.hybris.platform.b2ctelcomocks.dto.PremiseDetails;
import de.hybris.platform.b2ctelcomocks.dto.PremiseLookupResp;
import de.hybris.platform.b2ctelcomocks.dto.Street;
import de.hybris.platform.b2ctelcomocks.dto.TechnicalResource;
import de.hybris.platform.b2ctelcomocks.dto.TechnicalResourceType;
import de.hybris.platform.b2ctelcomocks.dto.Town;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;



@Controller
public class TmaPremiseController extends TmaBaseController implements PremiseApi
{
	@Override
	@Operation(summary = "", operationId = "premiselookup", description = "")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Success"),
			@ApiResponse(responseCode = "400", description = "Bad Request"),
			@ApiResponse(responseCode = "405", description = "Method Not allowed"),
			@ApiResponse(responseCode = "409", description = "Conflict"),
			@ApiResponse(responseCode = "500", description = "Internal Server Error") })
	@RequestMapping(value = "/premise/premiselookup",
			produces = { "application/json;charset=utf-8" },
			consumes = { "application/json;charset=utf-8" },
			method = RequestMethod.POST)
	public ResponseEntity<PremiseLookupResp> premiselookup(
			@Parameter(description = "", required = true) @Valid @RequestBody PremiseDetails premiseDetails)
	{
		try
		{
			Set<PremiseDetails> premiseDetailsSet = createPremiseDetailsSet();
			if (!premiseDetailsSet.contains(premiseDetails))
			{
				throw new Exception("Premise details could not be validated – please contact 1800-222-2222 for assistance.");
			}

			final TechnicalResource technicalResource1 = new TechnicalResource();
			technicalResource1.setId("72990");
			technicalResource1.setType(TechnicalResourceType.METER);

			final TechnicalResource technicalResource2 = new TechnicalResource();
			technicalResource2.setId("0.0.2.4.1.1.12.0.0.0.0.0.0.0.0.3.72.0");
			technicalResource2.setType(TechnicalResourceType.READING_TYPE);

			final TechnicalResource technicalResource3 = new TechnicalResource();
			technicalResource3.setId("electricity");
			technicalResource3.setType(TechnicalResourceType.DIVISION);

			final PremiseLookupResp premiseLookupResp = new PremiseLookupResp();
			premiseLookupResp.setStatus("SUCCESS");
			premiseLookupResp.setTechnicalResources(Arrays.asList(technicalResource1, technicalResource2, technicalResource3));
			return new ResponseEntity<>(premiseLookupResp, HttpStatus.OK);
		}
		catch (final Exception e)
		{
			return getUnsuccessfulResponse("Premise details could not be validated – please contact 1800-222-2222 for assistance.",
					e, HttpStatus.BAD_REQUEST);
		}
	}

	private Street createStreet(final String name, final String number, final String suite)
	{
		final Street street = new Street();
		street.setName(name);
		street.setNumber(number);
		street.setSuite(suite);
		return street;
	}

	private Town createTown(final String code, final String country, final String name, final String regionCode)
	{
		final Town town = new Town();
		town.setCode(code);
		town.setCountry(country);
		town.setName(name);
		town.setRegionCode(regionCode);
		return town;
	}

	private PremiseAddress createPremiseAddress(final Town town, final Street street)
	{
		final PremiseAddress premiseAddress = new PremiseAddress();
		premiseAddress.setTownDetail(town);
		premiseAddress.setStreetDetail(street);
		return premiseAddress;
	}

	private Set<PremiseDetails> createPremiseDetailsSet()
	{
		final Set<PremiseDetails> premiseDetails = new HashSet<>();
		final Street street1 = new Street();
		street1.setName("Pinot");
		street1.setNumber("666");
		street1.setSuite("");

		final Street street2 = new Street();
		street2.setName("Pinot");
		street2.setNumber("666");
		street2.setSuite("1A");

		final Street street3 = new Street();
		street3.setName("Pinot");
		street3.setNumber("666");
		street3.setSuite("1B");

		final Street street4 = new Street();
		street4.setName("Murgasse");
		street4.setNumber("15");
		street4.setSuite("");

		final Street street5 = new Street();
		street5.setName("Murgasse");
		street5.setNumber("15");
		street5.setSuite("21");

		final Street street6 = new Street();
		street6.setName("Murgasse");
		street6.setNumber("15");
		street6.setSuite("22");

		final Street street7 = new Street();
		street7.setName("Sierra");
		street7.setNumber("34");
		street7.setSuite("");

		final Street street8 = new Street();
		street8.setName("Sierra");
		street8.setNumber("34");
		street8.setSuite("104");

		final Street street9 = new Street();
		street9.setName("Sierra");
		street9.setNumber("34");
		street9.setSuite("105");

		final Street street10 = new Street();
		street10.setName("Marktgasse");
		street10.setNumber("35");
		street10.setSuite("");

		final Street street11 = new Street();
		street11.setName("Marktgasse");
		street11.setNumber("35");
		street11.setSuite("1");

		final Street street12 = new Street();
		street12.setName("Marktgasse");
		street12.setNumber("35");
		street12.setSuite("2");

		final Town town1 = new Town();
		town1.setCode("80808");
		town1.setCountry("DE");
		town1.setName("Walldorf");
		town1.setRegionCode("");

		final Town town2 = new Town();
		town2.setCode("8010");
		town2.setCountry("AT");
		town2.setName("Graz");
		town2.setRegionCode("");

		final Town town3 = new Town();
		town3.setCode("93631");
		town3.setCountry("US");
		town3.setName("Kingsburg");
		town3.setRegionCode("US-CA");

		final Town town4 = new Town();
		town4.setCode("3011");
		town4.setCountry("CH");
		town4.setName("Bern");
		town4.setRegionCode("");

		final PremiseAddress premiseAddress1 = new PremiseAddress();
		premiseAddress1.setStreetDetail(street1);
		premiseAddress1.setTownDetail(town1);

		final PremiseAddress premiseAddress2 = new PremiseAddress();
		premiseAddress2.setStreetDetail(street2);
		premiseAddress2.setTownDetail(town1);

		final PremiseAddress premiseAddress3 = new PremiseAddress();
		premiseAddress3.setStreetDetail(street3);
		premiseAddress3.setTownDetail(town1);

		final PremiseAddress premiseAddress4 = new PremiseAddress();
		premiseAddress4.setStreetDetail(street4);
		premiseAddress4.setTownDetail(town2);

		final PremiseAddress premiseAddress5 = new PremiseAddress();
		premiseAddress5.setStreetDetail(street5);
		premiseAddress5.setTownDetail(town2);

		final PremiseAddress premiseAddress6 = new PremiseAddress();
		premiseAddress6.setStreetDetail(street6);
		premiseAddress6.setTownDetail(town2);

		final PremiseAddress premiseAddress7 = new PremiseAddress();
		premiseAddress7.setStreetDetail(street7);
		premiseAddress7.setTownDetail(town3);

		final PremiseAddress premiseAddress8 = new PremiseAddress();
		premiseAddress8.setStreetDetail(street8);
		premiseAddress8.setTownDetail(town3);

		final PremiseAddress premiseAddress9 = new PremiseAddress();
		premiseAddress9.setStreetDetail(street9);
		premiseAddress9.setTownDetail(town3);

		final PremiseAddress premiseAddress10 = new PremiseAddress();
		premiseAddress10.setStreetDetail(street10);
		premiseAddress10.setTownDetail(town4);

		final PremiseAddress premiseAddress11 = new PremiseAddress();
		premiseAddress11.setStreetDetail(street11);
		premiseAddress11.setTownDetail(town4);

		final PremiseAddress premiseAddress12 = new PremiseAddress();
		premiseAddress12.setStreetDetail(street12);
		premiseAddress12.setTownDetail(town4);

		final PremiseDetails premiseDetails1 = new PremiseDetails();
		premiseDetails1.setPremiseAddress(premiseAddress1);
		premiseDetails1.setSerialNumber("UWU111");
		premiseDetails1.setDivision("electricity");

		final PremiseDetails premiseDetails2 = new PremiseDetails();
		premiseDetails2.setPremiseAddress(premiseAddress1);
		premiseDetails2.setSerialNumber("UWU111");
		premiseDetails2.setDivision("gas");

		final PremiseDetails premiseDetails3 = new PremiseDetails();
		premiseDetails3.setPremiseAddress(premiseAddress2);
		premiseDetails3.setSerialNumber("UWU111");
		premiseDetails3.setDivision("electricity");

		final PremiseDetails premiseDetails4 = new PremiseDetails();
		premiseDetails4.setPremiseAddress(premiseAddress2);
		premiseDetails4.setSerialNumber("UWU111");
		premiseDetails4.setDivision("gas");

		final PremiseDetails premiseDetails5 = new PremiseDetails();
		premiseDetails5.setPremiseAddress(premiseAddress3);
		premiseDetails5.setSerialNumber("UWU111");
		premiseDetails5.setDivision("electricity");

		final PremiseDetails premiseDetails6 = new PremiseDetails();
		premiseDetails6.setPremiseAddress(premiseAddress3);
		premiseDetails6.setSerialNumber("UWU111");
		premiseDetails6.setDivision("gas");

		final PremiseDetails premiseDetails7 = new PremiseDetails();
		premiseDetails7.setPremiseAddress(premiseAddress4);
		premiseDetails7.setSerialNumber("PQR1234");
		premiseDetails7.setDivision("electricity");

		final PremiseDetails premiseDetails8 = new PremiseDetails();
		premiseDetails8.setPremiseAddress(premiseAddress4);
		premiseDetails8.setSerialNumber("PQR1234");
		premiseDetails8.setDivision("gas");

		final PremiseDetails premiseDetails9 = new PremiseDetails();
		premiseDetails9.setPremiseAddress(premiseAddress5);
		premiseDetails9.setSerialNumber("PQR1234");
		premiseDetails9.setDivision("electricity");

		final PremiseDetails premiseDetails10 = new PremiseDetails();
		premiseDetails10.setPremiseAddress(premiseAddress5);
		premiseDetails10.setSerialNumber("PQR1234");
		premiseDetails10.setDivision("gas");

		final PremiseDetails premiseDetails11 = new PremiseDetails();
		premiseDetails11.setPremiseAddress(premiseAddress6);
		premiseDetails11.setSerialNumber("PQR1234");
		premiseDetails11.setDivision("electricity");

		final PremiseDetails premiseDetails12 = new PremiseDetails();
		premiseDetails12.setPremiseAddress(premiseAddress6);
		premiseDetails12.setSerialNumber("PQR1234");
		premiseDetails12.setDivision("gas");

		final PremiseDetails premiseDetails13 = new PremiseDetails();
		premiseDetails13.setPremiseAddress(premiseAddress7);
		premiseDetails13.setSerialNumber("MKL357");
		premiseDetails13.setDivision("electricity");

		final PremiseDetails premiseDetails14 = new PremiseDetails();
		premiseDetails14.setPremiseAddress(premiseAddress7);
		premiseDetails14.setSerialNumber("MKL357");
		premiseDetails14.setDivision("gas");

		final PremiseDetails premiseDetails15 = new PremiseDetails();
		premiseDetails15.setPremiseAddress(premiseAddress8);
		premiseDetails15.setSerialNumber("MKL357");
		premiseDetails15.setDivision("electricity");

		final PremiseDetails premiseDetails16 = new PremiseDetails();
		premiseDetails16.setPremiseAddress(premiseAddress8);
		premiseDetails16.setSerialNumber("MKL357");
		premiseDetails16.setDivision("gas");

		final PremiseDetails premiseDetails17 = new PremiseDetails();
		premiseDetails17.setPremiseAddress(premiseAddress9);
		premiseDetails17.setSerialNumber("MKL357");
		premiseDetails17.setDivision("electricity");

		final PremiseDetails premiseDetails18 = new PremiseDetails();
		premiseDetails18.setPremiseAddress(premiseAddress9);
		premiseDetails18.setSerialNumber("MKL357");
		premiseDetails18.setDivision("gas");

		final PremiseDetails premiseDetails19 = new PremiseDetails();
		premiseDetails19.setPremiseAddress(premiseAddress10);
		premiseDetails19.setSerialNumber("102847");
		premiseDetails19.setDivision("electricity");

		final PremiseDetails premiseDetails20 = new PremiseDetails();
		premiseDetails20.setPremiseAddress(premiseAddress10);
		premiseDetails20.setSerialNumber("102847");
		premiseDetails20.setDivision("gas");

		final PremiseDetails premiseDetails21 = new PremiseDetails();
		premiseDetails21.setPremiseAddress(premiseAddress11);
		premiseDetails21.setSerialNumber("102847");
		premiseDetails21.setDivision("electricity");

		final PremiseDetails premiseDetails22 = new PremiseDetails();
		premiseDetails22.setPremiseAddress(premiseAddress11);
		premiseDetails22.setSerialNumber("102847");
		premiseDetails22.setDivision("gas");

		final PremiseDetails premiseDetails23 = new PremiseDetails();
		premiseDetails23.setPremiseAddress(premiseAddress12);
		premiseDetails23.setSerialNumber("102847");
		premiseDetails23.setDivision("electricity");

		final PremiseDetails premiseDetails24 = new PremiseDetails();
		premiseDetails24.setPremiseAddress(premiseAddress12);
		premiseDetails24.setSerialNumber("102847");
		premiseDetails24.setDivision("gas");

		premiseDetails.add(premiseDetails1);
		premiseDetails.add(premiseDetails2);
		premiseDetails.add(premiseDetails3);
		premiseDetails.add(premiseDetails4);
		premiseDetails.add(premiseDetails5);
		premiseDetails.add(premiseDetails6);
		premiseDetails.add(premiseDetails7);
		premiseDetails.add(premiseDetails8);
		premiseDetails.add(premiseDetails9);
		premiseDetails.add(premiseDetails10);
		premiseDetails.add(premiseDetails11);
		premiseDetails.add(premiseDetails12);
		premiseDetails.add(premiseDetails13);
		premiseDetails.add(premiseDetails14);
		premiseDetails.add(premiseDetails15);
		premiseDetails.add(premiseDetails16);
		premiseDetails.add(premiseDetails17);
		premiseDetails.add(premiseDetails18);
		premiseDetails.add(premiseDetails19);
		premiseDetails.add(premiseDetails20);
		premiseDetails.add(premiseDetails21);
		premiseDetails.add(premiseDetails22);
		premiseDetails.add(premiseDetails23);
		premiseDetails.add(premiseDetails24);

		return premiseDetails;
	}


	private boolean compareTowns(final Town town1, final Town town2)
	{
		return town1.getCode().equals(town2.getCode()) && town1.getName().equals(town2.getName()) && town1.getCountry()
				.equals(town2.getCountry()) && town1.getRegionCode().equals(town2.getRegionCode());
	}

	private boolean compareStreets(final Street street1, final Street street2)
	{
		return street1.getName().equals(street2.getName()) && street1.getNumber().equals(street2.getNumber()) && street1.getSuite()
				.equals(street2.getSuite());
	}
}
