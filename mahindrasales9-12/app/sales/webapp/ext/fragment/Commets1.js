sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return {
        onBrowseHistoryPress: async function() {
            debugger
            var oScrollContainer = this.byId("commentHistoryVBox123");
            var oDialog = this.byId("commentHistoryDialog1223");
            oDialog.open();
            var oDomRef = oScrollContainer._oScroller.getContainerDomRef();
            if (oDomRef) {
                var y = oDomRef.scrollHeight;
            }
            oScrollContainer.scrollTo(0, y,1000);
        },

        onCloseHistoryDialog: function() {
            var oDialog = this.byId("commentHistoryDialog1223");
            if (oDialog) {
                oDialog.close();
            }
        },

        onDialogOpen: function() {
            console.log("Comment History Dialog opened");
        }
    }
});
