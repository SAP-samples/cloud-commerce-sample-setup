<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="cartData" required="true" type="de.hybris.platform.commercefacades.order.data.CartData" %>
<%@ attribute name="entryGroup" required="true" type="de.hybris.platform.commercefacades.order.EntryGroupData" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="cart" tagdir="/WEB-INF/tags/responsive/cart" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<%--
   Represents root entry group on cart page
--%>

<spring:htmlEscape defaultHtmlEscape="true"/>

<table>
    <c:if test="${entryGroup.groupType.code != 'STANDALONE'}">
        <tr class="entry-group-header">
            <th>
                <div class="row">
                    <div class="col-md-10 col-lg-11 col-sm-9 left-align">
                            ${fn:escapeXml(entryGroup.label)}
                    </div>
                    <div class="col-md-2 col-lg-1 col-sm-3">
                        <c:if test="${entryGroup.groupNumber != null}">
                            <spring:url value="/cart/entrygroups/{/groupNumber}" var="removeGroupAction" htmlEscape="false">
                                <spring:param name="groupNumber" value="${entryGroup.groupNumber}" />
                            </spring:url>

                            <form:form id="removeGroup${entryGroup.groupNumber}"
                                       action="${removeGroupAction}" method="post">
                                <a class=item__remove" onclick="$(this).closest('form').submit()"
                                   style="cursor: pointer"><spring:theme code="cart.groups.remove"/></a>
                            </form:form>
                        </c:if>
                    </div>
                </div>
            </th>
        </tr>
    </c:if>
    <c:choose>
        <c:when test="${not empty entryGroup.children}">
            <c:forEach items="${entryGroup.children}" var="group" varStatus="loop">
                <cart:entryGroup cartData="${cartData}" entryGroup="${group}"/>
            </c:forEach>
        </c:when>
        <c:otherwise>
            <c:if test="${not empty entryGroup.orderEntries}">
                <c:forEach items="${entryGroup.orderEntries}" var="entry">
                    <tr>
                        <td>
                            <cart:cartItem cartData="${cartData}" entry="${entry}" index="${entryGroup.groupNumber}"/>
                        </td>
                    </tr>
                </c:forEach>
            </c:if>
        </c:otherwise>
    </c:choose>
</table>