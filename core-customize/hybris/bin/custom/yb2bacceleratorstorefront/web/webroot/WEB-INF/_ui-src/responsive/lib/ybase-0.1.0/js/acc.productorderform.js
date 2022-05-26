ACC.productorderform = {

    _autoload: [
        "headerActions",
        "coreTableActions",
        "addToCartOrderGridForm"
    ],

    $addToCartOrderForm: $("#AddToCartOrderForm"),
    $addToCartBtn: $('#addToCartBtn'),
    $omsErrorMessageContainer: $("#globalMessages"),
    $emptySkuQuantityInputs: $(".sku-quantity[value]"),
    $nonEmptySkuQuantityInputs: $(".sku-quantity[value]"),
    $totalGridValues: $("[data-grid-total-id]"),

    // Templates
    $futureTooltipTemplate: $("#future-stock-template"),
    $futureTooltipErrorTemplate: $("#future-tooltip-error-template"),
    $omsErrorMessageTemplate: $("#oms-error-message-template"),
    $variantSummaryTemplate: $("#variant-summary"),
    selectedVariantData: 'selected-variant',
    selectedVariants: [],
    quantityTotal: 0,
    scrollTopPos: 0,

    headerActions: function () {
        ACC.productorderform.bindProductDetailToggle($(".product-details-toggle"));
    },

    coreTableActions: function () {
        ACC.productorderform.coreTableScrollActions(ACC.productorderform.$addToCartOrderForm);
        ACC.productorderform.bindUpdateFutureStockButton(".update_future_stock_button");
        ACC.productorderform.bindHideFutureStockInfo(".hide_future_stock_info");
        ACC.productorderform.bindVariantSelect($(".variant-select-btn"),'AddToCartOrderForm');
        ACC.productorderform.cancelVariantModal(".closeVariantModal");
        ACC.productorderform.checkLimitExceed(".sku-quantity");
        var skuQuantityClass = '.sku-quantity';
        var skuVariantQuantityClass = '#cboxContent .sku-quantity';

        var quantityBefore = 0;
        var quantityAfter = 0;


        ACC.productorderform.$addToCartOrderForm.on('click', skuQuantityClass, function (event) {
            $(this).select();
        });

        ACC.productorderform.$addToCartOrderForm.on('focusin', skuQuantityClass, function (event) {
            quantityBefore = jQuery.trim(this.value);

            //reset
            $(this).parents('tr').next('.variant-summary').remove();
            if($(this).parents('table').data(ACC.productorderform.selectedVariantData)){
                ACC.productorderform.selectedVariants = $(this).parents('table').data(ACC.productorderform.selectedVariantData);
            } else {
                ACC.productorderform.selectedVariants = [];
            }

            if (quantityBefore == "") {
                quantityBefore = 0;
                this.value = 0;
            }
        });

        $(document).find(skuQuantityClass).on('blur keypress', function (event) {
            var code = event.keyCode || event.which || event.charCode;

            if (code != 13 && code != undefined) {
                return;
            }

            var indexPattern = "[0-9]+";
            var currentIndex = parseInt($(this).attr("id").match(indexPattern));
            var totalPrice = 0;
            var _this = this;
            var currentPrice = $(document).find("input[id='productPrice[" + currentIndex + "]']").val();
            this.value = ACC.productorderform.filterSkuEntry(this.value);
            var $currentTotalItems = $('.js-total-items-count');
            var currentTotalItemsValue = $currentTotalItems.html();
            var currentTotalPrice = $('.js-total-price-value').val();
            var $gridGroup = $(this).parents('.orderForm_grid_group');

            if (isNaN(jQuery.trim(this.value))) {
                this.value = 0;
            }

            quantityAfter = jQuery.trim(this.value);
            if (quantityAfter == "") {
                quantityAfter = 0;
                this.value = 0;
            }

            //If order forms advanced search enabled
            if(ACC.orderform) {
                if(sessionStorage.totalItems !== undefined && sessionStorage.totalPriceVal !== undefined) {
                    currentTotalItemsValue = sessionStorage.totalItems;
                    currentTotalPrice = sessionStorage.totalPriceVal;
                }

                if (quantityBefore == 0) {
                    $currentTotalItems.html(parseInt(currentTotalItemsValue) + parseInt(quantityAfter));
                    totalPrice = parseFloat(currentTotalPrice) + parseFloat(currentPrice) * parseInt(quantityAfter);
                } else {
                    $currentTotalItems.html(parseInt(currentTotalItemsValue) + (parseInt(quantityAfter) - parseInt(quantityBefore)));
                    totalPrice = parseFloat(currentTotalPrice) + parseFloat(currentPrice) * (parseInt(quantityAfter) - parseInt(quantityBefore));
                }

                sessionStorage.totalPrice = ACC.productorderform.formatTotalsCurrency(totalPrice);
                sessionStorage.totalItems = $currentTotalItems.html() ;
                sessionStorage.totalPriceVal = totalPrice;

                ACC.orderform.addToSkuQtyInput(_this);

            } else if($gridGroup && $gridGroup.length >0) {
                var $closestQuantityValue = $gridGroup.find('#quantityValue');
                var $closestAvgPriceValue = $gridGroup.find('#avgPriceValue');
                var $closestSubtotalValue = $gridGroup.find('#subtotalValue');
                var currentQuantityValue = $closestQuantityValue.val();
                var currentSubtotalValue = $closestSubtotalValue.val();

                if (quantityBefore == 0) {
                    $closestQuantityValue.val(parseInt(currentQuantityValue) + parseInt(quantityAfter));
                    $closestSubtotalValue.val(parseFloat(currentSubtotalValue) + parseFloat(currentPrice) * parseInt(quantityAfter));

                    $currentTotalItems.html(parseInt(currentTotalItemsValue) + parseInt(quantityAfter));
                    totalPrice = parseFloat(currentTotalPrice) + parseFloat(currentPrice) * parseInt(quantityAfter);
                } else {
                    $closestQuantityValue.val(parseInt(currentQuantityValue) + (parseInt(quantityAfter) - parseInt(quantityBefore)));
                    $closestSubtotalValue.val(parseFloat(currentSubtotalValue) + parseFloat(currentPrice) * (parseInt(quantityAfter) - parseInt(quantityBefore)));

                    $currentTotalItems.html(parseInt(currentTotalItemsValue) + (parseInt(quantityAfter) - parseInt(quantityBefore)));
                    totalPrice = parseFloat(currentTotalPrice) + parseFloat(currentPrice) * (parseInt(quantityAfter) - parseInt(quantityBefore));
                }

                ACC.productorderform.enableBeforeUnloadEvent(quantityAfter,$currentTotalItems.text());

                // if there are no items to add, disable addToCartBtn, otherwise, enable it
                if ($currentTotalItems.length != 0 && $currentTotalItems.text() == 0) {
                    ACC.productorderform.$addToCartBtn.attr('disabled', 'disabled');
                    $(window).off('beforeunload', ACC.productorderform.beforeUnloadHandler);
                } else {
                    ACC.productorderform.$addToCartBtn.removeAttr('disabled');
                }

                if (parseInt($closestQuantityValue.val()) > 0) {
                    $closestAvgPriceValue.val(parseFloat($closestSubtotalValue.val()) / parseInt($closestQuantityValue.val()));
                } else {
                    $closestAvgPriceValue.val(0);
                }
            }

            if($gridGroup && $gridGroup.length >0)
            {
                var gridLevelTotalPrice = "";
                var $gridTotalValue = $gridGroup.find("[data-grid-total-id=" + 'total_value_' + currentIndex + "]");

                if (quantityAfter > 0) {
                    gridLevelTotalPrice =ACC.productorderform.formatTotalsCurrency(parseFloat(currentPrice) * parseInt(quantityAfter));
                }
                $gridTotalValue.html(gridLevelTotalPrice);
                ACC.productorderform.updateSelectedVariantGridTotal(this,quantityBefore,false,false);
            }

            $('.js-total-price').html(ACC.productorderform.formatTotalsCurrency(totalPrice));
            $('.js-total-price-value').val(totalPrice);
        });

        // MOBILE
        $('body').on('focusin', skuVariantQuantityClass, function () {
            quantityBefore = jQuery.trim(this.value);

            var currentVariantId = $(this).data('variant-id');
            var currentBaseInput = $("#AddToCartOrderForm, #cartOrderGridForm").find("[data-variant-id='" + currentVariantId + "']");
            currentBaseInput.trigger('focusin');

            currentBaseInput.parents('table').find('.variant-summary').remove();
            if(currentBaseInput.parents('table').data(ACC.productorderform.selectedVariantData)){
                ACC.productorderform.selectedVariants = currentBaseInput.parents('table').data(ACC.productorderform.selectedVariantData);
            } else {
                ACC.productorderform.selectedVariants = [];
            }

            if (quantityBefore == "") {
                quantityBefore = 0;
                this.value = 0;
            }
        });

        $('body').on('blur', skuVariantQuantityClass, function () {
            var priceSibling = $(this).siblings('.price');
            var totalSibling = $(this).siblings('.data-grid-total');
            var currentVariantId = $(this).data('variant-id');
            var currentBaseInput = $("#AddToCartOrderForm, #cartOrderGridForm").find("[data-variant-id='" + currentVariantId + "']");
            this.value = ACC.productorderform.filterSkuEntry(this.value);

            // no text allowed || no negative number allowed || no empty string
            if (isNaN(jQuery.trim(this.value)) || this.value < 0 || this.value == "") {
                this.value = 0;
            }

            // set current value also to hidden input field (baseTable), because its the base of all further interaction
            currentBaseInput.val(this.value);
            currentBaseInput.trigger('blur');
            ACC.productorderform.updateVariantTotal(priceSibling, this.value, totalSibling);

            // if there are no items to add, disable addToCartBtn, otherwise, enable it
            if (this.value > 0 && this.value != quantityBefore) {
                currentBaseInput.parents('table').addClass('selected');
                currentBaseInput.trigger('change');
            } else {
                if (ACC.productorderform.selectedVariants.length === 0) {
                    currentBaseInput.parents('table').removeClass('selected');
                }
            }
        });
    },

    // MOBILE
    updateSelectedVariantGridTotal: function(_this,quantityBefore,isFillQty,resetSummary){
        var priceSibling = $(_this).siblings('.price');
        var propSibling = $(_this).siblings('.variant-prop');
        var currentSkuId = $(_this).next('.td_stock').data('sku-id');
        var currentBaseTotal = $(_this).siblings('.data-grid-total');

        if(isFillQty) {
            ACC.productorderform.selectedVariants = [];
        }

         if (_this.value != quantityBefore) {
            var newVariant = true;
            ACC.productorderform.selectedVariants.forEach(function(item, index) {
                if(item.id === currentSkuId){
                    newVariant = false;
                    if(_this.value === '0' || _this.value === 0){
                        ACC.productorderform.selectedVariants.splice(index, 1);
                    } else {
                        ACC.productorderform.selectedVariants[index].quantity = _this.value;
                        ACC.productorderform.selectedVariants[index].total = ACC.productorderform.updateVariantTotal(priceSibling, _this.value, currentBaseTotal);
                    }
                }
            });

            if(newVariant && _this.value > 0){
                // update variantData
                ACC.productorderform.selectedVariants.push({
                    id: currentSkuId,
                    size: propSibling.data('variant-prop'),
                    quantity: _this.value,
                    total: ACC.productorderform.updateVariantTotal(priceSibling, _this.value,  currentBaseTotal)
                });
            }
        }

        if(resetSummary){
            $(_this).parents('table').find('.variant-summary').remove();
        }

        ACC.productorderform.showSelectedVariant($(_this).parents('table'));

        if (_this.value > 0 && _this.value != quantityBefore) {
            $(_this).parents('table').addClass('selected');
        } else {
            if (ACC.productorderform.selectedVariants.length === 0) {
                $(_this).parents('table').removeClass('selected').find('.variant-summary').remove();
            }
        }

    },

    updateVariantTotal: function (priceSibling, quantity, totalElement) {
        var variantTotal = parseFloat(priceSibling.data('variant-price')) * parseInt(quantity);
        // set total in modal and baseVariant
        totalElement.html(ACC.productorderform.formatTotalsCurrency(variantTotal));

        return ACC.productorderform.formatTotalsCurrency(variantTotal);
    },

    bindUpdateFutureStockButton: function (updateFutureStockButton) {
        $('body').on('click', updateFutureStockButton,function (event) {
            event.preventDefault();

            var $gridContainer = $(this).parents('.orderForm_grid_group').find(".product-grid-container");
            var $skus = jQuery.map($gridContainer.find("input[type='hidden'].sku"), function (o) {
                return o.value
            });
            var skusId = $(this).data('skusId');
            var futureStockUrl = $(this).data('skusFutureStockUrl');
            var postData = {skus: $skus, productCode: skusId};
            var hideFutureStockInfo =  $(this).parent().find(".hide_future_stock_info");
            var showFutureStockLink = $(this);

            $.ajax({
                url: futureStockUrl,
                type: 'POST',
                data: postData,
                traditional: true,
                dataType: 'json',
                success: function (data) {
                    ACC.productorderform.updateFuture($gridContainer, $skus, data, skusId, showFutureStockLink , hideFutureStockInfo);
                },
                error: function (xht, textStatus, ex) {
                    console.log(`Failed to get delivery modes. Error details [${xht}, ${textStatus}, ${ex}]`);
                }
            });
        });
    },

    bindHideFutureStockInfo: function (hideFutureStockInfoLink) {
        $('body').on('click', hideFutureStockInfoLink, function (event) {
            event.preventDefault();
            var gridContainer = $(this).parent().parent().find(".product-grid-container");
            var updateFutureStockInfo =  $(this).parent().find(".update_future_stock_button");
            updateFutureStockInfo.show();
            $(this).hide();
            var cell = gridContainer.find("[data-sku-id]");
            cell.children(".future_stock, .out-of-stock").remove();
        });
    },

    updateFuture: function (gridContainer, skus, freshData, callerId, showFutureStockInfoLink ,hideFutureStockInfo) {
        // clear prior error messages
        ACC.productorderform.$omsErrorMessageContainer.find("div").remove();

        function isEmpty(obj) {
            return (Object.keys(obj).length <= 0);
        }

        if (freshData !== null && typeof freshData['basket.page.viewFuture.unavailable'] !== 'undefined') {
            // future stock service is not available
            $.tmpl(ACC.productorderform.$omsErrorMessageTemplate, {
                errorMessage: freshData['basket.page.viewFuture.unavailable']
            }).appendTo(ACC.productorderform.$omsErrorMessageContainer);
        }
        else {
            if(!isEmpty(freshData)) {
                showFutureStockInfoLink.hide();
                hideFutureStockInfo.css( "display", "block");
                $.each(skus, function (index, skuId) {
                    var stocks = freshData[skuId];

                    var cell = gridContainer.find("[data-sku-id='" + skuId + "']");
                    var isCurrentlyInStock = cell[0].attributes['class'].nodeValue.indexOf("in-stock") != -1;
                    var futureStockPresent = typeof stocks !== 'undefined' && stocks !== null && stocks[0] !== null && typeof stocks[0] !== 'undefined';

                    cell.children(".future_stock, .out-of-stock").remove(); // remove previous tool tips

                    if (futureStockPresent) {
                        // we have stock for this product
                        if (!isCurrentlyInStock) {
                            cell.addClass("future-stock");
                        }

                        // render template and append to cell
                        $.tmpl(ACC.productorderform.$futureTooltipTemplate, {
                            formattedDate: stocks[0].formattedDate,
                            availabilities: stocks
                        }).appendTo(cell);

                    } else {
                        // no future stock for this product
                        if (!isCurrentlyInStock) {
                            cell[0].attributes['class'].nodeValue = "td_stock out-of-stock";
                        }
                    }
                });
            }

        }
    },

    toJSON: function (gridForm, skipZeroQuantity) {
        var skus = gridForm.find("input.sku").map(function (index, element) {
                return element.value
            }),
            skuQuantities = gridForm.find("input.sku-quantity").map(function (index, element) {
                return parseInt(element.value)
            }),
            skusAsJSON = [];

        for (var i = 0; i < skus.length; i++) {
            if (!(skipZeroQuantity && skuQuantities[i] === 0)) {
                skusAsJSON.push({"product": {"code": skus[i]}, "quantity": skuQuantities[i]});
            }
        }

        return JSON.stringify({"cartEntries": skusAsJSON});
    },

    formatTotalsCurrency: function (amount) {
        return Currency.formatMoney(Number(amount).toFixed(2), Currency.money_format[ACC.common.currentCurrency]);
    },

    cleanValues: function () {
        if ($(".orderForm_grid_group").length !== 0) {
            var formattedTotal = ACC.productorderform.formatTotalsCurrency('0.00');

            $('.js-total-price').html(formattedTotal);
            $('#quantity, .js-total-items-count').html(0);
            $('#quantityValue, #avgPriceValue, #subtotalValue, .js-total-price-value').val(0);
            ACC.productorderform.$emptySkuQuantityInputs.val(0);
            ACC.productorderform.$totalGridValues.html("");
        }
    },

    calculateGrid: function () {
        ACC.productorderform.$nonEmptySkuQuantityInputs.trigger('focusout');
    },

    bindProductDetailToggle: function (productDetailToggle) {
        productDetailToggle.on("click", function (event) {
            event.preventDefault();

            $(this).parents('.product-details').toggleClass('open');
        });
    },

    showSelectedVariant: function (currentVariant) {
        // render template and append to table
        $.tmpl(ACC.productorderform.$variantSummaryTemplate, {
            variants: ACC.productorderform.selectedVariants
        }).appendTo(currentVariant);
        // save selectedVariantData
        $('.variant-summary .variant-property').text($('.variant-detail').data('variant-property'));
        currentVariant.data(ACC.productorderform.selectedVariantData, ACC.productorderform.selectedVariants);
        currentVariant.removeClass('currentVariant');
    },

    bindVariantSelect: function (variantSelectBtn,parentId) {
        variantSelectBtn.on("click", function (event) {
            event.preventDefault();
            var currentVariant = $(this).parents('table');

            // reset
            if(currentVariant.data(ACC.productorderform.selectedVariantData)){
                ACC.productorderform.selectedVariants = currentVariant.data(ACC.productorderform.selectedVariantData);
            } else {
                ACC.productorderform.selectedVariants = [];
            }

            var titleHeader = variantSelectBtn.html();
            var tableWrap = $(document).find('#'+parentId).clone().empty().attr('id', ACC.common.encodeHtml(parentId) + 'Variant');

            currentVariant.addClass('currentVariant');
            var popupContent = $(this).parents('.orderForm_grid_group').clone();
            currentVariant.removeClass('currentVariant');
            $(popupContent).find('.currentVariant').siblings().remove();
            tableWrap.html(popupContent);
            tableWrap.find('.hidden-xs').removeClass('hidden-xs');
            tableWrap.find('.hide').removeClass('hide');
            scrollTopPos = $('body').scrollTop();
            $('body').scrollTop(0);

            ACC.colorbox.open(titleHeader, {
                html: tableWrap,
                width:"100%",
                reposition: false,
                className: 'variantSelectMobile',
                onCleanup : function() {
                    if(ACC.productorderform.$addToCartOrderForm.find('.selected').length > 0) {
                        ACC.productorderform.$addToCartBtn.removeAttr('disabled');
                    } else {
                        ACC.productorderform.$addToCartBtn.attr('disabled', 'disabled');
                    }
                    $('body').scrollTop(scrollTopPos);
                }
            });
        });
    },

    cancelVariantModal: function (closeVariantModal) {
        $('body').on('click', closeVariantModal, function (event) {
            event.preventDefault();
            ACC.colorbox.close();
        });
    },
    checkLimitExceed: function (closeVariantModal1) {
        $('body').on('keyup blur', closeVariantModal1, function (event) {  	
        	 var input=Number($(this).val());
             var stock_amt=Number($(this).attr('data-instock'));     
             if(input>stock_amt)
             	$(this).val(stock_amt);
        });
    },

    resetSelectedVariant: function () {
        // Reset all the selectedVariant data
        ACC.productorderform.selectedVariants = [];
        $('.product-grid-container table').removeData(ACC.productorderform.selectedVariantData)
            .removeClass('selected')
            .removeClass('currentVariant');
    },

    addToCartOrderGridForm: function addToCartOrderGridForm() {
        // Prevent accidentally submitting the form by hitting the Enter key.
        $("#AddToCartOrderForm").keypress(
            function(event){
                if (event.which == '13') {
                event.preventDefault();
            }
        });

        ACC.productorderform.$addToCartBtn.click(function () {
            ACC.productorderform.$addToCartBtn.attr('disabled', 'disabled');

            $.ajax({
                url:  ACC.productorderform.$addToCartOrderForm.attr("action"),
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: ACC.productorderform.toJSON( ACC.productorderform.$addToCartOrderForm, true),
                async: false,
                success: function (response) {
                    $(window).off('beforeunload', ACC.productorderform.beforeUnloadHandler);
                    ACC.product.displayAddToCartPopup(response);
                    ACC.productorderform.cleanValues();
                    ACC.productorderform.resetSelectedVariant();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // log the error to the console
                    console.log("The following error occured: " + textStatus, errorThrown);
                }
            });
        });
    },

    beforeUnloadHandler: function() {
        return  ACC.productorderform.$addToCartOrderForm.attr('data-grid-confirm-message');
    },

    enableBeforeUnloadEvent: function(quantityAfter,currentTotalItems) {
        if(!ACC.orderform)
        {
            if(quantityAfter > 0 &&  currentTotalItems > 0)
            {
                $(window).off('beforeunload', ACC.productorderform.beforeUnloadHandler)
                    .on('beforeunload', ACC.productorderform.beforeUnloadHandler);
            }
        }
    },

    filterSkuEntry: function(quantityInput){
        var filteredQty = 0;
        if (/\D/g.test(quantityInput)) {
            // Filter non-digits from input value.
            filteredQty = quantityInput.replace(/\D/g, '');
        }
        else
        {
            filteredQty = quantityInput;
        }
        return filteredQty;
    },

    // Order form scroll
    coreTableScrollActions: function ($scrollContent) {
        if ($scrollContent.hasClass('visible')) {
            ACC.productorderform.orderGridScroll($scrollContent);
            var scrollRight = $scrollContent.parent().find('.order-form-scroll.right'),
                scrollLeft = $scrollContent.parent().find('.order-form-scroll.left'),
                scrollUp = $scrollContent.parent().find('.order-form-scroll.up'),
                scrollDown = $scrollContent.parent().find('.order-form-scroll.down');
            var widthReference = $scrollContent.find('.widthReference').outerWidth(),
                heightReference = $scrollContent.find('.product-grid-container table').eq(0).height() /2;// devided by 2 otherwise no nice behaviour
            var maxWidth = 0,
                maxHeight = 0;
            var widthDiff = 0,
                heightDiff = 0;

            $scrollContent.find('.product-grid-container table').each(function(){
                if($(this).outerWidth() > maxWidth){
                    maxWidth = $(this).outerWidth();
                }
            });
            $scrollContent.find('.orderForm_grid_group').each(function(){
                maxHeight += $(this).height();
            });

            widthDiff = maxWidth - $scrollContent.outerWidth();//scroll-offset
            heightDiff = maxHeight - $scrollContent.height() + 14;//scroll-offset

            $scrollContent.scroll(function(){
                if($(this).scrollLeft() > 0) {
                    scrollLeft.show();
                } else {
                    scrollLeft.hide();
                }

                if($(this).scrollLeft() >= widthDiff) {
                    scrollRight.hide();
                } else {
                    scrollRight.show();
                }

                if($(this).scrollTop() > 0) {
                    scrollUp.show();
                } else {
                    scrollUp.hide();
                }

                if($(this).scrollTop() >= heightDiff) {
                    scrollDown.hide();
                } else {
                    scrollDown.show();
                }

                $scrollContent.find('.update-future-stock').css('margin-right', -$(this).scrollLeft());
            });

            $scrollContent.parent().find('.order-form-scroll').click(function () {
                var pos = { left: $scrollContent.scrollLeft(),
                    top: $scrollContent.scrollTop() };

                if($(this).hasClass('right')) {
                    $scrollContent.scrollLeft(pos.left + widthReference);
                }
                else if($(this).hasClass('left')) {
                    $scrollContent.scrollLeft(pos.left - widthReference);
                }
                else if($(this).hasClass('up')) {
                    $scrollContent.scrollTop(pos.top - heightReference);
                }
                else {
                    $scrollContent.scrollTop(pos.top + heightReference);
                }
            });
        }
    },

    orderGridScroll: function (scrollContent) {
        var showRight = false;
        var calcHeight = 0;
        var maxWidth = $(scrollContent).find('.orderForm_grid_group').innerWidth();
        var maxHeight = $(scrollContent).innerHeight() - 18;

        $(scrollContent).find('.product-grid-container table').each(function () {
            if ($(this).width() > maxWidth) {
                showRight = true;
            }
            calcHeight += $(this).height();
        });

        if (showRight) {
            $(scrollContent).parent().find('.order-form-scroll.right').show();
        }

        if (calcHeight > maxHeight) {
            $(scrollContent).parent().find('.order-form-scroll.down').show();
        }
    },

    calculateVariantTotal:function(_this,quantityToAdd){
        var $gridGroup = _this.parents('.orderForm_grid_group');
        var indexPattern = "[0-9]+";
        var currentIndex = parseInt(_this.attr("id").match(indexPattern));
        var currentPrice = $(document).find("input[id='productPrice[" + currentIndex + "]']").val();
        var $gridTotalValue = $gridGroup.find("[data-grid-total-id=" + 'total_value_' + currentIndex + "]");
        if(quantityToAdd > 0)
            $gridTotalValue.html(ACC.productorderform.formatTotalsCurrency(parseFloat(currentPrice) * parseInt(quantityToAdd)));
    }
};
