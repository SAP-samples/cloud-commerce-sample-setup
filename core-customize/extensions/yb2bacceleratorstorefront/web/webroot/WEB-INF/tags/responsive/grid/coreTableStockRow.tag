<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="variant" required="true" type="de.hybris.platform.commercefacades.product.data.VariantMatrixElementData" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="product" tagdir="/WEB-INF/tags/responsive/product" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:set var="inStock" value="${variant.variantOption.stock.stockLevel > 0}"/>
<span data-sku-id="${fn:escapeXml(variant.variantOption.code)}" class="td_stock ${inStock ? 'in-stock' : 'out-of-stock'}" >
<c:choose>
    <c:when test="${inStock}">
        <product:productVariantStockThreshold variant="${variant}"/>
    </c:when>
    <c:otherwise>
        <spring:theme code="product.grid.outOfStock"/>
    </c:otherwise>
</c:choose>
</span>