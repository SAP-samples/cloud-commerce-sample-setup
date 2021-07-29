<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="categories" required="true" type="java.util.List" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<div class="nav_column product__facet js-product-facet" id="product-facet">
	<div class="facet js-facet">
        <div class="facet__name js-facet-name"><spring:theme code="search.nav.categoryNav"/></div>

		<ycommerce:testId code="categoryNav_category_links">
			<div class="facet__values js-facet-values js-facet-form">
					<ul class="facet__list js-facet-list">
						<c:forEach items="${categories}" var="category">
							<li>
								<c:url value="${category.url}" var="categoryUrl"/>
                                <span class="facet__text">
									<a href="${fn:escapeXml(categoryUrl)}">${fn:escapeXml(category.name)}</a>&nbsp;
                                        <span class="facet__value__count"></span>

								</span>
							</li>
						</c:forEach>
					</ul>
			</div>
		</ycommerce:testId>
	</div>
</div>
