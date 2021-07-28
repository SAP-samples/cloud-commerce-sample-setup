<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="deliveryMethod" required="true" type="de.hybris.platform.commercefacades.order.data.DeliveryModeData" %>
<%@ attribute name="isSelected" required="false" type="java.lang.Boolean" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<option value="${fn:escapeXml(deliveryMethod.code)}" ${isSelected ? 'selected="selected"' : ''}>
	${fn:escapeXml(deliveryMethod.name)}&nbsp;-&nbsp;${fn:escapeXml(deliveryMethod.description)}&nbsp;-&nbsp;${fn:escapeXml(deliveryMethod.deliveryCost.formattedValue)}
</option>