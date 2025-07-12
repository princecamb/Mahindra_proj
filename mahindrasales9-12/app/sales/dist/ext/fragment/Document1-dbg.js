sap.ui.define([
    "sap/m/MessageToast",
    "jquery.sap.global"
], function (MessageToast) {
    'use strict';

    return {
       
        onOpenPressed: function (oEvent) {
            debugger;
            var baseUrl = oEvent.oSource.getModel().getServiceUrl();
            var currentUrl = oEvent.oSource.mProperties.url;
            if (!currentUrl.startsWith(baseUrl)) {
                currentUrl = baseUrl + currentUrl;
                oEvent.oSource.mProperties.url = currentUrl;
            }
        },

        
    };
});
 