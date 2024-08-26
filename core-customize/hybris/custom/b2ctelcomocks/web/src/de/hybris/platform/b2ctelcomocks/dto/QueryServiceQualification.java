/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import de.hybris.platform.tuawebservicesresources.v2.dto.TimePeriod;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.validation.Valid;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * QueryServiceQualification
 */
@Schema(description = "QueryServiceQualification")
public class QueryServiceQualification
{
	@JsonProperty("id")
	private String id = null;

	@JsonProperty("href")
	private String href = null;

	@JsonProperty("description")
	private String description = null;

	@JsonProperty("effectiveQualificationDate")
	private TimePeriod effectiveQualificationDate = null;

	@JsonProperty("estimatedResponseDate")
	private TimePeriod estimatedResponseDate = null;

	@JsonProperty("expectedQualificationDate")
	private TimePeriod expectedQualificationDate = null;

	@JsonProperty("expirationDate")
	private TimePeriod expirationDate = null;

	@JsonProperty("externalId")
	private String externalId = null;

	@JsonProperty("instantSyncQualification")
	private Boolean instantSyncQualification = false;

	@JsonProperty("queryServiceQualificationDate")
	private TimePeriod queryServiceQualificationDate = null;

	@JsonProperty("searchCriteria")
	private ServiceQualificationItem searchCriteria = null;

	@JsonProperty("serviceQualificationItem")
	@Valid
	private List<ServiceQualificationItem> serviceQualificationItem = null;

	@JsonProperty("state")
	private String state = null;

	@JsonProperty("@type")
	private String type = null;

	@JsonProperty("status")
	private String status = null;

	@JsonProperty("technicalResources")
	@Valid
	private List<TechnicalResource> technicalResources = null;

	public QueryServiceQualification id(String id)
	{
		this.id = id;
		return this;
	}

	/**
    * Get id
    *
    * @return id
    **/
	@Schema(description = "")

	public String getId()
	{
		return id;
	}

	public void setId(String id)
	{
		this.id = id;
	}

	public QueryServiceQualification status(final String status)
	{
		this.status = status;
		return this;
	}

	/**
	 * Get status
	 *
	 * @return status
	 **/
	@Schema(description = "")

	public String getStatus()
	{
		return status;
	}

	public void setStatus(final String status)
	{
		this.status = status;
	}


	public QueryServiceQualification technicalResources(final List<TechnicalResource> technicalResources)
	{
		this.technicalResources = technicalResources;
		return this;
	}

	public QueryServiceQualification addTechnicalResourcesItem(final TechnicalResource technicalResourcesItem)
	{
		if (this.technicalResources == null)
		{
			this.technicalResources = new ArrayList<TechnicalResource>();
		}
		this.technicalResources.add(technicalResourcesItem);
		return this;
	}

	/**
	 * Get technicalResources
	 *
	 * @return technicalResources
	 **/
	@Schema(description = "")
	@Valid
	public List<TechnicalResource> getTechnicalResources()
	{
		return technicalResources;
	}

	public void setTechnicalResources(final List<TechnicalResource> technicalResources)
	{
		this.technicalResources = technicalResources;
	}


	public QueryServiceQualification href(String href)
	{
		this.href = href;
		return this;
	}

	/**
    * Get href
    *
    * @return href
    **/
	@Schema(description = "")

	public String getHref()
	{
		return href;
	}

	public void setHref(String href)
	{
		this.href = href;
	}

	public QueryServiceQualification description(String description)
	{
		this.description = description;
		return this;
	}

	/**
    * Get description
    *
    * @return description
    **/
	@Schema(description = "")

	public String getDescription()
	{
		return description;
	}

	public void setDescription(String description)
	{
		this.description = description;
	}

	public QueryServiceQualification effectiveQualificationDate(TimePeriod effectiveQualificationDate)
	{
		this.effectiveQualificationDate = effectiveQualificationDate;
		return this;
	}

	/**
    * Get effectiveQualificationDate
    *
    * @return effectiveQualificationDate
    **/
	@Schema(description = "")

	@Valid
	public TimePeriod getEffectiveQualificationDate()
	{
		return effectiveQualificationDate;
	}

	public void setEffectiveQualificationDate(TimePeriod effectiveQualificationDate)
	{
		this.effectiveQualificationDate = effectiveQualificationDate;
	}

	public QueryServiceQualification estimatedResponseDate(TimePeriod estimatedResponseDate)
	{
		this.estimatedResponseDate = estimatedResponseDate;
		return this;
	}

	/**
    * Get estimatedResponseDate
    *
    * @return estimatedResponseDate
    **/
	@Schema(description = "")

	@Valid
	public TimePeriod getEstimatedResponseDate()
	{
		return estimatedResponseDate;
	}

	public void setEstimatedResponseDate(TimePeriod estimatedResponseDate)
	{
		this.estimatedResponseDate = estimatedResponseDate;
	}

	public QueryServiceQualification expectedQualificationDate(TimePeriod expectedQualificationDate)
	{
		this.expectedQualificationDate = expectedQualificationDate;
		return this;
	}

	/**
    * Get expectedQualificationDate
    *
    * @return expectedQualificationDate
    **/
	@Schema(description = "")

	@Valid
	public TimePeriod getExpectedQualificationDate()
	{
		return expectedQualificationDate;
	}

	public void setExpectedQualificationDate(TimePeriod expectedQualificationDate)
	{
		this.expectedQualificationDate = expectedQualificationDate;
	}

	public QueryServiceQualification expirationDate(TimePeriod expirationDate)
	{
		this.expirationDate = expirationDate;
		return this;
	}

	/**
    * Get expirationDate
    *
    * @return expirationDate
    **/
	@Schema(description = "")

	@Valid
	public TimePeriod getExpirationDate()
	{
		return expirationDate;
	}

	public void setExpirationDate(TimePeriod expirationDate)
	{
		this.expirationDate = expirationDate;
	}

	public QueryServiceQualification externalId(String externalId)
	{
		this.externalId = externalId;
		return this;
	}

	/**
    * Get externalId
    *
    * @return externalId
    **/
	@Schema(description = "")

	public String getExternalId()
	{
		return externalId;
	}

	public void setExternalId(String externalId)
	{
		this.externalId = externalId;
	}

	public QueryServiceQualification instantSyncQualification(Boolean instantSyncQualification)
	{
		this.instantSyncQualification = instantSyncQualification;
		return this;
	}

	/**
    * A boolean.
    *
    * @return instantSyncQualification
    **/
	@Schema(description = "A boolean. ")

	public Boolean isInstantSyncQualification()
	{
		return instantSyncQualification;
	}

	public void setInstantSyncQualification(Boolean instantSyncQualification)
	{
		this.instantSyncQualification = instantSyncQualification;
	}

	public QueryServiceQualification queryServiceQualificationDate(TimePeriod queryServiceQualificationDate)
	{
		this.queryServiceQualificationDate = queryServiceQualificationDate;
		return this;
	}

	/**
    * Get queryServiceQualificationDate
    *
    * @return queryServiceQualificationDate
    **/
	@Schema(description = "")

	@Valid
	public TimePeriod getQueryServiceQualificationDate()
	{
		return queryServiceQualificationDate;
	}

	public void setQueryServiceQualificationDate(TimePeriod queryServiceQualificationDate)
	{
		this.queryServiceQualificationDate = queryServiceQualificationDate;
	}

	public QueryServiceQualification searchCriteria(ServiceQualificationItem searchCriteria)
	{
		this.searchCriteria = searchCriteria;
		return this;
	}

	/**
    * Get searchCriteria
    *
    * @return searchCriteria
    **/
	@Schema(description = "")

	@Valid
	public ServiceQualificationItem getSearchCriteria()
	{
		return searchCriteria;
	}

	public void setSearchCriteria(ServiceQualificationItem searchCriteria)
	{
		this.searchCriteria = searchCriteria;
	}

	public QueryServiceQualification serviceQualificationItem(List<ServiceQualificationItem> serviceQualificationItem)
	{
		this.serviceQualificationItem = serviceQualificationItem;
		return this;
	}

	public QueryServiceQualification addServiceQualificationItemItem(ServiceQualificationItem serviceQualificationItemItem)
	{
		if (this.serviceQualificationItem == null)
		{
			this.serviceQualificationItem = new ArrayList<ServiceQualificationItem>();
		}
		this.serviceQualificationItem.add(serviceQualificationItemItem);
		return this;
	}

	/**
    * Get serviceQualificationItem
    *
    * @return serviceQualificationItem
    **/
	@Schema(description = "")
	@Valid
	public List<ServiceQualificationItem> getServiceQualificationItem()
	{
		return serviceQualificationItem;
	}

	public void setServiceQualificationItem(List<ServiceQualificationItem> serviceQualificationItem)
	{
		this.serviceQualificationItem = serviceQualificationItem;
	}

	public QueryServiceQualification state(String state)
	{
		this.state = state;
		return this;
	}

	/**
    * Get state
    *
    * @return state
    **/
	@Schema(description = "")

	public String getState()
	{
		return state;
	}

	public void setState(String state)
	{
		this.state = state;
	}

	public QueryServiceQualification type(String type)
	{
		this.type = type;
		return this;
	}

	/**
    * Get type
    *
    * @return type
    **/
	@Schema(description = "")

	public String getType()
	{
		return type;
	}

	public void setType(String type)
	{
		this.type = type;
	}


	@Override
	public boolean equals(Object o)
	{
		if (this == o)
		{
			return true;
		}
		if (o == null || getClass() != o.getClass())
		{
			return false;
		}
		QueryServiceQualification queryServiceQualification = (QueryServiceQualification) o;
		return Objects.equals(this.id, queryServiceQualification.id) &&
				Objects.equals(this.href, queryServiceQualification.href) &&
				Objects.equals(this.description, queryServiceQualification.description) &&
				Objects.equals(this.effectiveQualificationDate, queryServiceQualification.effectiveQualificationDate) &&
				Objects.equals(this.estimatedResponseDate, queryServiceQualification.estimatedResponseDate) &&
				Objects.equals(this.expectedQualificationDate, queryServiceQualification.expectedQualificationDate) &&
				Objects.equals(this.expirationDate, queryServiceQualification.expirationDate) &&
				Objects.equals(this.externalId, queryServiceQualification.externalId) &&
				Objects.equals(this.instantSyncQualification, queryServiceQualification.instantSyncQualification) &&
				Objects.equals(this.queryServiceQualificationDate, queryServiceQualification.queryServiceQualificationDate) &&
				Objects.equals(this.searchCriteria, queryServiceQualification.searchCriteria) &&
				Objects.equals(this.serviceQualificationItem, queryServiceQualification.serviceQualificationItem) &&
				Objects.equals(this.state, queryServiceQualification.state) &&
				Objects.equals(this.type, queryServiceQualification.type) &&
				Objects.equals(this.status, queryServiceQualification.status) &&
				Objects.equals(this.technicalResources, queryServiceQualification.technicalResources);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(id, href, description, effectiveQualificationDate, estimatedResponseDate, expectedQualificationDate,
				expirationDate, externalId, instantSyncQualification, queryServiceQualificationDate, searchCriteria,
				serviceQualificationItem, state, type, status, technicalResources);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class QueryServiceQualification {\n");

		sb.append("    id: ").append(toIndentedString(id)).append("\n");
		sb.append("    href: ").append(toIndentedString(href)).append("\n");
		sb.append("    description: ").append(toIndentedString(description)).append("\n");
		sb.append("    effectiveQualificationDate: ").append(toIndentedString(effectiveQualificationDate)).append("\n");
		sb.append("    estimatedResponseDate: ").append(toIndentedString(estimatedResponseDate)).append("\n");
		sb.append("    expectedQualificationDate: ").append(toIndentedString(expectedQualificationDate)).append("\n");
		sb.append("    expirationDate: ").append(toIndentedString(expirationDate)).append("\n");
		sb.append("    externalId: ").append(toIndentedString(externalId)).append("\n");
		sb.append("    instantSyncQualification: ").append(toIndentedString(instantSyncQualification)).append("\n");
		sb.append("    queryServiceQualificationDate: ").append(toIndentedString(queryServiceQualificationDate)).append("\n");
		sb.append("    searchCriteria: ").append(toIndentedString(searchCriteria)).append("\n");
		sb.append("    serviceQualificationItem: ").append(toIndentedString(serviceQualificationItem)).append("\n");
		sb.append("    state: ").append(toIndentedString(state)).append("\n");
		sb.append("    type: ").append(toIndentedString(type)).append("\n");
		sb.append("    status: ").append(toIndentedString(status)).append("\n");
		sb.append("    technicalResources: ").append(toIndentedString(technicalResources)).append("\n");
		sb.append("}");
		return sb.toString();
	}

	/**
    * Convert the given object to string with each line indented by 4 spaces
    * (except the first line).
    */
	private String toIndentedString(Object o)
	{
		if (o == null)
		{
			return "null";
		}
		return o.toString().replace("\n", "\n    ");
	}
}
