<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="product" required="true" type="de.hybris.platform.commercefacades.product.data.ProductData" %>
<%@ attribute name="showName" required="false" type="java.lang.Boolean"%>
<%@ attribute name="filterSkus" required="false" type="java.util.List" %>
<%@ attribute name="readOnly" required="false" type="java.lang.Boolean"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="grid" tagdir="/WEB-INF/tags/responsive/grid" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<c:set var="loopIndex" value="0"/>
<c:set var="titleQuantityText"><spring:theme htmlEscape="false" code="product.grid.quantityText" /></c:set>

<c:forEach items="${product.variantMatrix}" var="headVariant" varStatus="loop">
	<c:if test="${empty(filterSkus) || (!empty(filterSkus) && fn:contains(filterSkus, firstVariant.variantOption.code) ) }">
		<div class="orderForm_grid_group">
			<c:set var="skusId" value="${headVariant.variantOption.code}"/>
			<grid:coreTableHeader variant="${headVariant}"
								  product="${product}"
								  skusId="${skusId}"
								  showName="${showName}"
								  readOnly="${readOnly}"/>

			<div class="product-grid-container">
                <table class="product-grid-container-dim-2" data-variant-loop="${loop.index}">
                    <grid:coreTable variants="${headVariant.elements}"
                                    inputTitle="${titleQuantityText}"
                                    loopIndex="${loopIndex}"
                                    readOnly="${readOnly}"
									firstVariant="${headVariant}"
									product="${product}"
									skusId="${skusId}"
									showName="${showName}"/>
                </table>
				<c:set var="loopIndex" value="${loopIndex + fn:length(headVariant.elements)}" />
			</div>
		</div>
	</c:if>
</c:forEach>