/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.controllers;

import de.hybris.platform.b2ctelcomocks.api.QueryServiceQualificationApi;
import de.hybris.platform.b2ctelcomocks.dto.QueryServiceQualification;
import de.hybris.platform.b2ctelcomocks.dto.RelatedPlaceRefOrValue;
import de.hybris.platform.b2ctelcomocks.dto.ServiceQualificationItem;
import de.hybris.platform.b2ctelcomocks.dto.ServiceRefOrValue;
import de.hybris.platform.b2ctelcomocks.dto.ServiceSpecificationRef;
import de.hybris.platform.b2ctelcomocks.dto.TechnicalResource;
import de.hybris.platform.b2ctelcomocks.dto.TechnicalResourceType;
import de.hybris.platform.tuawebservicesresources.v2.dto.Characteristic;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.validation.Valid;

import org.codehaus.plexus.util.StringUtils;
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
@RequestMapping(value = "/serviceQualificationManagement/v4")
public class TmaServiceQualificationManagementMocksController extends TmaBaseController implements QueryServiceQualificationApi
{

	private static final String PREMISE_DETAILS_NOT_VALIDATED_MESSAGE = "Premise details could not be validated. Please contact 1800-222-2222 for assistance.";
	private static final String QUALIFICATION_DESCRIPTION = "Query Service Qualification Illustration";
	private static final String QUERY_SERVICE_QUALIFICATION_HREF = "http://serverlocation:port/serviceQualificationManagement/v4/queryServiceQualification/";
	private static final String SERVICE_SPECIFICATION_HREF_ROOT = "http://serverlocation:port/serviceCatalogManagement/v4/serviceSpecification/";

	@Operation(summary = "Creates a QueryServiceQualification", operationId = "createQueryServiceQualification", description = "This operation creates a QueryServiceQualification entity.")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "201", description = "Created"),
			@ApiResponse(responseCode = "400", description = "Bad Request"),
			@ApiResponse(responseCode = "405", description = "Method Not allowed"),
			@ApiResponse(responseCode = "409", description = "Conflict"),
			@ApiResponse(responseCode = "500", description = "Internal Server Error") })
	@RequestMapping(value = "/queryServiceQualification",
			produces = { "application/json;charset=utf-8" },
			consumes = { "application/json;charset=utf-8" },
			method = RequestMethod.POST)
	@Override
	public ResponseEntity<QueryServiceQualification> createQueryServiceQualification(@Parameter(description = "The "
			+ "QueryServiceQualification to be created", required = true) @Valid @RequestBody QueryServiceQualification queryServiceQualification)

	{
		if ((queryServiceQualification.getSearchCriteria() != null
				&& queryServiceQualification.getSearchCriteria().getService() != null
				&& queryServiceQualification.getSearchCriteria().getService().getDivision() != null
				&& queryServiceQualification.getSearchCriteria().getService().getSerialNumber() == null) || (
				queryServiceQualification.getSearchCriteria() != null
						&& queryServiceQualification.getSearchCriteria().getService() != null
						&& queryServiceQualification.getSearchCriteria().getService().getDivision() == null
						&& queryServiceQualification.getSearchCriteria().getService().getSerialNumber() != null))
		{
			return getUnsuccessfulResponse(PREMISE_DETAILS_NOT_VALIDATED_MESSAGE, HttpStatus.BAD_REQUEST);
		}

		if (queryServiceQualification.getSearchCriteria() != null
				&& queryServiceQualification.getSearchCriteria().getService() != null
				&& queryServiceQualification.getSearchCriteria().getService().getDivision() != null
				&& queryServiceQualification.getSearchCriteria().getService().getSerialNumber() != null)
		{
			final List<String> invalidTechnicalIds = new ArrayList<>();
			invalidTechnicalIds.add("TECHID400");
			invalidTechnicalIds.add("TECHID500");

			final List<String> invalidPostalCodes = new ArrayList<>();
			invalidPostalCodes.add("400400");
			invalidPostalCodes.add("500500");

			if (invalidPostalCodes.contains(
					queryServiceQualification.getSearchCriteria().getService().getPlace().get(0).getPostcode())
					|| invalidTechnicalIds.contains(queryServiceQualification.getSearchCriteria().getService().getSerialNumber()))
			{
				return getUnsuccessfulResponse(PREMISE_DETAILS_NOT_VALIDATED_MESSAGE, HttpStatus.BAD_REQUEST);
			}

			try
			{
				return new ResponseEntity<>(
						createPremiselookupResponse(queryServiceQualification.getSearchCriteria().getService().getDivision(),
								queryServiceQualification.getSearchCriteria().getService().getSerialNumber()), HttpStatus.OK);
			}
			catch (final Exception e)
			{
				return getUnsuccessfulResponse(PREMISE_DETAILS_NOT_VALIDATED_MESSAGE, e, HttpStatus.BAD_REQUEST);
			}
		}

		if (queryServiceQualification.getSearchCriteria() == null
				|| queryServiceQualification.getSearchCriteria().getService().getPlace().get(0).getPostcode() == null
				|| queryServiceQualification.getSearchCriteria().getService().getPlace().get(0).getPostcode().equals(""))
		{
			return getUnsuccessfulResponse(BAD_REQUEST, HttpStatus.BAD_REQUEST);
		}

		final QueryServiceQualification queryServiceQualification94121 = new QueryServiceQualification();
		final QueryServiceQualification queryServiceQualification94120 = new QueryServiceQualification();
		final QueryServiceQualification queryServiceQualificationOtherPostcode = new QueryServiceQualification();
		final QueryServiceQualification queryServiceQualificationOtherUtilities = new QueryServiceQualification();

		final RelatedPlaceRefOrValue context = new RelatedPlaceRefOrValue();

		if (queryServiceQualification.getSearchCriteria().getService().getPlace().get(0) != null)
		{
			final RelatedPlaceRefOrValue place = queryServiceQualification.getSearchCriteria().getService().getPlace().get(0);

			if (place.getRole() != null && !place.getRole().equals(""))
			{
				context.setRole(place.getRole());
			}

			if (place.getCity() != null && !place.getCity().equals(""))
			{
				context.setCity(place.getCity());
			}

			if (place.getStreetName() != null && !place.getStreetName().equals(""))
			{
				context.setStreetName(place.getStreetName());
			}

			if (place.getStreetType() != null && !place.getStreetType().equals(""))
			{
				context.setStreetType(place.getStreetType());
			}

			if (place.getStreetNr() != null && !place.getStreetNr().equals(""))
			{
				context.setStreetNr(place.getStreetNr());
			}

			if (place.getPostcode() != null && !place.getPostcode().equals(""))
			{
				context.setPostcode(place.getPostcode());
			}
			if (StringUtils.isNotBlank(place.getCountry()))
			{
				context.setCountry(place.getCountry());
			}

			if (!place.getPostcode().equals("94121"))
			{
				queryServiceQualification94121.setId("54");
				queryServiceQualification94121.setHref(QUERY_SERVICE_QUALIFICATION_HREF + queryServiceQualification94121.getId());
				queryServiceQualification94121.setDescription(QUALIFICATION_DESCRIPTION);
				queryServiceQualification94121.setInstantSyncQualification(true);
				queryServiceQualification94121.setSearchCriteria(createServiceQualificationItem("1", createService(Arrays.asList(
						createRelatedPlace(context.getCity(), context.getPostcode(), context.getStreetName(), context.getStreetType(),
								context.getStreetNr(), context.getCountry())), null, null), "SearchCriteria"));
				queryServiceQualification94121.setServiceQualificationItem(Arrays.asList(
						createServiceQualificationItem("1", createService(null, createServiceSpecification("78", "copper_internet_svc"),
								Arrays.asList(createServiceCharacteristic("100 MB/s", "upload_speed", "String"),
										createServiceCharacteristic("100 MB/s", "download_speed", "String"))), "ServiceQualificationItem"),
						createServiceQualificationItem("2", createService(null, createServiceSpecification("88", "fiber_internet_svc"),
								Arrays.asList(createServiceCharacteristic("500 MB/s", "upload_speed", "String"),
										createServiceCharacteristic("500 MB/s", "download_speed", "String"))), "ServiceQualificationItem"),
						createServiceQualificationItem("3", createService(null, createServiceSpecification("98", "5g_internet_svc"),
								Arrays.asList(createServiceCharacteristic("1 GB/s", "upload_speed", "String"),
										createServiceCharacteristic("10 GB/s", "download_speed", "String"))), "ServiceQualificationItem"),
						createServiceQualificationItem("4",
								createService(null, createServiceSpecification("108", "cable_tv_svc"), null), "ServiceQualificationItem"),
						createServiceQualificationItem("5",
								createService(null, createServiceSpecification("118", "satellite_tv_svc"), null),
								"ServiceQualificationItem"),
						createServiceQualificationItem("6", createService(null, createServiceSpecification("128", "ip_tv_svc"), null),
								"ServiceQualificationItem"),
						createServiceQualificationItem("7", createService(null, createServiceSpecification("138", "tv_svc"), null),
								"ServiceQualificationItem")
				));
				queryServiceQualification94121.setState("done");
				queryServiceQualification94121.setType("QueryServiceQualification");

				return new ResponseEntity<>(queryServiceQualification94121, HttpStatus.OK);
			}

			if (place.getPostcode().equals("94120"))
			{
				queryServiceQualification94120.setId("55");
				queryServiceQualification94120.setHref(QUERY_SERVICE_QUALIFICATION_HREF + queryServiceQualification94120.getId());
				queryServiceQualification94120.setDescription(QUALIFICATION_DESCRIPTION);
				queryServiceQualification94120.setInstantSyncQualification(true);
				queryServiceQualification94120.setSearchCriteria(createServiceQualificationItem("1", createService(Arrays.asList(
						createRelatedPlace(context.getCity(), context.getPostcode(), context.getStreetName(), context.getStreetType(),
								context.getStreetNr(), context.getCountry())), null, null), "SearchCriteria"));
				queryServiceQualification94120.setServiceQualificationItem(Arrays.asList(
						createServiceQualificationItem("1", createService(null, createServiceSpecification("88", "fiber_internet_svc"),
								Arrays.asList(createServiceCharacteristic("500 MB/s", "upload_speed", "String"),
										createServiceCharacteristic("500 MB/s", "download_speed", "String"))), "ServiceQualificationItem"),
						createServiceQualificationItem("2",
								createService(null, createServiceSpecification("108", "cable_tv_svc"), null), "ServiceQualificationItem"),
						createServiceQualificationItem("3",
								createService(null, createServiceSpecification("118", "satellite_tv_svc"), null),
								"ServiceQualificationItem"),
						createServiceQualificationItem("4", createService(null, createServiceSpecification("128", "ip_tv_svc"), null),
								"ServiceQualificationItem"),
						createServiceQualificationItem("5", createService(null, createServiceSpecification("138", "tv_svc"), null),
								"ServiceQualificationItem")
				));
				queryServiceQualification94120.setState("done");
				queryServiceQualification94120.setType("QueryServiceQualification");

				return new ResponseEntity<>(queryServiceQualification94120, HttpStatus.OK);
			}

			if (place.getPostcode().equals("8010") || place.getPostcode().equals("80808") || place.getPostcode().equals("93631")
					|| place.getPostcode().equals("3011"))
			{
				queryServiceQualificationOtherUtilities.setId("58");
				queryServiceQualificationOtherUtilities.setHref(
						QUERY_SERVICE_QUALIFICATION_HREF + queryServiceQualificationOtherUtilities.getId());
				queryServiceQualificationOtherUtilities.setDescription(QUALIFICATION_DESCRIPTION);
				queryServiceQualificationOtherUtilities.setInstantSyncQualification(true);
				queryServiceQualificationOtherUtilities.setSearchCriteria(
						createServiceQualificationItem("1", createService(Arrays.asList(
										createRelatedPlace(context.getCity(), context.getPostcode(), context.getStreetName(),
												context.getStreetType(), context.getStreetNr(), context.getCountry())), null, null),
								"SearchCriteria"));
				queryServiceQualificationOtherUtilities.setServiceQualificationItem(Arrays.asList(
						createServiceQualificationItem("1",
								createService(null, createServiceSpecification("138", "electricity_svc"), null),
								"ServiceQualificationItem"),
						createServiceQualificationItem("2", createService(null, createServiceSpecification("148", "gas_svc"), null),
								"ServiceQualificationItem")
				));
				queryServiceQualificationOtherUtilities.setState("done");
				queryServiceQualificationOtherUtilities.setType("QueryServiceQualification");

				return new ResponseEntity<>(queryServiceQualificationOtherUtilities, HttpStatus.OK);
			}
		}

		queryServiceQualificationOtherPostcode.setId("57");
		queryServiceQualificationOtherPostcode.setHref(
				QUERY_SERVICE_QUALIFICATION_HREF + queryServiceQualificationOtherPostcode.getId());
		queryServiceQualificationOtherPostcode.setDescription(QUALIFICATION_DESCRIPTION);
		queryServiceQualificationOtherPostcode.setInstantSyncQualification(true);
		queryServiceQualificationOtherPostcode.setSearchCriteria(createServiceQualificationItem("1", createService(Arrays.asList(
				createRelatedPlace(context.getCity(), context.getPostcode(), context.getStreetName(), context.getStreetType(),
						context.getStreetNr(), context.getCountry())), null, null), "SearchCriteria"));
		queryServiceQualificationOtherPostcode.setState("done");
		queryServiceQualificationOtherPostcode.setType("QueryServiceQualification");

		return new ResponseEntity<>(queryServiceQualificationOtherPostcode, HttpStatus.OK);
	}

	private RelatedPlaceRefOrValue createRelatedPlace(final String city, final String postcode, final String streetName,
			final String streetType, final String streetNr, final String country)
	{
		final RelatedPlaceRefOrValue relatedPlaceRefOrValue = new RelatedPlaceRefOrValue();
		relatedPlaceRefOrValue.setRole("Installation Place");
		relatedPlaceRefOrValue.setAtType("GeographicAddress");
		relatedPlaceRefOrValue.setCity(city);
		relatedPlaceRefOrValue.setPostcode(postcode);
		relatedPlaceRefOrValue.setStreetName(streetName);
		relatedPlaceRefOrValue.setStreetType(streetType);
		relatedPlaceRefOrValue.setStreetNr(streetNr);
		relatedPlaceRefOrValue.setCountry(country);
		return relatedPlaceRefOrValue;
	}

	private ServiceRefOrValue createService(final List<RelatedPlaceRefOrValue> place,
			final ServiceSpecificationRef serviceSpecification, final List<Characteristic> serviceCharacteristic)
	{
		final ServiceRefOrValue service = new ServiceRefOrValue();
		service.setPlace(place);
		service.setServiceSpecification(serviceSpecification);
		service.setServiceCharacteristic(serviceCharacteristic);
		return service;
	}

	private ServiceSpecificationRef createServiceSpecification(final String id, final String name)
	{
		final ServiceSpecificationRef serviceSpecification = new ServiceSpecificationRef();
		serviceSpecification.setId(id);
		serviceSpecification.setHref(SERVICE_SPECIFICATION_HREF_ROOT + id);
		serviceSpecification.setName(name);
		serviceSpecification.setType("ServiceSpecification");
		return serviceSpecification;
	}

	private Characteristic createServiceCharacteristic(final String value, final String name, final String valueType)
	{
		final Characteristic serviceCharacteristic = new Characteristic();
		serviceCharacteristic.setName(name);
		serviceCharacteristic.setValue(value);
		serviceCharacteristic.setValueType(valueType);
		return serviceCharacteristic;
	}

	private ServiceQualificationItem createServiceQualificationItem(final String id, final ServiceRefOrValue service,
			final String type)
	{
		final ServiceQualificationItem serviceQualificationItem = new ServiceQualificationItem();
		serviceQualificationItem.setId(id);
		serviceQualificationItem.setService(service);
		serviceQualificationItem.setType(type);
		return serviceQualificationItem;
	}

	private QueryServiceQualification createPremiselookupResponse(final String division, final String serialNumber)
	{
		final TechnicalResource technicalResource1 = new TechnicalResource();
		technicalResource1.setId(serialNumber);
		technicalResource1.setType(TechnicalResourceType.METER);

		final TechnicalResource technicalResource2 = new TechnicalResource();
		technicalResource2.setId("0.0.2.4.1.1.12.0.0.0.0.0.0.0.0.3.72.0");
		technicalResource2.setType(TechnicalResourceType.READING_TYPE);

		final TechnicalResource technicalResource3 = new TechnicalResource();
		technicalResource3.setId(division);
		technicalResource3.setType(TechnicalResourceType.DIVISION);

		final QueryServiceQualification premiseLookupResp = new QueryServiceQualification();
		premiseLookupResp.setStatus("SUCCESS");
		premiseLookupResp.setTechnicalResources(Arrays.asList(technicalResource1, technicalResource2, technicalResource3));

		return premiseLookupResp;
	}
}
