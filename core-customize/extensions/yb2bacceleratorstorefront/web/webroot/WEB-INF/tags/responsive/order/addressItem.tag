<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="address" required="true" type="de.hybris.platform.commercefacades.user.data.AddressData" %>
<%@ attribute name="storeAddress" required="false" type="java.lang.Boolean" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:if test="${not storeAddress }">
	<c:if test="${not empty address.title}">
	    ${fn:escapeXml(address.title)}&nbsp;
	</c:if>
	${fn:escapeXml(address.firstName)}&nbsp;${fn:escapeXml(address.lastName)}
	<br>
</c:if>
${fn:escapeXml(address.line1)}
<c:if test="${not empty address.line2}">
	<br>
	${fn:escapeXml(address.line2)}
</c:if>
<br>
${fn:escapeXml(address.town)}&nbsp;${fn:escapeXml(address.region.name)}
<br>
${fn:escapeXml(address.country.name)}&nbsp;${fn:escapeXml(address.postalCode)}
<br/>
${fn:escapeXml(address.phone)}