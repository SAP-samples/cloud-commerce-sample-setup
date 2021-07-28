<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="spring"  uri="http://www.springframework.org/tags"%>

<spring:htmlEscape defaultHtmlEscape="true" />

<div class="alert negative display-none" id="noStoreSelected" tabindex="0">
	<spring:theme code="basket.error.no.pickup.location"/>
</div>