<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="cart" tagdir="/WEB-INF/tags/responsive/cart" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="format" tagdir="/WEB-INF/tags/shared/format" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:if test="${not empty cartData.entries}">
    <div class="row">
        <c:if test="${exportCsvEnabled}">
            <cart:exportCart/>
        </c:if>
        <div class="col-sm-12 col-md-4 col-md-push-5">
            <div class="js-cart-top-totals cart__top--totals">
                <c:choose>
                    <c:when test="${fn:length(cartData.entries) > 1}">
                        <spring:theme code="basket.page.totals.total.items" arguments="${fn:length(cartData.entries)}"/>
                    </c:when>
                    <c:otherwise>
                        <spring:theme code="basket.page.totals.total.items.one" arguments="${fn:length(cartData.entries)}"/>
                    </c:otherwise>
                </c:choose>
                <ycommerce:testId code="cart_totalPrice_label">
            <span class="cart__top--amount">
                <c:choose>
                    <c:when test="${showTax}">
                        <format:price priceData="${cartData.totalPriceWithTax}"/>
                    </c:when>
                    <c:otherwise>
                        <format:price priceData="${cartData.totalPrice}"/>
                    </c:otherwise>
                </c:choose>
            </span>
                </ycommerce:testId>
            </div>
        </div>
    </div>
    <div class="cart-items">
        <cart:cartItems cartData="${cartData}"/>
    </div>
    <div class="row">
        <c:if test="${exportCsvEnabled}">
            <cart:exportCart/>
        </c:if>
    </div>
    <cart:cartPromotions cartData="${cartData}"/>
    <cart:ajaxCartPromotions/>
</c:if>