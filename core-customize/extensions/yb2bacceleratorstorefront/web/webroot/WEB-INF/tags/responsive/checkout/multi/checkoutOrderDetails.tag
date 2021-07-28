<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="cartData" required="true" type="de.hybris.platform.commercefacades.order.data.CartData" %>
<%@ attribute name="showDeliveryAddress" required="true" type="java.lang.Boolean" %>
<%@ attribute name="showPaymentInfo" required="false" type="java.lang.Boolean" %>
<%@ attribute name="showTax" required="false" type="java.lang.Boolean" %>
<%@ attribute name="showTaxEstimate" required="false" type="java.lang.Boolean" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="multi-checkout" tagdir="/WEB-INF/tags/responsive/checkout/multi" %>
<%@ taglib prefix="order" tagdir="/WEB-INF/tags/responsive/order" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<div class="checkout-summary-headline"><spring:theme code="checkout.multi.order.summary" /></div>

<div class="checkout-order-summary">
    <multi-checkout:deliveryCartItems cartData="${cartData}" showDeliveryAddress="${showDeliveryAddress}" />

    <c:forEach items="${cartData.pickupOrderGroups}" var="groupData" varStatus="status">
        <multi-checkout:pickupCartItems cartData="${cartData}" groupData="${groupData}" showHead="true" />
    </c:forEach>

    <order:appliedVouchers order="${cartData}" />

    <multi-checkout:paymentInfo cartData="${cartData}" paymentInfo="${cartData.paymentInfo}" showPaymentInfo="${showPaymentInfo}" />

    <multi-checkout:orderTotals cartData="${cartData}" showTaxEstimate="${showTaxEstimate}" showTax="${showTax}" />
</div>