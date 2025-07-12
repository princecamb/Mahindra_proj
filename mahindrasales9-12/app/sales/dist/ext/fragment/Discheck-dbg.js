sap.ui.define([
    "sap/m/MessageToast",
     "sap/m/MessageBox"
], function(MessageToast,MessageBox) {
    'use strict'
    // var value;
    return {
        formatter: {
            formatText: function (sDiscount, isChecked) {
                debugger
                console.log('Discount:', sDiscount, 'isChecked:', isChecked);
                if (sDiscount?.includes('%')) return true;
                else if (isChecked) return true;
                return false;
            },
        },
        onCheckBoxSelect: function(oEvent) {
            debugger
            var form = this._view.mAggregations.content[0].mAggregations.sections[3].mAggregations._grid.mAggregations.content[1].mAggregations._grid.mAggregations.content[0].mAggregations.content.mAggregations.items;
					
            let oParent = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getParent().getBindingContext();
            let discountedPrice;
            let totalPrice;
            const isPercentage = oEvent.getSource().getSelected();
            const oBindingContext = oEvent.getSource().getBindingContext(); 
            const disc = oBindingContext.getProperty("mDiscount");
            const discount = disc.includes('%') ? parseFloat(disc.slice(0,-1)) : parseFloat(disc) || 0;
            const actualPrice = parseFloat(oBindingContext.getProperty("actualPrice"));
            const tax = parseInt(oBindingContext.getProperty("taxPercentage"));
            const match = oBindingContext.getProperty("band")?.match(/\(([\d.]+)%\)/);
            let band = match?.[1] ? parseFloat(match[1]) : 0;

            if(isPercentage && discount + band >= 100) {
                sap.m.MessageToast.show("Discount percentage cannot exceed 100.");
                oEvent.getSource().setSelected(false);
                return;
            }

            oBindingContext.setProperty("isChecked", isPercentage);
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

            debugger
            let totalprice = 0;
            let totaltax = 0;
            let grandtotal = 0;
            debugger
            var vdata = oEvent.getSource().getParent().getParent().getParent().getRows()
            for (const vehicle of vdata) {
                debugger
                const cells = vehicle.getCells ? vehicle.getCells() : vehicle.getAggregation("content");
					//cells.forEach((cell) => {
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
            
            // oParent.setProperty("totalAmount", totalprice.toFixed(2).toString());
            // oParent.setProperty("taxAmount", totaltax.toFixed(2).toString());
            // oParent.setProperty("grandTotal", grandtotal.toFixed(2).toString());
                    form[0].mAggregations.items[1].setText(totalprice.toFixed(2).toString());
					form[1].mAggregations.items[1].setText(totaltax.toFixed(2).toString());
					form[2].mAggregations.items[1].setText(grandtotal.toFixed(2).toString());

            if(disc === "" || disc === "0") {
                oBindingContext.setProperty("mDiscount", disc);
                return;
            }
            if(isPercentage && !disc.includes('%')){
                oBindingContext.setProperty("mDiscount", `${disc}%`);
            } else if(!isPercentage && disc.includes('%')){
                oBindingContext.setProperty("mDiscount", disc.slice(0,-1));
            }

            // setTimeout(() => {
            //     //oParent.refresh();
            // }, 1000);
        }
    };
});
