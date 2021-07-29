<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="spellingSuggestion" required="true" type="de.hybris.platform.commerceservices.search.facetdata.SpellingSuggestionData" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:if test="${not empty spellingSuggestion}">
	<div class="searchSpellingSuggestionPrompt">
		<spring:url value="${spellingSuggestion.query.url}" var="spellingSuggestionQueryUrl" htmlEscape="false"/>
		<spring:theme code="search.spellingSuggestion.prompt" />&nbsp;<a href="${fn:escapeXml(spellingSuggestionQueryUrl)}">${fn:escapeXml(spellingSuggestion.suggestion)}</a>?
	</div>
</c:if>
