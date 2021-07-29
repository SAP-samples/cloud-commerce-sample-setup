<%@ taglib prefix="address" tagdir="/WEB-INF/tags/responsive/address"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

	<form:form modelAttribute="sopPaymentDetailsForm">
		<address:billingAddressFormElements regions="${regions}"
		                             country="${country}" tabindex="12"/>
	</form:form>
