<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="styleClass" required="true" type="java.lang.String" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true"/>
<spring:theme code="search.nav.selectRefinements.title" var="selectRefinementsHtml"/>

<button class="${fn:escapeXml(styleClass)}" data-select-refinements-title="${selectRefinementsHtml}">
    <spring:theme code="search.nav.refine.button"/>
</button>
