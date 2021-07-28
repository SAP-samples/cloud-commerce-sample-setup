<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ attribute name="variant" required="true" type="de.hybris.platform.commercefacades.product.data.VariantMatrixElementData" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:if test="${variant.variantOption.stock.stockLevel gt 0}">
	<c:set var="variantStockLevelHtml">${fn:escapeXml(variant.variantOption.stock.stockLevel)}&nbsp;</c:set>
</c:if>
<c:if test="${variant.variantOption.stock.stockThreshold lt variant.variantOption.stock.stockLevel}">
	<c:set var="variantStockLevelHtml">${fn:escapeXml(variant.variantOption.stock.stockThreshold)}+&nbsp;</c:set>
</c:if>

<span class="in-stock">${variantStockLevelHtml}</span>
