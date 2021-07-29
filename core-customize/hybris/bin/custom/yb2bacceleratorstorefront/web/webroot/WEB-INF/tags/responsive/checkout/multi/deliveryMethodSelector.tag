<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="deliveryMethods" required="true" type="java.util.List" %>
<%@ attribute name="selectedDeliveryMethodId" required="false" type="java.lang.String" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="multi-checkout" tagdir="/WEB-INF/tags/responsive/checkout/multi" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<select id="delivery_method" name="delivery_method" class="form-control">
	<c:forEach items="${deliveryMethods}" var="deliveryMethod">
		<multi-checkout:deliveryMethodDetails deliveryMethod="${deliveryMethod}" isSelected="${deliveryMethod.code eq selectedDeliveryMethodId}"/>
	</c:forEach>
</select>
