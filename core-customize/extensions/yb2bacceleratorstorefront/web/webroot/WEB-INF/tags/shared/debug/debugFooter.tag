<%@ tag body-content="empty" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<%-- Debug footer. Not for production. Outputs in an HTML comment --%>

<c:if test="${showStorefrontDebugInfo}">
<!-- TODO: Remove From Production

DEBUG INFO

cmsPageName=${fn:escapeXml(cmsPage.name)}
cmsSiteUid=${fn:escapeXml(cmsSite.uid)}
secure=${fn:escapeXml(request.secure)}
contextPath=${fn:escapeXml(request.contextPath)}
siteRootPath=<c:url value="/"/>

siteResourcePath=${fn:escapeXml(siteResourcePath)}
themeResourcePath=${fn:escapeXml(themeResourcePath)}
commonResourcePath=${fn:escapeXml(commonResourcePath)}
requestURI=${fn:escapeXml(request.requestURI)}


Jalo Session details:

${fn:escapeXml(storefrontDebugJaloSessionAttributes)}


UiExperienceLevel:

uiExperienceLevel=${fn:escapeXml(uiExperienceLevel)}
uiExperienceOverride=${fn:escapeXml(uiExperienceOverride)}
detectedUiExperienceCode=${fn:escapeXml(detectedUiExperienceCode)}
overrideUiExperienceCode=${fn:escapeXml(overrideUiExperienceCode)}


Detected Browser:

detectedDeviceId=${fn:escapeXml(detectedDevice.id)}
detectedDeviceUserAgent=${fn:escapeXml(detectedDevice.userAgent)}
detectedDeviceCapabilities=${fn:escapeXml(detectedDevice.capabilities)}

-->
</c:if>
