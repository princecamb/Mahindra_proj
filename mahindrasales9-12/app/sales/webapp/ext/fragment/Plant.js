sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function(MessageToast) {
    'use strict';
    return {
    onPlantChange: async function (oEvent) {
        debugger
        const oBindingContext = oEvent.getSource().getBindingContext(); 
        let oParent = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getBindingContext();
        const materialCode = oBindingContext.getProperty("materialCode");
        const salesOrg = oParent.getProperty("salesOrg");
        const distributionChnl = oParent.getProperty("distributionChannels");
        const division = oParent.getProperty("division");
        var oItem,plant;
        const oComboBox = oEvent.getSource();
        var url = oParent.getModel().sServiceUrl ;
        await new Promise((resolve, reject) => {
            $.ajax({
            url: url + `VehicleInventory(vehicleCode='${materialCode}',salesOrg='${salesOrg}',distributionChnl='${distributionChnl}')`,
            method: "GET",
            success: function (oData) {
                debugger
                plant = oData.plant;
                resolve(oData);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                debugger
                reject(new Error(textStatus + ': ' + errorThrown));
            }
        });
        });
        const plantArray = plant ? plant.split(",") : [];
        for(const plant of plantArray) {
            oItem = new sap.ui.core.Item({
                key: plant,
                text: plant
            });
            oComboBox.addItem(oItem);
        };
    }
    };
});
