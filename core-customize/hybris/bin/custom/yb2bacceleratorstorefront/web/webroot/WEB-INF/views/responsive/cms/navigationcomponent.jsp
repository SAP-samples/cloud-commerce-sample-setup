<%@ page trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="cms" uri="http://hybris.com/tld/cmstags"%>

<c:set value="${fn:escapeXml(component.styleClass)}" var="navigationClassHtml" />

<c:if test="${component.visible}">
    <div class="${navigationClassHtml} js-${navigationClassHtml} display-none NAVcompONENT" data-title="${fn:escapeXml(component.navigationNode.title)}">
        <nav class="${navigationClassHtml}__child-wrap display-none">
            <c:if test="${not empty component.navigationNode.title }">
                <div>
                    <c:out value="${component.navigationNode.title}"/>
                </div>
            </c:if>
            <c:forEach items="${component.navigationNode.children}" var="topLevelChild">
                <c:forEach items="${topLevelChild.entries}" var="entry">
                    <div>
                        <cms:component component="${entry.item}" evaluateRestriction="true" />
                    </div>
                </c:forEach>
            </c:forEach>
        </nav>
    </div>
</c:if>