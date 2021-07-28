<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="cartData" required="true" type="de.hybris.platform.commercefacades.order.data.CartData" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<%--  needs responsive CSS classes; issue created --%>
<c:if test="${not empty cartData.appliedOrderPromotions}">
    <div class="cartproline">
        <spring:theme code="basket.received.promotions" />
        <ycommerce:testId code="cart_recievedPromotions_labels">
            <c:forEach items="${cartData.appliedOrderPromotions}" var="promotion">
                <div class="promotion">${ycommerce:sanitizeHTML(promotion.description)}</div>
            </c:forEach>
        </ycommerce:testId>
    </div>
</c:if>
