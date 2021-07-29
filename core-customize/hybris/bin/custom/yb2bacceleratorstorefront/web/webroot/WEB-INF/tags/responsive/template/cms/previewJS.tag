<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="cmsPageRequestContextData" required="true" type="de.hybris.platform.acceleratorcms.data.CmsPageRequestContextData" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<c:if test="${cmsPageRequestContextData.liveEdit}">

    <c:if test="${empty addOnLiveEditJavaScriptPaths}">
        <script src="${fn:escapeXml(commonResourcePath)}/js/hybris.cms.live.edit.js"></script>
        <c:if test="${cmsPageRequestContextData.preview}">
            <script>

                var currentUserId = '${ycommerce:encodeJavaScript(cmsPageRequestContextData.user.uid)}';
                var currentJaloSessionId = '${ycommerce:encodeJavaScript(cmsPageRequestContextData.sessionId)}';
                var currentPagePk = '${ycommerce:encodeJavaScript(cmsPageRequestContextData.page.pk)}';

                $(function()
                {
                    parent.postMessage({eventName:'notifyIframeAboutUrlChange', data: [window.location.href, currentPagePk, currentUserId, currentJaloSessionId]},'*');
                });
            </script>
        </c:if>
    </c:if>
    <c:if test="${not empty addOnLiveEditJavaScriptPaths}">
        <c:forEach items="${addOnLiveEditJavaScriptPaths}" var="addOnJavaScript">
            <script src="${fn:escapeXml(addOnJavaScript)}"></script>
        </c:forEach>
    </c:if>

</c:if>
