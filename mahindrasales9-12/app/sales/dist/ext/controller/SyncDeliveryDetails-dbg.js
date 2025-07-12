sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        syncDelivery: async function(oEvent) {
            const currentUrl = oEvent.sPath;
            //const regex = /purchaseOrderUuid=([a-f0-9\-]+)/;
           const match = currentUrl.match(/purchaseOrderUuid=([\w-]{36})/);

           let pid;

                           if (match && match[1]) {
                               pid = match[1];
                           }
        //    let funcname1 = 'SyncDeliveryDetails';
           let oFunction1 = oEvent.getModel().bindContext(`/SyncDeliveryDetails(...)`);
            oFunction1.setParameter('purchaseOrderUuid', pid);
            await oFunction1.execute();
            const oContext = oFunction1.getBoundContext();
            const result = oContext.getValue();
            //if(result){
               debugger
               setTimeout(function() {
                   debugger
                   oEvent.refresh();
               }.bind(this), 800);
        }
    };
});
