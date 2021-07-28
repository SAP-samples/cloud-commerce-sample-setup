<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring"  uri="http://www.springframework.org/tags"%>

<%@ attribute name="url" required="true" type="java.lang.String"%>
<%@ attribute name="labelKey" required="true" type="java.lang.String"%>
<%@ attribute name="labelArguments" required="false" type="java.lang.String"%>

<spring:htmlEscape defaultHtmlEscape="true" />

<div class="back-link">
	<a href="${fn:escapeXml(url)}">
		<span class="glyphicon glyphicon-chevron-left"></span>
	</a>
	<span class="label">
		<spring:theme code="${labelKey}" arguments="${labelArguments}"/>
	</span>
</div>