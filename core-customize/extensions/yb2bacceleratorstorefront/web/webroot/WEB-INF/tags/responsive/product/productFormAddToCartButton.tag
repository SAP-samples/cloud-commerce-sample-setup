<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="addToCartBtnId" required="false" type="java.lang.String"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<spring:htmlEscape defaultHtmlEscape="true" />

<spring:theme code="text.addToCart" var="addToCartText"/>
<button  id="${(empty addToCartBtnId) ? 'addToCartBtn' : fn:escapeXml(addToCartBtnId)}" type="button" class="btn btn-primary" disabled="disabled">
    <spring:theme code="text.addToCart" var="addToCartText"/>
    <spring:theme code="basket.add.to.basket" />
</button>
