<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="readOnlyMultiDMap" required="true" type="java.util.Map"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="format" tagdir="/WEB-INF/tags/shared/format" %>
<%@ taglib prefix="product" tagdir="/WEB-INF/tags/responsive/product" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<spring:htmlEscape defaultHtmlEscape="true" />

<table class="read-only-grid">
    <c:forEach items="${readOnlyMultiDMap}" var="readonlyGridData">
        <tr class="grid-row">
            <td class="grid-prod-img">
                <product:productPrimaryImage product="${readonlyGridData.value.product}" format="cartIcon" />
            </td>
            <td>
                <table>
                    <tr>
                        <td colspan="2">
                            <c:forEach items="${readonlyGridData.value.dimensionHeaderMap}" var="dimension">
		                        <span class="grid-variant">
		                            ${fn:escapeXml(dimension.key)} - ${fn:escapeXml(dimension.value)}
		                        </span>
                            </c:forEach>
                        </td>
                    </tr>
                    <tr>
                        <c:forEach items="${readonlyGridData.value.leafDimensionDataSet}" var="leafDimensionData">
                            <td class="grid-prod-info">
                                <span class="grid-size">
                                    <c:if test="${fn:length(leafDimensionData.leafDimensionHeader) > 0}">
                                        ${fn:escapeXml(leafDimensionData.leafDimensionHeader)} - ${fn:escapeXml(leafDimensionData.leafDimensionValue)}<br/>
                                    </c:if>
                                </span>
                                <span class="grid-qty">
                                    <span class="grid-qty-label"><spring:theme code="product.grid.readonly.qty" />&nbsp;</span>
                                    ${fn:escapeXml(leafDimensionData.leafDimensionData)}
                                </span>
                                <span class="grid-price">
                                    <format:price priceData="${leafDimensionData.price}"/>
                                </span>
                            </td>
                        </c:forEach>
                    </tr>
                </table>
            </td>
        </tr>
    </c:forEach>
</table>


