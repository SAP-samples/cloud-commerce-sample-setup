<%@ page trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="formElement" tagdir="/WEB-INF/tags/responsive/formElement" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<div class="account-section-header">
	<div class="row">
		<div class="container-lg col-md-6">
			<spring:theme code="text.account.update.email.address"/>
		</div>
	</div>
</div>
<div class="row">
	<div class="container-lg col-md-6">
		<div class="account-section-content">
			<div class="account-section-form">
				<form:form action="update-email" method="post" modelAttribute="updateEmailForm">
					<formElement:formInputBox idKey="profile.email" labelKey="profile.email" path="email" inputCSS="text" mandatory="true"/>
					<formElement:formInputBox idKey="profile.checkEmail"  labelKey="profile.checkEmail" path="chkEmail" inputCSS="text" mandatory="true"/>
					<formElement:formPasswordBox idKey="profile.pwd" labelKey="profile.pwd" path="password" inputCSS="text form-control" mandatory="true"/>
					<input type="hidden" id="recaptchaChallangeAnswered" value="${fn:escapeXml(requestScope.recaptchaChallangeAnswered)}"/>
					<div class="form_field-elements control-group js-recaptcha-captchaaddon"></div>
					<div class="form-actions">
						<div class="row">
							<div class="col-sm-6 col-sm-push-6">
								<div class="accountActions">
									<ycommerce:testId code="email_saveEmail_button">
										<button type="submit" class="btn btn-primary btn-block">
											<spring:theme code="text.account.profile.saveUpdates" />
										</button>
									</ycommerce:testId>
								</div>
							</div>
							<div class="col-sm-6 col-sm-pull-6">
								<div class="accountActions">
									<ycommerce:testId code="email_cancelEmail_button">
										<button type="button" class="btn btn-default btn-block backToHome">
											<spring:theme code="text.account.profile.cancel" />
										</button>
									</ycommerce:testId>
								</div>
							</div>
						</div>
					</div>
				</form:form>
			</div>
		</div>
	</div>
</div>
