sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        onPress: function(oEvent) {
            debugger
            let discountedPrice;
            let totalPrice;
            const disc = oEvent.getParameter("value");
            const discount = parseInt(disc);
            const oBindingContext = oEvent.getSource().getBindingContext(); 
            const actualPrice = parseFloat(oBindingContext.getProperty("actualPrice"));
            const tax = parseInt(oBindingContext.getProperty("taxPercentage"));
            const isPercentage = oBindingContext.getProperty("isChecked");
            const match = oBindingContext.getProperty("band")?.match(/\(([\d.]+)%\)/);
            let band = match?.[1] ? parseFloat(match[1]) : 0;

            if( band > 0 ){
                if(discount > 0 && isPercentage) band = band + discount;
                discountedPrice = actualPrice * ( (100 - band) / 100);
                if(discount > 0 && !isPercentage ) discountedPrice = discountedPrice - discount;   
            } else if(discount > 0 && isPercentage) {
                discountedPrice = actualPrice * ( (100 - discount) / 100);
            } else if(discount > 0 && !isPercentage) {
                discountedPrice = actualPrice - discount;
            }
            
            totalPrice = discountedPrice + (discountedPrice * ( tax / 100));
            oBindingContext.setProperty("discountedPrice", discountedPrice.toString());
            oBindingContext.setProperty("totalPrice", totalPrice.toString());
            // oEvent.oSource.oParent.oParent.mAggregations.cells[12].setValue(totalPrice.toString())
            // oEvent.oSource.oParent.oParent.mAggregations.cells[10].setValue(discountedPrice.toString())

            if(isPercentage){
                oBindingContext.setProperty("mDiscount", `${disc}%`);
            } else if(!isPercentage ){
                oBindingContext.setProperty("mDiscount", disc);
            }

        },
        formatter: {
            formatText: function (sValue) {
                if (sValue?.includes('%')) {
                    return sValue.slice(0,-1);
                }
                return sValue;
            }
        },
        validateDiscount :async function(oEvent) {
            const input = oEvent.getSource();
            let value = input.getValue();

            // value = value.replace(/^0+(?=[1-9])/, ''); 
            // input.setValue(value);
            // if (/^0+\d+/.test(value) && !value.startsWith("0.")) {
            //     value = value.replace(/^0+/, "");
            //     input.setValue(value);
            // }

            if (/^0+(?=[1-9])/.test(value) || (/^0+\d+/.test(value) && !value.startsWith("0."))) {
                value = value.replace(/^0+/, ""); 
                input.setValue(value);           
                return;                          
            }

            if (/[^0-9.]/.test(value) || (value.match(/\./g)?.length > 1) || (/^\d*\.\d{3,}$/).test(value)) {
                // Remove invalid characters
                value = value.replace(/[^0-9.]/g, '')   // Allow only digits and one decimal point
                             .replace(/(\..*?)\..*/g, '$1') // Keep only the first decimal point
                             .replace(/^(\d*\.\d{2}).*/, '$1'); // Limit to two decimal places
                input.setValue(value);
                sap.m.MessageToast.show("Please enter a valid number with up to 2 decimal places.");
                return;
            }

            // if (/[^0-9]/.test(value)) {
            //     value = value.replace(/[^0-9]/g, '');
            //     input.setValue(value);
            //     sap.m.MessageToast.show("Please enter only numbers.");
            //     return; 
            // }

            let discountedPrice;
            let totalPrice;
            let oParent = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getBindingContext();
            let disc = oEvent.getParameter("value");
            let discount = parseFloat(disc? disc : "0");
            const oBindingContext = oEvent.getSource().getBindingContext(); 
            const actualPrice = parseFloat(oBindingContext.getProperty("actualPrice"));
            const tax = parseFloat(oBindingContext.getProperty("taxPercentage"));
            const isPercentage = oBindingContext.getProperty("isChecked");
            const match = oBindingContext.getProperty("band")?.match(/\(([\d.]+)%\)/);
            let band = match?.[1] ? parseFloat(match[1]) : 0;
            let bandDiscount = actualPrice * (band / 100)

            let prev = oBindingContext.getProperty("mDiscount")
            prev = prev.includes('%') ? prev.slice(0,-1) : prev;

            if (isPercentage && discount + band >= 100) {
                input.setValue(prev);
                sap.m.MessageToast.show("The discount percentage cannot exceed 100.");
                return;
            }
            if (!isPercentage && discount + bandDiscount >= actualPrice) {
                input.setValue(prev);
                sap.m.MessageToast.show("Discount value cannot exceed Actual Price.");
                return;
            }
            
            if( band > 0 ){
                if(discount > 0 && isPercentage) band = band + discount;
                discountedPrice = actualPrice * ( (100 - band) / 100);
                if(discount > 0 && !isPercentage ) discountedPrice = discountedPrice - discount;   
            } else if(discount > 0 && isPercentage) {
                discountedPrice = actualPrice * ( (100 - discount) / 100);
            } else if(discount > 0 && !isPercentage) {
                discountedPrice = actualPrice - discount;
            } else {
                discountedPrice = actualPrice;
            }
            
            totalPrice = discountedPrice + (discountedPrice * ( tax / 100));
            oBindingContext.setProperty("discountedPrice", discountedPrice.toFixed(2).toString());
            oBindingContext.setProperty("totalPrice", totalPrice.toFixed(2).toString());
            // oEvent.oSource.oParent.oParent.mAggregations.cells[12].setValue(totalPrice.toString())
            // oEvent.oSource.oParent.oParent.mAggregations.cells[10].setValue(discountedPrice.toString())
            // disc = disc === "" ? "0" : disc;
            let totalprice = 0;
            let totaltax = 0;
            let grandtotal = 0;
            debugger
            var form = this._view.mAggregations.content[0].mAggregations.sections[3].mAggregations._grid.mAggregations.content[1].mAggregations._grid.mAggregations.content[0].mAggregations.content.mAggregations.items;
            var vdata = oEvent.getSource().getParent().getParent().getParent().getRows()
            for (const vehicle of vdata) {
                debugger
                const cells = vehicle.getCells ? vehicle.getCells() : vehicle.getAggregation("content");
						debugger
                        var actualamount = parseFloat(cells[5].getText());
                        var disprice = parseFloat(cells[9].getText());
                        var totalamount = parseFloat(cells[11].getText());
                        if(actualamount && disprice && totalamount){
                            totalprice = totalprice + disprice;
                            totaltax = totaltax + (totalamount - disprice);
                        }
            }  
            grandtotal = totalprice + totaltax;
        
            form[0].mAggregations.items[1].setText(totalprice.toFixed(2).toString());
			form[1].mAggregations.items[1].setText(totaltax.toFixed(2).toString());
			form[2].mAggregations.items[1].setText(grandtotal.toFixed(2).toString());

            if(disc === "" || disc === "0") {
                oBindingContext.setProperty("mDiscount", disc);
            } else if(isPercentage){
                oBindingContext.setProperty("mDiscount", `${disc}%`);
            } else if(!isPercentage ){
                oBindingContext.setProperty("mDiscount", disc);
            }

            setTimeout(() => {
                // oParent.refresh();
            }, 2000);
            

            // const currentUrl = window.location.href.match(/purchaseEnquiryUuid=([a-f0-9\-]+)/);
            // let peUuid = currentUrl?.[0];
            // let funcname = 'totalFun';
            // let peUuid = oParent.getProperty("purchaseEnquiryUuid");
            // let url = this._view.getModel().sServiceUrl + `totalFun(purchaseEnquiryUuid=${peUuid})`;
            // let oFunction = oEvent.getModel().bindContext(`/${funcname}(...)`);
            // oFunction.setParameter('purchaseEnquiryUuid', peUuid);
            // await oFunction.execute();
            // const result = oContext.getValue();
            // console.log(result);

        //     const result = await new Promise((resolve, reject) => {
		// 		jQuery.ajax({
		// 			url: url,
		// 			method: "GET",
		// 			dataType: "json",
		// 			success: function (data) {
		// 				resolve(data);
		// 			},
		// 			error: function (jqXHR, textStatus, errorThrown) {
		// 				reject(new Error(textStatus + ': ' + errorThrown));
		// 			}
		// 		});
		// 	});
        //     oParent.setProperty("totalAmount", result.value[0].toString())
        //     oParent.setProperty("taxAmount", result.value[1].toString())
        //     oParent.setProperty("grandTotal ", result.value[2].toString())
        //     console.log(result);
        }
    };
});
