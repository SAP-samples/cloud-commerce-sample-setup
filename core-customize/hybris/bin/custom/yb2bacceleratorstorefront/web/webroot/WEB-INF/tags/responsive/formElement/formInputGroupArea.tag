<%@ tag body-content="scriptless" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<%@ attribute name="CSSClass" required="false" type="java.lang.String" %>

<div class="inputArea ${fn:escapeXml(CSSClass)}">
	<jsp:doBody />
</div>
 