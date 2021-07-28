<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="idKey" required="true" type="java.lang.String" %>
<%@ attribute name="labelKey" required="true" type="java.lang.String" %>
<%@ attribute name="path" required="true" type="java.lang.String" %>
<%@ attribute name="mandatory" required="false" type="java.lang.Boolean" %>
<%@ attribute name="labelCSS" required="false" type="java.lang.String" %>
<%@ attribute name="areaCSS" required="false" type="java.lang.String" %>
<%@ attribute name="placeholder" required="false" type="java.lang.String" %>
<%@ attribute name="disabled" required="false" type="java.lang.Boolean" %>
<%@ attribute name="maxlength" required="false" type="java.lang.Integer" %>

<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="template" tagdir="/WEB-INF/tags/responsive/template" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<template:errorSpanField path="${path}">
    <label class="${fn:escapeXml(labelCSS)}" for="${fn:escapeXml(idKey)}">
        <spring:theme code="${labelKey}"/>
        <c:if test="${mandatory != null && mandatory == false}">
            <span>&nbsp;<spring:theme code="login.optional"/></span>
        </c:if>
        <span class="skip"><form:errors path="${path}"/></span>
    </label>

    <form:textarea cssClass="${fn:escapeXml(areaCSS)}" id="${idKey}" path="${path}" disabled="${disabled}" placeholder="${placeholder}"
                   maxlength="${maxlength}"/>

</template:errorSpanField>
