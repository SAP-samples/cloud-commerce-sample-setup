<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>

<%@ attribute name="openingSchedule" required="true"
              type="de.hybris.platform.commercefacades.storelocator.data.OpeningScheduleData" %>

<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="theme" tagdir="/WEB-INF/tags/shared/theme" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ taglib prefix="store" tagdir="/WEB-INF/tags/responsive/store" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<spring:htmlEscape defaultHtmlEscape="true"/>

<c:if test="${not empty openingSchedule}">
    {
        <c:forEach items="${openingSchedule.weekDayOpeningList}" var="weekDay" varStatus="weekDayNumber">
            <c:choose>
                <c:when test="${weekDay.closed}">
                		<spring:theme code="storeDetails.table.opening.closed" htmlEscape="false" var="closedText"/>
                    "${ycommerce:encodeJSON(weekDay.weekDay)}":"${ycommerce:encodeJSON(closedText)}"<c:if
                        test="${!weekDayNumber.last}">,</c:if>
                </c:when>
                <c:otherwise>
                    "${ycommerce:encodeJSON(weekDay.weekDay)}":"${ycommerce:encodeJSON(weekDay.openingTime.formattedHour)} - ${ycommerce:encodeJSON(weekDay.closingTime.formattedHour)}"<c:if
                        test="${!weekDayNumber.last}">,</c:if>
                </c:otherwise>
            </c:choose>
        </c:forEach>
    },
</c:if>
