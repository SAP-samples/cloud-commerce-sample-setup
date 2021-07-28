<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="pageData" required="true" type="de.hybris.platform.commerceservices.search.facetdata.FacetSearchPageData" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="nav" tagdir="/WEB-INF/tags/responsive/nav" %>



<c:forEach items="${pageData.facets}" var="facet">
	<c:choose>
		<c:when test="${facet.code eq 'availableInStores'}">
			<nav:facetNavRefinementStoresFacet facetData="${facet}" userLocation="${userLocation}"/>
		</c:when>
		<c:otherwise>
			<nav:facetNavRefinementFacet facetData="${facet}"/>
		</c:otherwise>
	</c:choose>
</c:forEach>


