<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="order" required="true" type="de.hybris.platform.commercefacades.order.data.AbstractOrderData" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:if test="${not empty order.appliedOrderPromotions}">
    <div class="order-savings">
        <ycommerce:testId code="order_recievedPromotions_label">
            <div class="order-savings__headline"><spring:theme code="text.account.order.receivedPromotions"/></div>
            <c:forEach items="${order.appliedOrderPromotions}" var="promotion">
                <div class="order-savings__info">
                    <ycommerce:testId code="orderDetails_orderPromotion_label">
                        <c:choose>
                            <c:when test="${not empty promotion.description}">
                                ${ycommerce:sanitizeHTML(promotion.description)}
                            </c:when>
                            <c:otherwise>
                                ${ycommerce:sanitizeHTML(promotion.promotionData.description)}
                            </c:otherwise>
                        </c:choose>
                    </ycommerce:testId>
                </div>
            </c:forEach>
        </ycommerce:testId>
    </div>
</c:if>
