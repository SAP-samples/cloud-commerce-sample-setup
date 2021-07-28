<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="quote" tagdir="/WEB-INF/tags/responsive/quote" %>

<c:if test="${not empty quoteData.entries}">
    <div class="cart-items">
        <quote:quoteItems quoteData="${quoteData}" />
    </div>
</c:if>
