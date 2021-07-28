<%@ page trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="template" tagdir="/WEB-INF/tags/responsive/template"%>
<%@ taglib prefix="cms" uri="http://hybris.com/tld/cmstags"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="formElement" tagdir="/WEB-INF/tags/responsive/formElement" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<div class="account-section-header">
    <div class="row">
        <div class="container-lg col-md-6">
            <spring:theme code="text.account.profile.updatePersonalDetails"/>
        </div>
    </div>
</div>
<div class="row">
    <div class="container-lg col-md-6">
        <div class="account-section-content">
            <div class="account-section-form">
                <form:form action="update-profile" method="post" modelAttribute="updateProfileForm">

                    <formElement:formSelectBoxDefaultEnabled idKey="profile.title" labelKey="profile.title" path="titleCode" mandatory="true" skipBlank="false" skipBlankMessageKey="form.select.none" items="${titleData}" selectCSSClass="form-control"/>
                    <formElement:formInputBox idKey="profile.firstName" labelKey="profile.firstName" path="firstName" inputCSS="text" mandatory="true"/>
                    <formElement:formInputBox idKey="profile.lastName" labelKey="profile.lastName" path="lastName" inputCSS="text" mandatory="true"/>

                    <div class="row">
                        <div class="col-sm-6 col-sm-push-6">
                            <div class="accountActions">
                                <ycommerce:testId code="personalDetails_savePersonalDetails_button">
                                    <button type="submit" class="btn btn-primary btn-block">
                                        <spring:theme code="text.account.profile.saveUpdates" text="Save Updates"/>
                                    </button>
                                </ycommerce:testId>
                            </div>
                        </div>
                        <div class="col-sm-6 col-sm-pull-6">
                            <div class="accountActions">
                                <ycommerce:testId code="personalDetails_cancelPersonalDetails_button">
                                    <button type="button" class="btn btn-default btn-block backToHome">
                                        <spring:theme code="text.account.profile.cancel" text="Cancel"/>
                                    </button>
                                </ycommerce:testId>
                            </div>
                        </div>
                    </div>
                </form:form>
            </div>
        </div>
    </div>
</div>