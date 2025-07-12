sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return {

        onBrowseHistoryPress: async function() {
            debugger
           
            var oScrollContainer = this.byId("commentHistoryVBox");
            
            var oDialog = this.byId("commentHistoryDialog");
            oDialog.open();
            var oDomRef = oScrollContainer._oScroller.getContainerDomRef();
            //var y = 4000;
            if (oDomRef) {
                var y = oDomRef.scrollHeight;
            }
            oScrollContainer.scrollTo(0, y,1000);
                
  
        },

        onCloseHistoryDialog: function() {
            // Get the dialog
            var oDialog = this.byId("commentHistoryDialog");
            
            // Close the dialog
            if (oDialog) {
                oDialog.close();
            }
        },

        onDialogOpen: function() {
            // Optionally handle logic when the dialog opens
            console.log("Comment History Dialog opened");
        }

    }
});
