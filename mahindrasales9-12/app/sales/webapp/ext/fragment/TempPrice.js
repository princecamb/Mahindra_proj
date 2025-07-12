sap.ui.define([], function() {
    'use strict';

    return {
        formatter: {
            formatDiscountedPrice: function (sDiscount, sBand, actualPrice) {
                debugger
                var discountedPrice = 0;
                const match = sBand?.match(/\(([\d.]+)%\)/);
                let band = match?.[1] ? parseFloat(match[1]) : 0;

                if (sDiscount && sDiscount.includes('%')) {
                    const discount = parseFloat(sDiscount.replace("%", ""));
                    var dis = discount + band;
                    discountedPrice = parseFloat(actualPrice) * ( (100 - dis) / 100);
                } else {
                    const discount = parseFloat(sDiscount) || 0;
                    var bandDiscount = parseFloat(actualPrice) * ( (100 - band) / 100);
                    discountedPrice =  bandDiscount - discount;
                }
                discountedPrice = discountedPrice.toFixed(2).toString();
                return discountedPrice;
            },
            formatTotalPrice: function (sDiscount, sBand, actualPrice, taxPercentage) {
                debugger
                var discountedPrice = 0;
                const match = sBand?.match(/\(([\d.]+)%\)/);
                let band = match?.[1] ? parseFloat(match[1]) : 0;

                if (sDiscount && sDiscount.includes('%')) {
                    const discount = parseFloat(sDiscount.replace("%", ""));
                    var dis = discount + band;
                    discountedPrice = parseFloat(actualPrice) * ( (100 - dis) / 100);
                } else {
                    const discount = parseFloat(sDiscount) || 0;
                    var bandDiscount = parseFloat(actualPrice) * ( (100 - band) / 100);
                    discountedPrice =  bandDiscount - discount;
                }
                var totalPrice = discountedPrice + (discountedPrice * ( parseFloat(taxPercentage) / 100));
                totalPrice = totalPrice.toFixed(2).toString();
                return totalPrice;
            }
        }
    }
});