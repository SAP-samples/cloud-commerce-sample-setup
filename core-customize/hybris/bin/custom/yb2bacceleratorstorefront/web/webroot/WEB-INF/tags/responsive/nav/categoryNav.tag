<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="pageData" required="true" type="de.hybris.platform.commerceservices.search.facetdata.ProductCategorySearchPageData" %>
<%@ taglib prefix="nav" tagdir="/WEB-INF/tags/responsive/nav" %>
<%--
 Tag to display the category navigation.
 If the first facet is the category facet, then only that facet is shown. Otherwise the full facet nav is shown.
--%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>


<c:choose>
	<c:when test="${showCategoriesOnly}">	
		<nav:categoryNavLinks categories="${pageData.subCategories}"/>
	</c:when>

	<c:otherwise>
		<nav:facetNavAppliedFilters pageData="${pageData}"/>
		<nav:facetNavRefinements pageData="${pageData}"/>
	</c:otherwise>
</c:choose>