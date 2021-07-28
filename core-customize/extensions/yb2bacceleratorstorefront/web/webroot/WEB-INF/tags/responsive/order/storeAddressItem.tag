<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="deliveryPointOfService" required="true" type="de.hybris.platform.commercefacades.storelocator.data.PointOfServiceData" %>
<%@ attribute name="statusDate" required="false" type="java.util.Date" %>
<%@ attribute name="inProgress" required="false" type="java.lang.Boolean" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="order" tagdir="/WEB-INF/tags/responsive/order" %>

<spring:htmlEscape defaultHtmlEscape="true" />

    <div class="row">
        <div class="col-sm-6 col-md-4 order-store-address">
            <div class="label-order"><spring:theme code="text.account.order.consignment.store.title"/></div>
            ${fn:escapeXml(deliveryPointOfService.displayName)}&nbsp;
            <order:addressItem address="${deliveryPointOfService.address}" storeAddress="true"/>
            <br/>
            ${fn:escapeXml(deliveryPointOfService.address.phone)}
        </div>

        <c:set var="openingSchedule" value="${deliveryPointOfService.openingHours}"/>
        <c:if test="${not empty openingSchedule}">
            <div class="col-sm-6 col-md-4 order-store-hours">
                <div class="label-order"><spring:theme code="storeDetails.table.opening"/></div>
                <ycommerce:testId code="storeDetails_table_openingSchedule_label">
                    <c:forEach items="${openingSchedule.weekDayOpeningList}" var="weekDay">
                        <span class="value-order-date">${fn:escapeXml(weekDay.weekDay)}</span>
                        <c:choose>
                            <c:when test="${weekDay.closed}" >
                                <spring:theme code="storeDetails.table.opening.closed" />
                            </c:when>
                            <c:otherwise>
                                ${fn:escapeXml(weekDay.openingTime.formattedHour)} - ${fn:escapeXml(weekDay.closingTime.formattedHour)},&nbsp;
                            </c:otherwise>
                        </c:choose>
                        <br/>
                    </c:forEach>
                </ycommerce:testId>
            </div>
            <div class="col-sm-6 col-md-4 order-store-hours">
                <c:if test="${not inProgress and statusDate ne null}">
                    <div class="label-order"><spring:theme code="text.account.order.consignment.pickUpBy"/></div><fmt:formatDate value="${statusDate}" dateStyle="medium" timeStyle="short" type="both"/>
                </c:if>
            </div>
        </c:if>
    </div>