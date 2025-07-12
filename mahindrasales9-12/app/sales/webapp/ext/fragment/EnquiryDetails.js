sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        onLoadVendor : async function (oEvent) {
            debugger
            const oBindingContext = oEvent.getSource().getBindingContext();
            const vendorCode = oBindingContext.getProperty("vendorCode");
            const oComboBox = oEvent.getSource();
            var aFilters = [
                new sap.ui.model.Filter("sHField", sap.ui.model.FilterOperator.EQ, "Vendor")
            ];
            oComboBox.bindAggregation("items", {
                path: "/SH",
                filters: aFilters,
                template: new sap.ui.core.Item({
                    key: "{sHDescription}",
                    text: "{sHDescription}"
                })
            });
        },
        oncompanyCodeChange: async function (oEvent) {
            debugger
            const oBindingContext = oEvent.getSource().getBindingContext();
            const vendorCode = oBindingContext.getProperty("vendorCode");
            const oComboBox = oEvent.getSource();
            var aFilters = [
    
                new sap.ui.model.Filter("sHDescription", sap.ui.model.FilterOperator.EQ, vendorCode)
            ];
    
            oComboBox.bindAggregation("items", {
                path: "/SH",
                filters: aFilters,
                template: new sap.ui.core.Item({
                    key: "{sHId2}",
                    text: "{sHId2}"
                })
            });
        },
        onpurchOrgChange: async function (oEvent) {
            debugger
            const oBindingContext = oEvent.getSource().getBindingContext();
            const vendorCode = oBindingContext.getProperty("vendorCode");
            const companyCode = oBindingContext.getProperty("companyCode");
            const oComboBox = oEvent.getSource();
            var aFilters = [
                new sap.ui.model.Filter("sHField", sap.ui.model.FilterOperator.EQ, "Purchase Group"),
            ];
    
            oComboBox.bindAggregation("items", {
                path: "/SH",
                filters: aFilters,
                template: new sap.ui.core.Item({
                    key: "{sHDescription}",
                    text: "{sHDescription}"
                })
            });
        },
        onSetProperty: async function (oEvent) {
            debugger
            const oBindingContext = oEvent.getSource().getBindingContext();
            // const parchaseOrg = oBindingContext.setProperty("purchOrg",'1000');
            const vendorCode = oBindingContext.getProperty("vendorCode");
            const companyCode = oEvent.getSource().getSelectedItem().getText();
            // var aFilters = [
            //     new sap.ui.model.Filter("sHDescription", sap.ui.model.FilterOperator.EQ, vendorCode),
            //     new sap.ui.model.Filter("sHId2", sap.ui.model.FilterOperator.EQ, companyCode)
            // ];

            // var data = {
            //     "state" : 'SP',
            //     "vendorCode" : vendorCode,
            //     "companyCode" : companyCode
            // } 
            // data = JSON.stringify(data);
            
            let oFunction = oEvent.getSource().getModel().bindContext(`/purchaseOrg(...)`);
			oFunction.setParameter('companyCode',companyCode).setParameter('vendorCode',vendorCode );
			await oFunction.execute();
            const oContext = oFunction.getBoundContext();            
            const result = oContext.getValue();
            oBindingContext.setProperty("purchOrg", String(result.value.sHId3));

            // return new Promise((resolve, reject) => {
			// 	jQuery.ajax({
			// 		url: url,
			// 		method: "GET",
			// 		dataType: "json",
			// 		success: function (data) {
			// 			resolve(data);
			// 		},
			// 		error: function (jqXHR, textStatus, errorThrown) {
			// 			reject(new Error(textStatus + ': ' + errorThrown));
			// 		}
			// 	});
			// });
            
        },
        onPress: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
        },
        formatter: {
            formatText: function (sValue) {
               
                return sValue || '_';
            },
        }
    };
});
