<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="giftCoupons" required="true" type="java.util.Collection" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="order" tagdir="/WEB-INF/tags/responsive/order" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:if test="${not empty giftCoupons}">
	<ycommerce:testId code="checkout_orderConfirmation_giftCoupons">
		<div class="gift__coupons">
				<span class="gift__coupon--title">
					<spring:theme code="checkout.orderConfirmation.get.coupon"/>
				</span>
				<c:forEach var="giftCoupon" items="${giftCoupons}">
					<order:giftCoupon giftCoupon="${giftCoupon}"/>
				</c:forEach>
		</div>
	</ycommerce:testId>
</c:if>
