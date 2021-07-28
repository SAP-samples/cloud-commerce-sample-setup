<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="analytics" tagdir="/WEB-INF/tags/shared/analytics" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<script src="${fn:escapeXml(sharedResourcePath)}/js/analyticsmediator.js"></script>
<analytics:googleAnalytics/>