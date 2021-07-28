<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="product" required="true" type="de.hybris.platform.commercefacades.product.data.ProductData" %>
<%@ attribute name="showViewDetails" required="false" type="java.lang.Boolean"%>
<%@ attribute name="addToCartBtnId" required="false" type="java.lang.String"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="product" tagdir="/WEB-INF/tags/responsive/product" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<product:addToCartTitle/>

<li>
	<product:productFormAddToCartButton addToCartBtnId="${addToCartBtnId}" />
</li>

<li class="hidden-xs">
    <spring:theme code="order.form.subtotal"/>&nbsp;
    <span class="left js-total-price" id="total-price"><spring:theme code="order.form.currency"/>0.00</span>
    <input type="hidden" id="total-price-value" class="js-total-price-value" value="0">
</li>
