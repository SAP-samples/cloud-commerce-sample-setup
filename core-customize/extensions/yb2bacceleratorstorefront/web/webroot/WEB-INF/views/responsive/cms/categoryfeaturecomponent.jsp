<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags"%>

<spring:htmlEscape defaultHtmlEscape="true" />

<div>
	<spring:theme code="text.component.message.underconstruction" var="underconstructionHtml" htmlEscape="false" text="Information: Component Under Construction - Not Completely Functional"/>
	${ycommerce:sanitizeHTML(underconstructionHtml)}
</div>
