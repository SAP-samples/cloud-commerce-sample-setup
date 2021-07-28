<%@ page trimDirectiveWhitespaces="true"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:url value="/search/" var="searchUrl" />
<spring:url value="/search/autocomplete/{/componentuid}" var="autocompleteUrl" htmlEscape="false">
     <spring:param name="componentuid"  value="${component.uid}"/>
</spring:url>

<div class="ui-front">
	<form name="search_form_${fn:escapeXml(component.uid)}" method="get"
		action="${fn:escapeXml(searchUrl)}">
		<div class="input-group">
			<spring:theme code="search.placeholder" var="searchPlaceholderHtml" />

			<ycommerce:testId code="header_search_input">
				<c:set var="optionsJson">
					{
						"autocompleteUrl" : "${ycommerce:encodeJSON(autocompleteUrl)}",
						"minCharactersBeforeRequest" : "${ycommerce:encodeJSON(component.minCharactersBeforeRequest)}",
						"waitTimeBeforeRequest" : "${ycommerce:encodeJSON(component.waitTimeBeforeRequest)}",
						"displayProductImages" : "${ycommerce:encodeJSON(component.displayProductImages)}"
					}
				</c:set>
				<input type="text" id="js-site-search-input"
					class="form-control js-site-search-input" name="text" value=""
                    maxlength="100" placeholder="${searchPlaceholderHtml}"
					data-options="${fn:escapeXml(optionsJson)}">
			</ycommerce:testId>

			<span class="input-group-btn"> <ycommerce:testId code="header_search_button">
					<button class="btn btn-link js_search_button" type="submit" disabled="true">
						<span class="glyphicon glyphicon-search"></span>
					</button>
				</ycommerce:testId>
			</span>
		</div>
	</form>

</div>
