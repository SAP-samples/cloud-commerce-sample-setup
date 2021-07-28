<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<%-- JS configuration --%>
<script>
	/*<![CDATA[*/
	ACC.addons = {};	//JS namespace for addons properties

	<c:forEach var="jsVarHolder" items="${jsAddOnsVariables}">
		ACC.addons['${ycommerce:encodeJavaScript(jsVarHolder.key)}'] = [];
		<c:forEach var="jsVar" items="${jsVarHolder.value}">
			<c:if test="${not empty jsVar.qualifier}" >
				ACC.addons['${ycommerce:encodeJavaScript(jsVarHolder.key)}']['${ycommerce:encodeJavaScript(jsVar.qualifier)}'] = '${ycommerce:encodeJavaScript(jsVar.value)}';
			</c:if>
		</c:forEach>
	</c:forEach>
	/*]]>*/
</script>
