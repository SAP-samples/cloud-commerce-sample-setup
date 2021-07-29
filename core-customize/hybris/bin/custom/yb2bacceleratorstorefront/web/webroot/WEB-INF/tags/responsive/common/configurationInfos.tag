<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>

<%@ attribute name="entry" required="true" type="de.hybris.platform.commercefacades.order.data.OrderEntryData" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:forEach items="${entry.configurationInfos}" var="configurationInfo">
     <div>
          ${fn:escapeXml(configurationInfo.configurationLabel)}
          <c:if test="${not empty configurationInfo.configurationLabel}">: </c:if>
          ${fn:escapeXml(configurationInfo.configurationValue)}
     </div>
</c:forEach>
