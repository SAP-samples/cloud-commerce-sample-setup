<%@ tag body-content="empty" trimDirectiveWhitespaces="true"%>
<%@ attribute name="product" required="false" type="de.hybris.platform.commercefacades.product.data.ProductData" %>
<%@ attribute name="variant" required="true" type="de.hybris.platform.commercefacades.product.data.VariantMatrixElementData" %>
<%@ attribute name="skusId" required="true" type="java.lang.String"%>
<%@ attribute name="showName" required="false" type="java.lang.Boolean"%>
<%@ taglib prefix="product" tagdir="/WEB-INF/tags/responsive/product" %>
<%@ attribute name="readOnly" required="false" type="java.lang.Boolean"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:if test="${readOnly != true}">
    <div class="update-future-stock hidden-xs">
        <spring:url htmlEscape="false" value="${product.url}/grid/skusFutureStock" var="skusFutureStockUrl" />
        <a href="#" class="update_future_stock_button positive" data-skus-id="${fn:escapeXml(skusId)}" 
        			data-skus-future-stock-url="${fn:escapeXml(skusFutureStockUrl)}">
            <spring:theme code="product.grid.futurestock.updatefuture.availability" />
        </a>
        <a href="#" class="hide_future_stock_info positive">
           <spring:theme code="product.grid.futurestock.hidefuture.availability" />
        </a>
    </div>
</c:if>

<input type="hidden" id="subtotalValue" value="0">
<input type="hidden" id="avgPriceValue" value="0">
<input type="hidden" id="quantityValue" value="0">

<script id="oms-error-message-template" type="text/x-jquery-tmpl">
    <div class="information_message negative">
    	<span class="single"></span>
    	<p>\${errorMessage}</p>
    </div>
</script>