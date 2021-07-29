<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="order" required="true" type="de.hybris.platform.commercefacades.order.data.AbstractOrderData" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ taglib prefix="format" tagdir="/WEB-INF/tags/shared/format" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<div class="orderTotal">
    <div class="row">
        <div class="col-xs-6">
            <spring:theme code="text.account.order.subtotal"/>
        </div>
        <div class="col-xs-6">
            <div class="text-right">
                <ycommerce:testId code="orderTotal_subTotal_label">
                    <format:price priceData="${order.subTotal}"/>
                </ycommerce:testId>
            </div>
        </div>
        <c:if test="${order.totalDiscounts.value > 0}">
            <div class="col-xs-6">
                <div class="subtotals__item--state-discount">
                    <spring:theme code="text.account.order.discount"/>
                </div>
            </div>
            <div class="col-xs-6">
                <div class="text-right subtotals__item--state-discount">
                    <ycommerce:testId code="orderTotal_discount_label">
                        <format:price priceData="${order.totalDiscounts}" displayNegationForDiscount="true" />
                    </ycommerce:testId>
                </div>
            </div>
        </c:if>
        <c:if test="${order.quoteDiscounts.value > 0}">
            <div class="col-xs-6 cart-totals-left discount">
                <spring:theme code="basket.page.quote.discounts" />
            </div>
            <div class="col-xs-6 cart-totals-right text-right discount">
                <ycommerce:testId code="Quote_Quote_Savings">
                    <format:price priceData="${order.quoteDiscounts}" displayNegationForDiscount="true" />
                </ycommerce:testId>
            </div>
        </c:if>
        <div class="col-xs-6">
            <div class="totals">
                <spring:theme code="text.account.order.orderTotals" />
            </div>
        </div>

        <div class="col-xs-6 text-right">
            <div class="totals">
                <ycommerce:testId code="orderTotal_totalPrice_label">
                    <format:price priceData="${order.totalPrice}"/>
                </ycommerce:testId>
            </div>
        </div>
    </div>
</div>

<div class="cart-totals-taxes text-right">
    <spring:theme code="basket.page.totals.noNetTax"/>
</div>
