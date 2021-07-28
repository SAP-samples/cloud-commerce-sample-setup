<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true"/>

<div class="futureStockPopup">
    <br>
    <c:choose>
        <c:when test="${not empty futureStocks}">
            <div>
                <c:out value="${product.name}" />
                <br>
                <br>
            </div>

            <c:forEach items="${futureStocks}" var="futureStock" varStatus="status">
                <span>${fn:escapeXml(futureStock.formattedDate)}&nbsp;-&nbsp;<spring:theme code="product.product.details.future.qty" />
                    &nbsp;${fn:escapeXml(futureStock.stock.stockLevel)}
                </span>
                <br />
            </c:forEach>
        </c:when>
        <c:otherwise>
            <spring:theme code="product.product.details.future.nostock" />
        </c:otherwise>
    </c:choose>
</div>
