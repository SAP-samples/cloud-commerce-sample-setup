<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="cmsPageRequestContextData" required="true" type="de.hybris.platform.acceleratorcms.data.CmsPageRequestContextData" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:if test="${cmsPageRequestContextData.liveEdit}">

    <c:if test="${empty addOnLiveEditCommonCssPaths and empty addOnLiveEditThemeCssPaths}">
        <link rel="stylesheet" type="text/css" href="${fn:escapeXml(commonResourcePath)}/liveedit/hybris.cms.live.edit.css" />
    </c:if>
    <c:if test="${not empty addOnLiveEditCommonCssPaths or not empty addOnLiveEditThemeCssPaths}">
        <c:forEach items="${addOnLiveEditCommonCssPaths}" var="addOnCommonCss">
            <link rel="stylesheet" type="text/css" media="all" href="${fn:escapeXml(addOnCommonCss)}" />
        </c:forEach>

        <c:forEach items="${addOnLiveEditThemeCssPaths}" var="addOnThemeCss">
            <link rel="stylesheet" type="text/css" media="all" href="${fn:escapeXml(addOnThemeCss)}" />
        </c:forEach>
    </c:if>
</c:if>
