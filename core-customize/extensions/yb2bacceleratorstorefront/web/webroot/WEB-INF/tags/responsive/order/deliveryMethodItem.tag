<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="order" required="true" type="de.hybris.platform.commercefacades.order.data.AbstractOrderData" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true"/>
<div>
    <div class="label-order">
        <spring:theme code="text.shippingMethod"/>
    </div>
    ${fn:escapeXml(order.deliveryMode.name)}
    <br>
    ${fn:escapeXml(order.deliveryMode.description)}
</div>