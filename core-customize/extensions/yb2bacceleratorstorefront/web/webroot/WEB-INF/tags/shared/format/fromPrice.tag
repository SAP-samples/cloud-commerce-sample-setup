<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="priceData" required="true" type="de.hybris.platform.commercefacades.product.data.PriceData" %>
<%--
 Tag to render a currency formatted price.
 Includes the currency symbol for the specific currency.
--%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"  %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:choose>
	<c:when test="${priceData.priceType == 'FROM'}">
		<%--
		We pass the formatted currency amount into the message so that it can be used in the from message.
		Note: As the formatted currency may contain characters that <spring:theme> interprets as argument
		separators (e.g. comma) we change the separator to some random string sequence that will not appear
		in the formatted currency value.
		 --%>
		<spring:theme code="product.price.from" arguments="${priceData.formattedValue}" argumentSeparator="#~/@!£$%^"/>
	</c:when>
	<c:otherwise>
		${fn:escapeXml(priceData.formattedValue)}
	</c:otherwise>
</c:choose>
