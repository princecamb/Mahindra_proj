sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text"
], function (MessageToast, Dialog, Button, Text) {
    'use strict';
    var paybutton;
    return {
        PaymentDetails: async function (oEvent) {
            debugger;

            
            const oView = this._view;

            // Confirmation Dialog
            const oDialog = new Dialog({
                title: "Confirmation",
                type: "Message",
                content: new sap.m.Label({ 
                    text: "Do you want to send  payment details?\nPlease confirm your action." 
                }),
                beginButton: new Button({
                    text: "Confirm",
                    press: async function () {
                        oDialog.close(); // Close the confirmation dialog before proceeding
                        const currentUrl = window.location.href;
                        const regex = /purchaseOrderUuid=([a-f0-9\-]+)/;
                        const match = currentUrl.match(regex);
                        let pid;

                        if (match && match[1]) {
                            pid = match[1];
                        } else {
                            console.log("UUID not found");
                            MessageToast.show("Purchase Order UUID not found.");
                            return;
                        }

                        try {
                            // Execute OData Function for Payment
                            const funcname1 = 'payDetailsFun';
                            const oFunction1 = oEvent.getModel().bindContext(`/${funcname1}(...)`);
                            oFunction1.setParameter('PurchaseOrderUuid', pid);
                            await oFunction1.execute();

                            MessageToast.show("Payment Details sent successfully!");

                            // Update UI
                            const buttons = oView.findAggregatedObjects(true, function (control) {
                                return control.isA("sap.m.Button") && control.getId().includes("sendPaymet");
                            });

                            
                                buttons[0].setVisible(false);
                            
                            const oPage = oView.getContent()[0];
                            const oFooter = oPage.getAggregation("footer");
                            
                                oFooter.setVisible(false);
                           
                        } catch (error) {
                           
                            MessageToast.show("Failed to send  payment details. Please try again.");
                        }
                    }
                }),
                endButton: new Button({
                    text: "Cancel",
                    press: function () {
                        oDialog.close();
                    }
                })
            });

            // Open Confirmation Dialog
            oDialog.open();
        }
    };
});

// sap.ui.define([
//     "sap/m/MessageToast",
//     'sap/m/Dialog',
//     'sap/m/Button',
//     'sap/m/Text'
// ], function (MessageToast, Dialog, Button, Text) {
//     'use strict';

//     return {
//         PaymentDetails: function (oEvent) {
//             const oView = this._view;

//             // Confirmation Dialog
//             const oDialog = new Dialog({
//                 title: "Confirmation",
//                 type: "Message",
//                 content: new Text({ 
//                     text: "Do you want to send  payment details?\nPlease confirm your action." 
//                 }),
//                 beginButton: new Button({
//                     text: "Confirm",
//                     press: async function () {
//                         oDialog.close(); // Close the confirmation dialog before proceeding
//                         const currentUrl = window.location.href;
//                         const regex = /purchaseOrderUuid=([a-f0-9\-]+)/;
//                         const match = currentUrl.match(regex);
//                         let pid;

//                         if (match && match[1]) {
//                             pid = match[1];
//                         } else {
//                             console.log("UUID not found");
//                             MessageToast.show("Purchase Order UUID not found.");
//                             return;
//                         }

//                         try {
//                             // Execute OData Function for Payment
//                             const funcname1 = 'payDetailsFun';
//                             const oFunction1 = oEvent.getModel().bindContext(`/${funcname1}(...)`);
//                             oFunction1.setParameter('PurchaseOrderUuid', pid);
//                             await oFunction1.execute();

//                             MessageToast.show("Payment Details sent successfully!");

//                             // Update UI
//                             const buttons = oView.findAggregatedObjects(true, function (control) {
//                                 return control.isA("sap.m.Button") && control.getId().includes("send-payment");
//                             });

                            
//                                 buttons[0].setVisible(false);
                            
//                             const oPage = oView.getContent()[0];
//                             const oFooter = oPage.getAggregation("footer");
                            
//                                 oFooter.setVisible(false);
                           
//                         } catch (error) {
                           
//                             MessageToast.show("Failed to send  payment details. Please try again.");
//                         }
//                     }
//                 }),
//                 endButton: new Button({
//                     text: "Cancel",
//                     press: function () {
//                         oDialog.close();
//                     }
//                 })
//             });

//             // Open Confirmation Dialog
//             oDialog.open();
//         }
//     };
// });

