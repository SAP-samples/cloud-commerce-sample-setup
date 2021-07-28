<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="product" required="true" type="de.hybris.platform.commercefacades.product.data.ProductData" %>
<%@ attribute name="readOnly" required="false" type="java.lang.Boolean"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="grid" tagdir="/WEB-INF/tags/responsive/grid" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<c:set var="headerVariant" value="${product.variantMatrix[0]}"/>

<div class="orderForm_grid_group">
	<c:set var="skusId" value="${headerVariant.variantOption.code}"/>

	<grid:coreTableHeader variant="${headerVariant}"
						  product="${product}"
						  skusId="${skusId}"
						  showName="${showName}"
						  readOnly="${readOnly}"/>

	<div class="product-grid-container">
		<table data-variant-loop="0">
			<grid:coreTable variants="${product.variantMatrix}"
							inputTitle="${titleQuantityText}"
							loopIndex="${loopIndex}"
							readOnly="${readOnly}"
							skusId="${skusId}"
							firstVariant="${headerVariant}"/>
		</table>
	</div>


</div>