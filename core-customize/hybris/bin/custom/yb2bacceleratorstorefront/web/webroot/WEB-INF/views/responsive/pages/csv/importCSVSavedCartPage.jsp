<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="template" tagdir="/WEB-INF/tags/responsive/template" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="common" tagdir="/WEB-INF/tags/responsive/common" %>
<%@ taglib prefix="format" tagdir="/WEB-INF/tags/shared/format" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<spring:htmlEscape defaultHtmlEscape="true"/>

<spring:url value="/import/csv/saved-cart" var="importCSVSavedCartLink" htmlEscape="false"/>
<spring:url value="/my-account/saved-carts" var="savedCartsLink" htmlEscape="false"/>

<template:page pageTitle="${pageTitle}">
    <div id="import-csv-alerts"></div>
    <div class="account-section">
        <div class="account-section-header no-border">
            <spring:theme code="import.csv.savedCart.title"/>
            <div class="account-section-header__subheadline"><spring:theme code="import.csv.savedCart.filesNote"/></div>
        </div>

        <div class="account-section-content import-csv__content">
            <form:form modelAttribute="importCSVSavedCartForm" enctype="multipart/form-data" method="post" action="${importCSVSavedCartLink}" class="import-csv__form">
            </form:form>
            <div class="well well-quaternary well-md import-csv__well">
                <div class="row">
                    <div class="col-xs-12 col-sm-6 import-csv__file-spec">
                        <strong><spring:theme code="import.csv.savedCart.fileContentNote"/></strong>
                        <ul>
                            <li class="import-csv__file-spec-item"><spring:theme code="import.csv.savedCart.fileContent"/></li>
                            <li class="import-csv__file-spec-item">
                                <spring:theme code="import.csv.savedCart.fileConstraint"/>&nbsp;<format:bytes bytes="${csvFileMaxSize}"/>
                            </li>
                        </ul>
                    </div>
                    <div class="col-xs-12 col-sm-6 import-csv__file-upload">
                        <strong><spring:theme code="import.csv.savedCart.selectFile"/></strong>

                        <div class="form-group file-upload js-file-upload">
                            <div class="file-upload__wrapper btn btn-default btn-small" id="chooseFileButton">
                                <span><spring:theme code="import.csv.savedCart.chooseFile"/></span>
                                <input type="file" id="csvFile" name="csvFile" class="file-upload__input js-file-upload__input"
                                       accept="text/csv" data-file-max-size="${fn:escapeXml(csvFileMaxSize)}"/>
                            </div>
                            <span class="file-upload__file-name js-file-upload__file-name">
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="import-csv__actions js-import-csv">
                <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-3 pull-right">
                        <button class="btn btn-primary btn-block" type="submit" id="importButton">
                            <spring:theme code="import.csv.savedCart.import"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div style="display: none">
    	<spring:theme code="import.csv.savedCart.success" var="inportSuccessHtml" arguments="${savedCartsLink}" htmlEscape="false"/>
        <span id="import-csv-success-message">${ycommerce:sanitizeHTML(inportSuccessHtml)}</span>
        <span id="import-csv-upload-message"><spring:theme code="import.csv.savedCart.uploadStarted"/></span>
        <span id="import-csv-generic-error-message"><spring:theme code="import.csv.savedCart.genericError"/></span>
        <span id="import-csv-file-max-size-exceeded-error-message"><spring:theme code="import.csv.savedCart.fileMaxSizeExceeded"/></span>
        <span id="import-csv-file-csv-required"><spring:theme code="import.csv.savedCart.fileCSVRequired"/></span>
        <span id="import-csv-no-file-chosen-error-message"><spring:theme code="import.csv.savedCart.noFile"/></span>
    </div>
    <common:globalMessagesTemplates/>
</template:page>
