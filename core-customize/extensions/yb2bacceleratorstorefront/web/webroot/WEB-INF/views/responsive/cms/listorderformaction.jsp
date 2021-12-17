<%@ page trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<c:if test="${product.multidimensional}" >
	<c:url value="${product.url}/orderForm" var="productOrderFormUrl"/>
	<form:form id="orderForm${fn:escapeXml(product.code)}" action="${productOrderFormUrl}" method="get">		
		<button id="productOrderFormButton" type="submit" class="btn btn-block btn-default glyphicon glyphicon-list-alt productOrderFormButton">

		</button>
	</form:form>
</c:if>
