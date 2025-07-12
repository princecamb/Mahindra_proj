sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    'use strict';
    return {
        onOpenPressed: async function (oEvent) {
            debugger
            var baseUrl = oEvent.oSource.getModel().getServiceUrl();
            var currentUrl = oEvent.oSource.mProperties.url;
            if (!currentUrl.startsWith(baseUrl)) {
                // If not, prepend baseUrl to the currentUrl
                currentUrl = baseUrl + currentUrl;
                oEvent.oSource.mProperties.url = currentUrl;
            }
           
            this.showSideContent("GeneratedFacet1");

       },
    };
});