<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="order" required="true" type="de.hybris.platform.commercefacades.order.data.OrderData" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="order" tagdir="/WEB-INF/tags/responsive/order" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:forEach items="${order.unconsignedEntries}" var="entry" varStatus="loop">
    <div class="well well-quinary well-xs">
        <div class="well-headline orderPending">
            <spring:theme code="text.account.order.unconsignedEntry.status.pending" />
        </div>

        <c:choose>
            <c:when test="${entry.deliveryPointOfService ne null}">
                <div class="well-content">
                    <div class="row">
                        <div class="col-sm-12 col-md-9">
                            <order:storeAddressItem deliveryPointOfService="${entry.deliveryPointOfService}" />
                        </div>
                    </div>
                </div>
            </c:when>
            <c:otherwise>
                <div class="well-content">
                    <div class="row">
                        <div class="col-md-5">
                            <div class="order-ship-to">
                                <div class="label-order">
                                    <spring:theme code="text.account.order.shipto" text="Ship To" />
                                </div>
                                <div class="value-order">
                                    <order:addressItem address="${orderData.deliveryAddress}"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </c:otherwise>
        </c:choose>
    </div>

    <ul class="item__list">
        <li class="hidden-xs hidden-sm">
            <ul class="item__list--header">
                <li class="item__toggle"></li>
                <li class="item__image"></li>
                <li class="item__info"><spring:theme code="basket.page.item"/></li>
                <li class="item__price"><spring:theme code="basket.page.price"/></li>
                <li class="item__quantity"><spring:theme code="basket.page.qty"/></li>
                <li class="item__total--column"><spring:theme code="basket.page.total"/></li>
            </ul>
        </li>
        <order:orderEntryDetails orderEntry="${entry}" order="${order}" itemIndex="${loop.index}"/>
    </ul>
</c:forEach>