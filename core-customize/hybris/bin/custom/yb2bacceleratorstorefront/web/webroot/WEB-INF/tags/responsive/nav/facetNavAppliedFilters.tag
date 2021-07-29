<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="pageData" required="true" type="de.hybris.platform.commerceservices.search.facetdata.ProductSearchPageData" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:if test="${not empty pageData.breadcrumbs}">

	<div class="facet js-facet">

	<div class="facet__name js-facet-name">
		<span class="glyphicon facet__arrow"></span>
		<spring:theme code="search.nav.applied.facets"/>
	</div>
		<div class="facet__values js-facet-values">
			<ul class="facet__list">
				<c:forEach items="${pageData.breadcrumbs}" var="breadcrumb">
					<li>
						<c:url value="${breadcrumb.removeQuery.url}" var="removeQueryUrl"/>
						${fn:escapeXml(breadcrumb.facetValueName)}&nbsp;<a href="${fn:escapeXml(removeQueryUrl)}" ><span class="glyphicon glyphicon-remove"></span></a>
					</li>
				</c:forEach>
			</ul>
		</div>
	</div>

</c:if>