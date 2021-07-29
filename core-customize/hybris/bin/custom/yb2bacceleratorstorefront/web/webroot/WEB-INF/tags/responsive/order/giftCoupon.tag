<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="giftCoupon" required="true" type="de.hybris.platform.commercefacades.coupon.data.CouponData" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:if test="${not empty giftCoupon}">
	<ycommerce:testId code="checkout_orderConfirmation_giftCoupon">
		<div class="gift__coupon">
			<span class="gift__coupon--name">
				${fn:escapeXml(giftCoupon.name)}
			</span>
			<span class="gift__coupon--code">
				<spring:theme code="checkout.orderConfirmation.coupon.code" arguments="${giftCoupon.couponCode}"/>
			</span>
			<c:choose>
				<c:when test="${empty giftCoupon.startDate && not empty giftCoupon.endDate}">
					<fmt:formatDate value="${giftCoupon.endDate}" pattern="MM/dd/yy" var="couponFormattedEndDate"/>
					<span class="gift__coupon--valid">
						<spring:theme code="checkout.orderConfirmation.coupon.valid.until" arguments="${couponFormattedEndDate}"/>
					</span>
				</c:when>
				<c:when test="${not empty giftCoupon.startDate && empty giftCoupon.endDate}">
					<fmt:formatDate value="${giftCoupon.startDate}" pattern="MM/dd/yy" var="couponFormattedStartDate"/>
					<span class="gift__coupon--valid">
						<spring:theme code="checkout.orderConfirmation.coupon.valid.from" arguments="${couponFormattedStartDate}"/>
					</span>
				</c:when>
				<c:when test="${not empty giftCoupon.startDate && not empty giftCoupon.endDate}">
					<fmt:formatDate value="${giftCoupon.startDate}" pattern="MM/dd/yy" var="couponFormattedStartDate"/>
					<fmt:formatDate value="${giftCoupon.endDate}" pattern="MM/dd/yy" var="couponFormattedEndDate"/>
					<span class="gift__coupon--valid">
						<spring:theme code="checkout.orderConfirmation.coupon.valid.range" arguments="${couponFormattedStartDate},${couponFormattedEndDate}"/>
					</span>
				</c:when>
			</c:choose>
		</div>
	</ycommerce:testId>
</c:if>

