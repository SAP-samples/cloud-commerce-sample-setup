<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="order" required="true" type="de.hybris.platform.commercefacades.order.data.AbstractOrderData" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="order" tagdir="/WEB-INF/tags/responsive/order" %>

<spring:htmlEscape defaultHtmlEscape="true"/>
<div class="label-order">
    <spring:theme code="text.account.paymentDetails.billingAddress"/>
</div>
<div class="value-order">
    <order:addressItem address="${order.paymentInfo.billingAddress}"/>
</div>    
