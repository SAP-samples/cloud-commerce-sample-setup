<%@ tag body-content="empty" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ attribute name="order" required="true" type="de.hybris.platform.commercefacades.order.data.AbstractOrderData"%>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:if test="${not empty order.appliedVouchers}">
    <div class="checkout-coupon-list">
        <span class="coupon-list__headline"><spring:theme code="text.account.order.appliedCoupons"/></span>
        <ul class="coupon-list">
            <ycommerce:testId code="orderDetails_appliedVouchers_label">
                <c:forEach items="${order.appliedVouchers}" var="voucher">
                    <li class="coupon-list__item">
                        <span class="coupon-code">${fn:escapeXml(voucher)}</span>
                    </li>
                </c:forEach>
            </ycommerce:testId>
        </ul>
    </div>
</c:if>
