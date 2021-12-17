<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="formElement" tagdir="/WEB-INF/tags/responsive/formElement" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags"%>

<spring:htmlEscape defaultHtmlEscape="true" />

<div class="forgotten-password">
	<div class="description"><spring:theme code="forgottenPwd.description"/></div>
	<form:form method="post" modelAttribute="forgottenPwdForm">
		<div class="control-group">
			<ycommerce:testId code="login_forgotPasswordEmail_input">
				<formElement:formInputBox idKey="forgottenPwd.email" labelKey="forgottenPwd.email" path="email" mandatory="true"/>
			</ycommerce:testId>
			<ycommerce:testId code="login_forgotPasswordSubmit_button">
				<button class="btn btn-primary btn-block" type="submit">
					<spring:theme code="forgottenPwd.title"/>
				</button>
			</ycommerce:testId>
		</div>
	</form:form>
</div>
