<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="orderData" required="true" type="de.hybris.platform.commercefacades.order.data.OrderData" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:forEach items="${orderData.pickupOrderGroups}" var="groupData" varStatus="status">
	<div>
		<div>
			<spring:theme code="checkout.multi.pickup.items" arguments="${status.index + 1},${fn:length(groupData.entries)}" 
						  text="Pick Up # ${status.index + 1} - ${fn:length(groupData.entries)} Item(s)">
			</spring:theme>
		</div>
		<p>
			<strong>${fn:escapeXml(groupData.deliveryPointOfService.name)}</strong>
			<br>
			<c:if test="${ not empty groupData.deliveryPointOfService.address.line1 }">
				${fn:escapeXml(groupData.deliveryPointOfService.address.line1)}
			</c:if>
			<c:if test="${ not empty groupData.deliveryPointOfService.address.line2 }">
				,&nbsp;${fn:escapeXml(groupData.deliveryPointOfService.address.line2)}<br/>
			</c:if>
			<c:if test="${not empty groupData.deliveryPointOfService.address.town }">
				${fn:escapeXml(groupData.deliveryPointOfService.address.town)}
			</c:if>
			<c:if test="${ not empty groupData.deliveryPointOfService.address.region.name }">
				,&nbsp;${fn:escapeXml(groupData.deliveryPointOfService.address.region.name)}<br/>
			</c:if>
			<c:if test="${ not empty groupData.deliveryPointOfService.address.country.name }">
				${fn:escapeXml(groupData.deliveryPointOfService.address.country.name)}
			</c:if>
			<c:if test="${ not empty groupData.deliveryPointOfService.address.phone }">
				${fn:escapeXml(groupData.deliveryPointOfService.address.phone)}
			</c:if>
		</p>
	</div>
</c:forEach>

