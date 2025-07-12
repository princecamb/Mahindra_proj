sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        onPress: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
        },
        loadShippingPoint: async function (oEvent) {
            debugger
            var plant = oEvent.getSource().getParent().getParent().getBindingContext().getProperty("plant");
            const oComboBox = oEvent.getSource();
            var aFilters = [
                new sap.ui.model.Filter("sHField", sap.ui.model.FilterOperator.EQ, "Plant"),
                new sap.ui.model.Filter("sHId", sap.ui.model.FilterOperator.EQ, plant)
            ];
    
            oComboBox.bindAggregation("items", {
                path: "/SH",
                filters: aFilters,
                template: new sap.ui.core.Item({
                    key: "{sHId2}",
                    text: "{sHId2}" + `( {sHDescription2} )`
                })
            });
        }
    };
});
