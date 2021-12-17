<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<spring:htmlEscape defaultHtmlEscape="true"/>

<div class="account-section-header account-close-section-header">
    <div class="row">
        <div class="container-lg col-md-6">
            <spring:theme code="text.account.closeAccount.header"/>
        </div>
    </div>
</div>
<div class="row">
    <div class="container-lg col-md-6">
        <div class="account-section-content">
            <div class="account-section-form ">
                <div>
                    <spring:theme code="text.account.closeAccount.retention.info" var="retentionInfoHtml" htmlEscape="false"/>
                    ${ycommerce:sanitizeHTML(retentionInfoHtml)}
                </div>
            </div>
            <button type="button" class="btn btn-primary pull-right js-close-account-popup-button" data-popup-title="<spring:theme code="text.account.closeAccount.popup.title"/>">
                <spring:theme code="text.account.closeAccount.button"/>
            </button>

            <div class="display-none">
                <div id="popup_confirm_account_removal" class="js-close-account-popup">

                    <div class="modal-details row">
                        <spring:theme code="text.account.closeAccount.popup.confirm" />
                    </div>
                    <div class="modal-actions">
                        <div class="row">
                            <div>
                                <a class="btn btn-primary btn-block js-close-account-action">
                                    <spring:theme code="text.account.closeAccount.popup.action" />
                                </a>
                            </div>

                            <div>
                                <a class="btn btn-default btn-block closeColorBox">
                                    <spring:theme code="text.button.cancel" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
