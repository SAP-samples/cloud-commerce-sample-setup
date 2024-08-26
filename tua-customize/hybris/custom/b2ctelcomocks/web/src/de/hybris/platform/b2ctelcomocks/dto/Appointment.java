/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.b2ctelcomocks.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import javax.validation.Valid;
import de.hybris.platform.tuawebservicesresources.v2.dto.ContactMedium;
import de.hybris.platform.tuawebservicesresources.v2.dto.Note;
import de.hybris.platform.tuawebservicesresources.v2.dto.RelatedParty;
import de.hybris.platform.tuawebservicesresources.v2.dto.TimePeriod;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * The requested appointment
 */
@Schema(description = "The requested appointment")
public class Appointment
{
	@JsonProperty("id")
	private String id = null;

	@JsonProperty("href")
	private String href = null;

	@JsonProperty("category")
	private String category = null;

	@JsonProperty("creationTime")
	private Date creationTime = null;

	@JsonProperty("description")
	private String description = null;

	@JsonProperty("externalId")
	private String externalId = null;

	@JsonProperty("lastUpdate")
	private Date lastUpdate = null;

	@JsonProperty("status")
	private AppointmentStateType status = null;

	@JsonProperty("validFor")
	private TimePeriod validFor = null;

	@JsonProperty("calendarEvent")
	private CalendarEventRef calendarEvent = null;

	@JsonProperty("note")
	@Valid
	private List<Note> note = null;

	@JsonProperty("relatedEntity")
	@Valid
	private List<RelatedParty> relatedEntity = null;

	@JsonProperty("attachment")
	@Valid
	private List<AttachmentRefOrValue> attachment = null;

	@JsonProperty("contactMedium")
	@Valid
	private List<ContactMedium> contactMedium = null;

	@JsonProperty("relatedParty")
	@Valid
	private List<RelatedParty> relatedParty = null;

	@JsonProperty("relatedPlace")
	private RelatedPlaceRefOrValue relatedPlace = null;

	@JsonProperty("creationDate")
	private Date creationDate = null;

	@JsonProperty("@schemaLocation")
	private String atSchemaLocation = null;

	@JsonProperty("@type")
	private String atType = null;

	@JsonProperty("@baseType")
	private String atBaseType = null;

	public Appointment id(String id)
	{
		this.id = id;
		return this;
	}

	/**
    * Unique identifier of the appointment
    *
    * @return id
    **/
	@Schema(description = "Unique identifier of the appointment")

	public String getId()
	{
		return id;
	}

	public void setId(String id)
	{
		this.id = id;
	}

	public Appointment href(String href)
	{
		this.href = href;
		return this;
	}

	/**
    * Reference of the appointment
    *
    * @return href
    **/
	@Schema(description = "Reference of the appointment")

	public String getHref()
	{
		return href;
	}

	public void setHref(String href)
	{
		this.href = href;
	}

	public Appointment category(String category)
	{
		this.category = category;
		return this;
	}

	/**
    * Appointment's category
    *
    * @return category
    **/
	@Schema(description = "Appointment's category")

	public String getCategory()
	{
		return category;
	}

	public void setCategory(String category)
	{
		this.category = category;
	}

	public Appointment creationTime(Date creationTime)
	{
		this.creationTime = creationTime;
		return this;
	}

	/**
    * Appointment's creation time
    *
    * @return creationTime
    **/
	@Schema(description = "Appointment's creation time")

	@Valid
	public Date getCreationTime()
	{
		return creationTime;
	}

	public void setCreationTime(Date creationTime)
	{
		this.creationTime = creationTime;
	}

	public Appointment description(String description)
	{
		this.description = description;
		return this;
	}

	/**
    * Appointment's description
    *
    * @return description
    **/
	@Schema(description = "Appointment's description")

	public String getDescription()
	{
		return description;
	}

	public void setDescription(String description)
	{
		this.description = description;
	}

	public Appointment externalId(String externalId)
	{
		this.externalId = externalId;
		return this;
	}

	/**
    * Appointment's external id
    *
    * @return externalId
    **/
	@Schema(description = "Appointment's external id")

	public String getExternalId()
	{
		return externalId;
	}

	public void setExternalId(String externalId)
	{
		this.externalId = externalId;
	}

	public Appointment lastUpdate(Date lastUpdate)
	{
		this.lastUpdate = lastUpdate;
		return this;
	}

	/**
    * Last update of the appointment
    *
    * @return lastUpdate
    **/
	@Schema(description = "Last update of the appointment")

	@Valid
	public Date getLastUpdate()
	{
		return lastUpdate;
	}

	public void setLastUpdate(Date lastUpdate)
	{
		this.lastUpdate = lastUpdate;
	}

	public Appointment status(AppointmentStateType status)
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

	@Valid
	public AppointmentStateType getStatus()
	{
		return status;
	}

	public void setStatus(AppointmentStateType status)
	{
		this.status = status;
	}

	public Appointment validFor(TimePeriod validFor)
	{
		this.validFor = validFor;
		return this;
	}

	/**
    * Get validFor
    *
    * @return validFor
    **/
	@Schema(description = "")

	@Valid
	public TimePeriod getValidFor()
	{
		return validFor;
	}

	public void setValidFor(TimePeriod validFor)
	{
		this.validFor = validFor;
	}

	public Appointment calendarEvent(CalendarEventRef calendarEvent)
	{
		this.calendarEvent = calendarEvent;
		return this;
	}

	/**
    * Get calendarEvent
    *
    * @return calendarEvent
    **/
	@Schema(description = "")

	@Valid
	public CalendarEventRef getCalendarEvent()
	{
		return calendarEvent;
	}

	public void setCalendarEvent(CalendarEventRef calendarEvent)
	{
		this.calendarEvent = calendarEvent;
	}

	public Appointment note(List<Note> note)
	{
		this.note = note;
		return this;
	}

	public Appointment addNoteItem(Note noteItem)
	{
		if (this.note == null)
		{
			this.note = new ArrayList<Note>();
		}
		this.note.add(noteItem);
		return this;
	}

	/**
    * Get note
    *
    * @return note
    **/
	@Schema(description = "")
	@Valid
	public List<Note> getNote()
	{
		return note;
	}

	public void setNote(List<Note> note)
	{
		this.note = note;
	}

	public Appointment relatedEntity(List<RelatedParty> relatedEntity)
	{
		this.relatedEntity = relatedEntity;
		return this;
	}

	public Appointment addRelatedEntityItem(RelatedParty relatedEntityItem)
	{
		if (this.relatedEntity == null)
		{
			this.relatedEntity = new ArrayList<RelatedParty>();
		}
		this.relatedEntity.add(relatedEntityItem);
		return this;
	}

	/**
    * Get relatedEntity
    *
    * @return relatedEntity
    **/
	@Schema(description = "")
	@Valid
	public List<RelatedParty> getRelatedEntity()
	{
		return relatedEntity;
	}

	public void setRelatedEntity(List<RelatedParty> relatedEntity)
	{
		this.relatedEntity = relatedEntity;
	}

	public Appointment attachment(List<AttachmentRefOrValue> attachment)
	{
		this.attachment = attachment;
		return this;
	}

	public Appointment addAttachmentItem(AttachmentRefOrValue attachmentItem)
	{
		if (this.attachment == null)
		{
			this.attachment = new ArrayList<AttachmentRefOrValue>();
		}
		this.attachment.add(attachmentItem);
		return this;
	}

	/**
    * Get attachment
    *
    * @return attachment
    **/
	@Schema(description = "")
	@Valid
	public List<AttachmentRefOrValue> getAttachment()
	{
		return attachment;
	}

	public void setAttachment(List<AttachmentRefOrValue> attachment)
	{
		this.attachment = attachment;
	}

	public Appointment contactMedium(List<ContactMedium> contactMedium)
	{
		this.contactMedium = contactMedium;
		return this;
	}

	public Appointment addContactMediumItem(ContactMedium contactMediumItem)
	{
		if (this.contactMedium == null)
		{
			this.contactMedium = new ArrayList<ContactMedium>();
		}
		this.contactMedium.add(contactMediumItem);
		return this;
	}

	/**
    * Get contactMedium
    *
    * @return contactMedium
    **/
	@Schema(description = "")
	@Valid
	public List<ContactMedium> getContactMedium()
	{
		return contactMedium;
	}

	public void setContactMedium(List<ContactMedium> contactMedium)
	{
		this.contactMedium = contactMedium;
	}

	public Appointment relatedParty(List<RelatedParty> relatedParty)
	{
		this.relatedParty = relatedParty;
		return this;
	}

	public Appointment addRelatedPartyItem(RelatedParty relatedPartyItem)
	{
		if (this.relatedParty == null)
		{
			this.relatedParty = new ArrayList<RelatedParty>();
		}
		this.relatedParty.add(relatedPartyItem);
		return this;
	}

	/**
    * Get relatedParty
    *
    * @return relatedParty
    **/
	@Schema(description = "")
	@Valid
	public List<RelatedParty> getRelatedParty()
	{
		return relatedParty;
	}

	public void setRelatedParty(List<RelatedParty> relatedParty)
	{
		this.relatedParty = relatedParty;
	}

	public Appointment relatedPlace(RelatedPlaceRefOrValue relatedPlace)
	{
		this.relatedPlace = relatedPlace;
		return this;
	}

	/**
    * Get relatedPlace
    *
    * @return relatedPlace
    **/
	@Schema(description = "")

	@Valid
	public RelatedPlaceRefOrValue getRelatedPlace()
	{
		return relatedPlace;
	}

	public void setRelatedPlace(RelatedPlaceRefOrValue relatedPlace)
	{
		this.relatedPlace = relatedPlace;
	}

	public Appointment creationDate(Date creationDate)
	{
		this.creationDate = creationDate;
		return this;
	}

	/**
    * A date time (DateTime). Appointment creation date.
    *
    * @return creationDate
    **/
	@Schema(description = "A date time (DateTime). Appointment creation date.")

	@Valid
	public Date getCreationDate()
	{
		return creationDate;
	}

	public void setCreationDate(Date creationDate)
	{
		this.creationDate = creationDate;
	}

	public Appointment atSchemaLocation(String atSchemaLocation)
	{
		this.atSchemaLocation = atSchemaLocation;
		return this;
	}

	/**
    * A URI to a JSON-Schema file that defines additional attributes and relationships
    *
    * @return atSchemaLocation
    **/
	@Schema(description = "A URI to a JSON-Schema file that defines additional attributes and relationships")

	public String getAtSchemaLocation()
	{
		return atSchemaLocation;
	}

	public void setAtSchemaLocation(String atSchemaLocation)
	{
		this.atSchemaLocation = atSchemaLocation;
	}

	public Appointment atType(String atType)
	{
		this.atType = atType;
		return this;
	}

	/**
    * When sub-classing, this defines the sub-class entity name
    *
    * @return atType
    **/
	@Schema(description = "When sub-classing, this defines the sub-class entity name")

	public String getAtType()
	{
		return atType;
	}

	public void setAtType(String atType)
	{
		this.atType = atType;
	}

	public Appointment atBaseType(String atBaseType)
	{
		this.atBaseType = atBaseType;
		return this;
	}

	/**
    * When sub-classing, this defines the sub-class entity name
    *
    * @return atBaseType
    **/
	@Schema(description = "When sub-classing, this defines the sub-class entity name")

	public String getAtBaseType()
	{
		return atBaseType;
	}

	public void setAtBaseType(String atBaseType)
	{
		this.atBaseType = atBaseType;
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
		Appointment appointment = (Appointment) o;
		return Objects.equals(this.id, appointment.id) &&
				Objects.equals(this.href, appointment.href) &&
				Objects.equals(this.category, appointment.category) &&
				Objects.equals(this.creationTime, appointment.creationTime) &&
				Objects.equals(this.description, appointment.description) &&
				Objects.equals(this.externalId, appointment.externalId) &&
				Objects.equals(this.lastUpdate, appointment.lastUpdate) &&
				Objects.equals(this.status, appointment.status) &&
				Objects.equals(this.validFor, appointment.validFor) &&
				Objects.equals(this.calendarEvent, appointment.calendarEvent) &&
				Objects.equals(this.note, appointment.note) &&
				Objects.equals(this.relatedEntity, appointment.relatedEntity) &&
				Objects.equals(this.attachment, appointment.attachment) &&
				Objects.equals(this.contactMedium, appointment.contactMedium) &&
				Objects.equals(this.relatedParty, appointment.relatedParty) &&
				Objects.equals(this.relatedPlace, appointment.relatedPlace) &&
				Objects.equals(this.creationDate, appointment.creationDate) &&
				Objects.equals(this.atSchemaLocation, appointment.atSchemaLocation) &&
				Objects.equals(this.atType, appointment.atType) &&
				Objects.equals(this.atBaseType, appointment.atBaseType);
	}

	@Override
	public int hashCode()
	{
		return Objects.hash(id, href, category, creationTime, description, externalId, lastUpdate, status, validFor, calendarEvent,
				note, relatedEntity, attachment, contactMedium, relatedParty, relatedPlace, creationDate, atSchemaLocation, atType,
				atBaseType);
	}

	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append("class Appointment {\n");

		sb.append("    id: ").append(toIndentedString(id)).append("\n");
		sb.append("    href: ").append(toIndentedString(href)).append("\n");
		sb.append("    category: ").append(toIndentedString(category)).append("\n");
		sb.append("    creationTime: ").append(toIndentedString(creationTime)).append("\n");
		sb.append("    description: ").append(toIndentedString(description)).append("\n");
		sb.append("    externalId: ").append(toIndentedString(externalId)).append("\n");
		sb.append("    lastUpdate: ").append(toIndentedString(lastUpdate)).append("\n");
		sb.append("    status: ").append(toIndentedString(status)).append("\n");
		sb.append("    validFor: ").append(toIndentedString(validFor)).append("\n");
		sb.append("    calendarEvent: ").append(toIndentedString(calendarEvent)).append("\n");
		sb.append("    note: ").append(toIndentedString(note)).append("\n");
		sb.append("    relatedEntity: ").append(toIndentedString(relatedEntity)).append("\n");
		sb.append("    attachment: ").append(toIndentedString(attachment)).append("\n");
		sb.append("    contactMedium: ").append(toIndentedString(contactMedium)).append("\n");
		sb.append("    relatedParty: ").append(toIndentedString(relatedParty)).append("\n");
		sb.append("    relatedPlace: ").append(toIndentedString(relatedPlace)).append("\n");
		sb.append("    creationDate: ").append(toIndentedString(creationDate)).append("\n");
		sb.append("    atSchemaLocation: ").append(toIndentedString(atSchemaLocation)).append("\n");
		sb.append("    atType: ").append(toIndentedString(atType)).append("\n");
		sb.append("    atBaseType: ").append(toIndentedString(atBaseType)).append("\n");
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
