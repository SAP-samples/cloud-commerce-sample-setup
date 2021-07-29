<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="product" required="true" type="de.hybris.platform.commercefacades.product.data.ProductData" %>
<%@ attribute name="showName" required="false" type="java.lang.Boolean"%>
<%@ attribute name="filterSkus" required="false" type="java.util.List" %>
<%@ attribute name="readOnly" required="false" type="java.lang.Boolean"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="grid" tagdir="/WEB-INF/tags/responsive/grid" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:set var="loopIndex" value="0"/>
<c:set var="loopIndexColor" value="0"/>

<c:forEach items="${product.variantMatrix}" var="firstVariant" varStatus="parentLoop">
	<c:if test="${empty(filterSkus) || (!empty(filterSkus) && fn:contains(filterSkus, firstVariant.variantOption.code) ) }">
		<div class="orderForm_grid_group">
			<c:set var="skusId" value="${firstVariant.variantOption.code}"/>
			<grid:coreTableHeader variant="${firstVariant}"
								  product="${product}"
								  skusId="${skusId}"
								  showName="${showName}"
								  readOnly="${readOnly}" />

			<c:set var="loopIndexColor" value="${loopIndexColor +1}"/>
			<div class="product-grid-container">

                <c:forEach items="${firstVariant.elements}" var="thirdVariant" varStatus="loop">
                    <table class="product-grid-container-dim-3" data-variant-loop="${parentLoop.index}${loop.index}">
                        <grid:coreTable variants="${thirdVariant.elements}"
                                        inputTitle="${thirdVariant.variantValueCategory.name}"
                                        loopIndex="${loopIndex}"
                                        readOnly="${readOnly}"
								        firstVariant="${firstVariant}"
										product="${product}"
										skusId="${skusId}"
										showName="${showName}"
										showLastDimensionTitle="true"/>
                        <c:set var="loopIndex" value="${loopIndex + fn:length(thirdVariant.elements)}"/>
                     </table>
                </c:forEach>

			</div>
		</div>
	</c:if>

</c:forEach>