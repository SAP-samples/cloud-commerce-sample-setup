<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:set var="noBorder" value=""/>
<c:if test="${not empty addressData}">
    <c:set var="noBorder" value="no-border"/>
</c:if>

<div class="account-section-header ${noBorder}">
    <spring:theme code="text.account.addressBook"/>

        <ycommerce:testId code="addressBook_addNewAddress_button">
            <div class="account-section-header-add pull-right">
                <a href="add-address">
                    <spring:theme code="text.account.addressBook.addAddress"/>
                </a>
            </div>
        </ycommerce:testId>
    </div>
</div>

<div class="account-addressbook account-list">
    <c:if test="${empty addressData}">
		<div class="account-section-content content-empty">
			<spring:theme code="text.account.addressBook.noSavedAddresses" />
		</div>
    </c:if>

    <c:if test="${not empty addressData}">
	    <div class="account-cards card-select">
			<div class="row">
				<c:forEach items="${addressData}" var="address">
					<div class="col-xs-12 col-sm-6 col-md-4 card">
						<ul class="pull-left">
							<li>
								<strong>${fn:escapeXml(address.title)}&nbsp;${fn:escapeXml(address.firstName)}&nbsp;${fn:escapeXml(address.lastName)}
									<c:if test="${address.defaultAddress}">
										(<spring:theme code="text.default"/>)
									</c:if>
								</strong>
							</li>
							<li>${fn:escapeXml(address.line1)}</li>
							<c:if test="${not empty fn:escapeXml(address.line2)}">
								<li>${fn:escapeXml(address.line2)}</li>
							</c:if>
							<li>${fn:escapeXml(address.town)}&nbsp;${fn:escapeXml(address.region.name)}</li>
							<li> ${fn:escapeXml(address.country.name)}&nbsp;${fn:escapeXml(address.postalCode)}</li>
							<li>${fn:escapeXml(address.phone)}</li>
						</ul>

						<c:if test="${not address.defaultAddress}">
							<ycommerce:testId code="addressBook_isDefault_button">
								<a class="account-set-default-address" href="set-default-address/${fn:escapeXml(ycommerce:encodeUrl(address.id))}">
									<spring:theme code="text.setDefault"/>
								</a>
							</ycommerce:testId>
						</c:if>
						<div class="account-cards-actions pull-left">
							<ycommerce:testId code="addressBook_editAddress_button">
								<a class="action-links" href="edit-address/${fn:escapeXml(ycommerce:encodeUrl(address.id))}">
									<span class="glyphicon glyphicon-pencil"></span>
								</a>
							</ycommerce:testId>
							<ycommerce:testId code="addressBook_removeAddress_button">
								<a href="#" class="action-links removeAddressFromBookButton" data-address-id="${fn:escapeXml(address.id)}" data-popup-title="<spring:theme code="text.address.delete.popup.title" />">
									<span class="glyphicon glyphicon-remove"></span>
								</a>
							</ycommerce:testId>
						</div>
					</div>
				</c:forEach>
			</div>
			
			<c:forEach items="${addressData}" var="address">
		        <div class="display-none">
		       	 	<div id="popup_confirm_address_removal_${fn:escapeXml(address.id)}" class="account-address-removal-popup">
		        		<div class="addressItem">
		        			<spring:theme code="text.address.remove.following" />
		       				
		       				<div class="address">
						        <strong>
						        ${fn:escapeXml(address.title)}&nbsp;
						        ${fn:escapeXml(address.firstName)}&nbsp;
						        ${fn:escapeXml(address.lastName)}
						        </strong>
						        <br>
						        ${fn:escapeXml(address.line1)}&nbsp;
						        ${fn:escapeXml(address.line2)}
						        <br>
						        ${fn:escapeXml(address.town)}&nbsp;
						        <c:if test="${not empty address.region.name }">
						            ${fn:escapeXml(address.region.name)}&nbsp;
						        </c:if>
						        <br>
						        ${fn:escapeXml(address.country.name)}&nbsp;
						        ${fn:escapeXml(address.postalCode)}
						        <br/>
						
						
						        ${fn:escapeXml(address.phone)}
		       				</div>
					        
					        <div class="modal-actions">
                                <div class="row">
                                    <ycommerce:testId code="addressRemove_delete_button">
                                        <div class="col-xs-12 col-sm-6 col-sm-push-6">
											<form:form action="remove-address/${fn:escapeXml(ycommerce:encodeUrl(address.id))}"
													   class="url-holder"
													   data-address-id="${fn:escapeXml(address.id)}">
												<button type="submit" class="btn btn-primary btn-block">
													<spring:theme code="text.address.delete" />
												</button>
											</form:form>
                                        </div>
                                    </ycommerce:testId>
                                    <div class="col-xs-12 col-sm-6 col-sm-pull-6">
                                        <a class="btn btn-default btn-block closeColorBox" data-address-id="${fn:escapeXml(address.id)}">
                                            <spring:theme code="text.button.cancel"/>
                                        </a>
                                    </div>
					       	    </div>
					       	</div>
		        		</div>
		        	</div>
		        </div>
		    </c:forEach>
	    </div>
    </c:if>
</div>
