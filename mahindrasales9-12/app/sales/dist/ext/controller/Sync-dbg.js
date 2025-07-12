sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/BusyIndicator"
], function (MessageToast, BusyIndicator) {
    'use strict';

    // Define fetchData as a standalone function
    async function fetchData(url) {
        return new Promise((resolve, reject) => {
            jQuery.ajax({
                url: url,
                method: "GET",
                dataType: "json",
                success: function (data) { 
                    resolve(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    reject(new Error(textStatus + ': ' + errorThrown));
                }
            });
        });
    }

    return {
        sync: async function (oEvent) {
            BusyIndicator.show(0);
            try {
                debugger;

                // Get the base URL from the model
                const baseUrl = this.getModel().sServiceUrl;
                const sUrl = baseUrl + `getSH()`;

                // Fetch data from the service
                const response = await fetchData(sUrl);
                console.log("Response Data:", response);
                if (response) {
                    BusyIndicator.hide();
                    // Show a MessageToast when response is received
                    MessageToast.show("Data Updated Succesfully in Database!");
                }
                // return response;
                

            } catch (error) {
                BusyIndicator.hide();
                console.error("Error in sync function:", error.message || error);
                MessageToast.show(error);
            }
            BusyIndicator.hide();
        }
    };
});
