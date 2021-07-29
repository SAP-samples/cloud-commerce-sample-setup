<%@ page trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<c:url value="${urlLink}" var="simpleBannerUrl" />

<div class="banner__component simple-banner">
	<c:if test="${ycommerce:validateUrlScheme(media.url)}">
		<c:choose>
			<c:when test="${empty simpleBannerUrl || simpleBannerUrl eq '#' || !ycommerce:validateUrlScheme(simpleBannerUrl)}">
				<img title="${fn:escapeXml(media.altText)}" alt="${fn:escapeXml(media.altText)}"
					src="${fn:escapeXml(media.url)}">
			</c:when>
			<c:otherwise>
				<a href="${fn:escapeXml(simpleBannerUrl)}"><img title="${fn:escapeXml(media.altText)}"
					alt="${fn:escapeXml(media.altText)}" src="${fn:escapeXml(media.url)}"></a>
			</c:otherwise>
		</c:choose>
	</c:if>
</div>