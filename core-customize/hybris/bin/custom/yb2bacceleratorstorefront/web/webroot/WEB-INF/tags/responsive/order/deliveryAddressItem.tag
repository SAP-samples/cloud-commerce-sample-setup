<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="order" required="true" type="de.hybris.platform.commercefacades.order.data.AbstractOrderData" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="theme" tagdir="/WEB-INF/tags/shared/theme" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:set var="hasShippedItems" value="${order.deliveryItemsQuantity > 0}" />
<div class="orderBox address">
	<div class="headline"><spring:theme code="text.deliveryAddress" text="Delivery Address"/></div>
	<c:if test="${not hasShippedItems}">
		<spring:theme code="checkout.pickup.no.delivery.required"/>
	</c:if>
	<c:if test="${hasShippedItems}">		
		<ul>
			<li>${fn:escapeXml(order.deliveryAddress.title)}&nbsp;${fn:escapeXml(order.deliveryAddress.firstName)}&nbsp;${fn:escapeXml(order.deliveryAddress.lastName)}</li>
			<li>${fn:escapeXml(order.deliveryAddress.line1)}</li>
			<li>${fn:escapeXml(order.deliveryAddress.line2)}</li>
			<li>${fn:escapeXml(order.deliveryAddress.town)}</li>
			<li>${fn:escapeXml(order.deliveryAddress.region.name)}</li>
			<li>${fn:escapeXml(order.deliveryAddress.postalCode)}</li>
			<li>${fn:escapeXml(order.deliveryAddress.country.name)}</li>
			<li>${fn:escapeXml(order.deliveryAddress.phone)}</li>
		</ul>
	</c:if>
</div>
