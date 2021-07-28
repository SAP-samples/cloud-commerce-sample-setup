<%@ page trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="cms" uri="http://hybris.com/tld/cmstags"%>

<div class="tabs js-tabs tabs-responsive">
	<c:forEach var="component" items="${components}">
		<cms:component component="${component}" />
	</c:forEach>
</div>
