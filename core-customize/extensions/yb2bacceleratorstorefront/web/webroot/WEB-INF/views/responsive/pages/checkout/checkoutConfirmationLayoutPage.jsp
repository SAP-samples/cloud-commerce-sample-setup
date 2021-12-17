<%@ page trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="template" tagdir="/WEB-INF/tags/responsive/template"%>
<%@ taglib prefix="cms" uri="http://hybris.com/tld/cmstags"%>

<template:page pageTitle="${pageTitle}">
    <cms:pageSlot position="SideContent" var="feature" class="accountPageSideContent" element="div">
        <cms:component component="${feature}" element="div" class="accountPageSideContent-component"/>
    </cms:pageSlot>
    <cms:pageSlot position="TopContent" var="feature" element="div" class="accountPageTopContent">
        <cms:component component="${feature}" element="div" class="accountPageTopContent-component"/>
    </cms:pageSlot>
    <div class="account-section">
        <cms:pageSlot position="BodyContent" var="feature" element="div" class="account-section-content checkout__confirmation__content">
            <cms:component component="${feature}" element="div" class="checkout__confirmation__content--component"/>
        </cms:pageSlot>
    </div>
    <cms:pageSlot position="BottomContent" var="feature" element="div" class="accountPageBottomContent">
        <cms:component component="${feature}" element="div" class="accountPageBottomContent-component"/>
    </cms:pageSlot>
</template:page>