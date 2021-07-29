var ACC = ACC || {}; // make sure ACC is available

if ($("#quickOrder").length > 0) {
    ACC.quickorder = {
        _autoload: [
            "bindClearQuickOrderRow",
            "bindAddSkuInputRow",
            "bindResetFormBtn",
            "bindAddToCartClick",
            "bindCompileTemplate"
        ],

        $quickOrderContainer: $('.js-quick-order-container'),
        $quickOrderMinRows: Number($('.js-quick-order-container').data('quickOrderMinRows')),
        $quickOrderMaxRows: Number($('.js-quick-order-container').data('quickOrderMaxRows')),
        $productExistsInFormMsg: $('.js-quick-order-container').data('productExistsInFormMsg'),
        $quickOrderLeavePageMsg: $('#quickOrder').data('gridConfirmMessage'),
        $hiddenSkuInput: 'input.js-hidden-sku-field',
        $addToCartBtn: $('#js-add-to-cart-quick-order-btn-top, #js-add-to-cart-quick-order-btn-bottom'),
        $resetFormBtn: $('#js-reset-quick-order-form-btn-top, #js-reset-quick-order-form-btn-bottom'),
        $productInfoContainer: '.js-product-info',
        $skuInputField: '.js-sku-input-field',
        $qtyInputField: '.js-quick-order-qty',
        $jsLiContainer: 'li.js-li-container',
        $removeQuickOrderRowBtn: '.js-remove-quick-order-row',
        $skuValidationContainer: '.js-sku-validation-container',
        $qtyValidationContainer: '.js-qty-validation-container',
        $productItemTotal: '.js-quick-order-item-total',
        $classHasError: 'has-error',

        $templateAlias: 'quickOrderRowTemplate',

        bindResetFormBtn: function () {
            ACC.quickorder.$resetFormBtn.on("click", ACC.quickorder.clearForm);
        },

        bindAddToCartClick: function () {
            ACC.quickorder.$addToCartBtn.on("click", ACC.quickorder.addToCart);
        },

        bindAddSkuInputRow: function () {
            $(ACC.quickorder.$skuInputField).on("focusin", ACC.quickorder.addInputRow).on("focusout keydown", ACC.quickorder.handleFocusOutOnSkuInput);
        },

        bindClearQuickOrderRow: function () {
            $(ACC.quickorder.$removeQuickOrderRowBtn).on("mousedown", ACC.quickorder.clearQuickOrderRow);
        },

        bindCompileTemplate: function () {
            $.template(ACC.quickorder.$templateAlias, $("#quickOrderRowTemplate"));
        },

        addToCart: function () {
            $.ajax({
                url: ACC.quickorder.$quickOrderContainer.data('quickOrderAddToCartUrl'),
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: ACC.quickorder.getJSONDataForAddToCart(),
                async: false,
                success: function (response) {
                    ACC.quickorder.handleAddToCartSuccess(response);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // log the error to the console
                    console.log("The following error occurred: " + textStatus, errorThrown);    // NOSONAR
                }
            });
        },

        handleAddToCartSuccess: function (response) {
            if ($(response.quickOrderErrorData).length > 0) {
                ACC.quickorder.disableBeforeUnloadEvent();
            }
            var lookup = {};
            response.quickOrderErrorData.forEach(function (el) {
                lookup[el.sku] = el.errorMsg;
            });

            $(ACC.quickorder.$qtyInputField).each(function () {
                var parentLi = ACC.quickorder.getCurrentParentLi(this);
                var sku = ACC.quickorder.findElement(parentLi, ACC.quickorder.$skuInputField).val();
                var errorMsg = lookup[sku];

                if (errorMsg) {
                    ACC.quickorder.findElement(parentLi, ACC.quickorder.$skuValidationContainer).text(errorMsg);
                }
                else {
                    ACC.quickorder.clearGivenQuickOrderRow(parentLi);
                }
            });

            ACC.quickorder.handleBeforeUnloadEvent();
            ACC.product.displayAddToCartPopup(response);
        },

        getJSONDataForAddToCart: function () {
            var skusAsJSON = [];
            $(ACC.quickorder.$qtyInputField).each(function () {
                var qty = Number($(this).val());
                if (qty > 0) {
                    var sku = jQuery.trim(ACC.quickorder.findElementInCurrentParentLi(this, ACC.quickorder.$skuInputField).val());
                    skusAsJSON.push({"product": {"code": sku}, "quantity": qty});
                }
            });
            return JSON.stringify({"cartEntries": skusAsJSON});
        },

        handleFocusOutOnSkuInput: function (event) {
            var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
            if (key == 13) {
                $(event.target).focusout();
            }
            if (event.type == "focusout") {
                ACC.quickorder.handleGetProduct(event);
                ACC.quickorder.handleBeforeUnloadEvent();
            }
        },

        handleFocusOutOnQtyInput: function (event) {
            var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
            if (key == 13) {    
                event.preventDefault();
                var parentLi = ACC.quickorder.getCurrentParentLi(event.target);             
                parentLi.next().find(ACC.quickorder.$skuInputField).focus();
                $(event.target).focusout();
            }
            if (event.type == "focusout") {
                ACC.quickorder.validateAndUpdateItemTotal(event);
                ACC.quickorder.enableDisableAddToCartBtn();
            }
        },

        clearForm: function () {
            window.location.reload();
        },

        validateAndUpdateItemTotal: function (event) {
            var parentLi = ACC.quickorder.getCurrentParentLi(event.target);
            var qtyValue = jQuery.trim(ACC.productorderform.filterSkuEntry($(event.target).val()));
            if (isNaN(qtyValue) || qtyValue == "") {
                qtyValue = 0;
                $(event.target).removeClass(ACC.quickorder.$classHasError);
                ACC.quickorder.findElement(parentLi, ACC.quickorder.$qtyValidationContainer).text('');
                $(event.target).val(0);
            }
            else {
                qtyValue = Number(qtyValue);
                $(event.target).val(qtyValue);
                var maxQty = jQuery.trim(ACC.quickorder.findElement(parentLi, ACC.quickorder.$qtyInputField).data('maxProductQty'));
                var stockLevelStatus = jQuery.trim(ACC.quickorder.findElement(parentLi, ACC.quickorder.$qtyInputField).data('stockLevelStatus'));
                maxQty = ($.isEmptyObject(maxQty) && stockLevelStatus == "inStock") ? "FORCE_IN_STOCK" : Number(maxQty);
                if (!isNaN(maxQty) && qtyValue > maxQty) {
                    $(event.target).addClass(ACC.quickorder.$classHasError);
                    var qtyValidationContainer = ACC.quickorder.findElement(parentLi, ACC.quickorder.$qtyValidationContainer);
                    qtyValidationContainer.text(qtyValidationContainer.data('maxProductQtyMsg'));
                    qtyValue = maxQty;
                    $(event.target).val(maxQty);
                }
                else {
                    $(event.target).removeClass(ACC.quickorder.$classHasError);
                    ACC.quickorder.findElement(parentLi, ACC.quickorder.$qtyValidationContainer).text('');
                }
            }

            if (qtyValue > 0) {
                var itemPrice = parseFloat(ACC.quickorder.findElement(parentLi, '.js-product-price').data('productPrice'));
                ACC.quickorder.findElement(parentLi, ACC.quickorder.$productItemTotal)
                    .html(ACC.productorderform.formatTotalsCurrency(itemPrice * qtyValue));
            }
            else {
                ACC.quickorder.findElement(parentLi, ACC.quickorder.$productItemTotal).text('');
            }
        },

        clearQuickOrderRow: function () {
            var parentLi = ACC.quickorder.getCurrentParentLi(this);
            ACC.quickorder.clearGivenQuickOrderRow(parentLi);
        },
        
        clearGivenQuickOrderRow: function (parentLi) {
            var quickOrderMinRows = ACC.quickorder.$quickOrderMinRows;
            if ($('.js-ul-container li.js-li-container').length > quickOrderMinRows) {
                parentLi.remove();
            }
            else {
                ACC.quickorder.findElement(parentLi, ACC.quickorder.$productInfoContainer).remove();
                ACC.quickorder.findElement(parentLi, ACC.quickorder.$skuValidationContainer).text('');
                ACC.quickorder.findElement(parentLi, ACC.quickorder.$skuInputField).val('');
                ACC.quickorder.findElement(parentLi, ACC.quickorder.$hiddenSkuInput).val('');
            }
            ACC.quickorder.enableDisableAddToCartBtn();
            ACC.quickorder.handleBeforeUnloadEvent();
        },

        addInputRow: function (event) {

            if ($('.js-quick-order-container li.js-li-container:last-child').find(ACC.quickorder.$skuInputField).is($(event.target)) &&
                $(ACC.quickorder.$jsLiContainer).length < ACC.quickorder.$quickOrderMaxRows) {
                var liClone = $('.js-quick-order-container li.js-li-container:first').clone();
                ACC.quickorder.findElement(liClone, ACC.quickorder.$productInfoContainer).remove();
                ACC.quickorder.findElement(liClone, ACC.quickorder.$skuValidationContainer).text('');
                ACC.quickorder.findElement(liClone, ACC.quickorder.$hiddenSkuInput).val('');
                var currentSkuInputField = ACC.quickorder.findElement(liClone, ACC.quickorder.$skuInputField);
                currentSkuInputField.val('');
                currentSkuInputField.focusin(ACC.quickorder.addInputRow).focusout(ACC.quickorder.handleFocusOutOnSkuInput).keydown(ACC.quickorder.handleFocusOutOnSkuInput);
                ACC.quickorder.findElement(liClone, ACC.quickorder.$removeQuickOrderRowBtn).click(ACC.quickorder.clearQuickOrderRow);
                $('.js-ul-container').append(liClone);
            }
        },

        handleGetProduct: function (event) {
            var parentLi = ACC.quickorder.getCurrentParentLi(event.target);
            var productCode = $.trim(event.target.value);
            $(event.target).val(productCode);
            if (!ACC.quickorder.isCurrentSkuSameAsPrevious(parentLi, productCode)) {
                if (productCode.length > 0) {
                    ACC.quickorder.findElement(parentLi, ACC.quickorder.$productInfoContainer).remove();

                    if (ACC.quickorder.isDuplicateSku(event.target, productCode)) {
                        ACC.quickorder.findElement(parentLi, ACC.quickorder.$skuValidationContainer).text(ACC.quickorder.$productExistsInFormMsg);
                    }
                    else {
                        ACC.quickorder.getAndDisplayProductInfo(event, parentLi, productCode);
                    }
                    ACC.quickorder.findElement(parentLi, ACC.quickorder.$hiddenSkuInput).val(productCode);
                }
                else {
                    $(event.target).removeClass(ACC.quickorder.$classHasError);
                    ACC.quickorder.findElement(parentLi, ACC.quickorder.$skuValidationContainer).text('');
                    ACC.quickorder.findElement(parentLi, ACC.quickorder.$productInfoContainer).remove();
                }
            }
        },

        isCurrentSkuSameAsPrevious: function (parentLi, productCode) {
            return ACC.quickorder.findElement(parentLi, ACC.quickorder.$hiddenSkuInput).val() == productCode;
        },

        isDuplicateSku: function (currentInput, productCode) {
            var exists = false;
            $(ACC.quickorder.$skuInputField).each(function () {
                if ($(this).val() == productCode && !$(this).is($(currentInput))) {
                    exists = true;
                    return false
                }
            });
            return exists;
        },

        getAndDisplayProductInfo: function (event, parentLi, productCode) {
            var url = ACC.config.encodedContextPath + '/quickOrder/productInfo?code=' + encodeURIComponent(productCode);
            $.getJSON(url, function (result) {
                if (result.errorMsg != null && result.errorMsg.length > 0) {
                    $(event.target).addClass(ACC.quickorder.$classHasError);
                    ACC.quickorder.findElement(parentLi, ACC.quickorder.$skuValidationContainer).text(result.errorMsg);
                }
                else {
                    $(event.target).removeClass(ACC.quickorder.$classHasError);
                    ACC.quickorder.findElement(parentLi, ACC.quickorder.$skuValidationContainer).text('');
                    $.tmpl(ACC.quickorder.$templateAlias, result.productData).insertAfter(ACC.quickorder.findElement(parentLi, '.js-sku-container'));
                    var qtyInputField = ACC.quickorder.findElement(parentLi, ACC.quickorder.$qtyInputField);
                    qtyInputField.focusout(ACC.quickorder.handleFocusOutOnQtyInput).keydown(ACC.quickorder.handleFocusOutOnQtyInput);
                    var stockLevelStatus = result.productData.stock.stockLevelStatus.code;
                    if (stockLevelStatus == "outOfStock") {
                        qtyInputField.val(0);
                        qtyInputField.prop('disabled', true);
                    }
                    else {
                        qtyInputField.focus().select();
                    }
                    ACC.quickorder.enableDisableAddToCartBtn();
                }
            });
        },

        handleBeforeUnloadEvent: function () {
            if (ACC.quickorder.isAnySkuPresent()) {
                ACC.quickorder.disableBeforeUnloadEvent();
                ACC.quickorder.enableBeforeUnloadEvent();
            }
            else {
                ACC.quickorder.disableBeforeUnloadEvent();
            }
        },

        disableBeforeUnloadEvent: function () {
            $(window).off('beforeunload', ACC.quickorder.beforeUnloadHandler);
        },

        enableBeforeUnloadEvent: function () {
            $(window).on('beforeunload', ACC.quickorder.beforeUnloadHandler);
        },

        beforeUnloadHandler: function () {
            return ACC.quickorder.$quickOrderLeavePageMsg;
        },

        enableDisableAddToCartBtn: function () {
            var addToCartButtonEnabled = ACC.quickorder.shouldAddToCartBeEnabled();

            // if there are no items to add, disable addToCartBtn, otherwise, enable it
            if (addToCartButtonEnabled) {
                ACC.quickorder.$addToCartBtn.removeAttr('disabled');
            } else {
                ACC.quickorder.$addToCartBtn.attr('disabled', 'disabled');
            }
        },

        shouldAddToCartBeEnabled: function () {
            var sum = 0;
            var enable = false;
            $(ACC.quickorder.$qtyInputField).each(function () {
                var str = this.value.trim();  // .trim() may need a shim
                if (str) {   // don't send blank values to `parseInt`
                    sum += parseInt(str, 10);
                }
                if (sum >= 1) {
                    enable = true;
                    return false;
                }
            });
            return enable;
        },

        isAnySkuPresent: function () {
            var present = false;
            $(ACC.quickorder.$skuInputField).each(function () {
                var str = jQuery.trim(this.value);  // .trim() may need a shim
                if (str) {
                    present = true;
                    return false;
                }
            });
            return present;
        },

        getCurrentParentLi: function (currentElement) {
            return $(currentElement).closest(ACC.quickorder.$jsLiContainer);
        },

        findElement: function (currentElement, toFind) {
            return $(currentElement).find(toFind);
        },

        findElementInCurrentParentLi: function (currentElement, toFind) {
            return $(currentElement).closest(ACC.quickorder.$jsLiContainer).find(toFind);
        }
    };
}
