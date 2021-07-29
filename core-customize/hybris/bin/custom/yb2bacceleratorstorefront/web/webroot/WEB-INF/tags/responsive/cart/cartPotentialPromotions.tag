<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="cartData" required="true" type="de.hybris.platform.commercefacades.order.data.CartData" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<%-- TODO needs responsive classes --%>
<%-- Issue created --%>
<c:if test="${not empty cartData.potentialOrderPromotions}">
    <div class="cartpotproline">
        <spring:theme code="basket.potential.promotions" />
        <ycommerce:testId code="potentialPromotions_promotions_labels">
            <c:forEach items="${cartData.potentialOrderPromotions}" var="promotion">
                <div class="promotion">${ycommerce:sanitizeHTML(promotion.description)}</div>
            </c:forEach>
        </ycommerce:testId>
    </div>
</c:if>
