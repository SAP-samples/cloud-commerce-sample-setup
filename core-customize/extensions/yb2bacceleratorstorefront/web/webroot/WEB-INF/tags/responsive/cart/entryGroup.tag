<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="cartData" required="true" type="de.hybris.platform.commercefacades.order.data.CartData" %>
<%@ attribute name="entryGroup" required="true" type="de.hybris.platform.commercefacades.order.EntryGroupData" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="cart" tagdir="/WEB-INF/tags/responsive/cart" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<%--
   Represents non-root entry group on cart page
--%>

<spring:htmlEscape defaultHtmlEscape="true"/>

<c:choose>
    <c:when test="${not empty entryGroup.children}">
        <c:forEach items="${entryGroup.children}" var="group" varStatus="loop">
            <cart:entryGroup cartData="${cartData}" entryGroup="${group}"/>
        </c:forEach>
    </c:when>
    <c:otherwise>
        <tr>
            <td>
                <table>
                    <spring:url value="/entrygroups/{/entryGroupType}/{/entryGroupNumber}" var="editGroupUrl"
                                htmlEscape="false">
                        <spring:param name="entryGroupNumber" value="${entryGroup.groupNumber}"/>
                        <spring:param name="entryGroupType" value="${entryGroup.groupType}"/>
                    </spring:url>
                    <tr class="entry-group-header">
                        <c:choose>
                            <c:when test="${entryGroup.erroneous}">
                                <th class="error">
                                    <div class="row">
                                        <div class="col-md-10 col-lg-11 col-sm-9 left-align">
                                                ${fn:escapeXml(entryGroup.label)}
                                            <p class="entry-group-error-message">
                                                <spring:theme code="basket.validation.invalidGroup"/>
                                            </p>
                                        </div>
                                        <div class="col-md-2 col-lg-1 col-sm-3">
                                            <a href="${fn:escapeXml(editGroupUrl)}"><spring:theme code="cart.groups.edit"/></a>
                                        </div>
                                    </div>
                                </th>
                            </c:when>
                            <c:otherwise>
                                <th>
                                    <div class="row">
                                        <div class="col-md-10 col-lg-11 col-sm-9 left-align">
                                                ${fn:escapeXml(entryGroup.label)}
                                        </div>
                                        <div class="col-md-2 col-lg-1 col-sm-3">
                                            <a href="${fn:escapeXml(editGroupUrl)}"><spring:theme code="cart.groups.edit"/></a>
                                        </div>
                                    </div>
                                </th>
                            </c:otherwise>
                        </c:choose>
                    </tr>
                    <c:if test="${not empty entryGroup.orderEntries}">
                        <c:forEach items="${entryGroup.orderEntries}" var="entry">
                            <tr>
                                <td>
                                    <cart:cartItem cartData="${cartData}" entry="${entry}" index="${entryGroup.groupNumber}"/>
                                </td>
                            </tr>
                        </c:forEach>
                    </c:if>
                </table>
            </td>
        </tr>
    </c:otherwise>
</c:choose>