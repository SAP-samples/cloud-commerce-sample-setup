<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="element" required="true" type="java.lang.String"%>
<%@ attribute name="styleClass" required="false" type="java.lang.String"%>
<%@ attribute name="parentComponent" required="false" type="de.hybris.platform.cms2.model.contents.components.AbstractCMSComponentModel"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="cms" uri="http://hybris.com/tld/cmstags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<c:forEach items="${actions}" var="action" varStatus="idx">
	<c:if test="${action.visible}">
		<${ycommerce:sanitizeHtmlTagName(element)} class="${fn:escapeXml(parentComponent.uid)}-${fn:escapeXml(action.uid)}" data-index="${idx.index + 1}" class="${styleClass}">
			<cms:component component="${action}" parentComponent="${parentComponent}" evaluateRestriction="true"/>
		</${ycommerce:sanitizeHtmlTagName(element)}>
	</c:if>
</c:forEach>
