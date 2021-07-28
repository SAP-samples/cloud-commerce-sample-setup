<%@ tag body-content="empty" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:if test="${cmsPageRequestContextData.liveEdit}">
	<div class="yCmsComponentEmpty">
		Empty ${fn:escapeXml(component.itemtype)}: ${fn:escapeXml(component.name)}
	</div>
</c:if>
