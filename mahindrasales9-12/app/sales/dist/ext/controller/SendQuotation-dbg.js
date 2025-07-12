sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator"
], function (MessageToast, Dialog, Button, Text, MessageBox, JSONModel, BusyIndicator) {
    'use strict';

    return {
        SendQuotation: async function (oEvent) {
            debugger;
            BusyIndicator.show(0);
            let text = [];
            var text1 = '', text2 = '';
            var text3 = true;
            const oView = this._view;
            const oPage = oView.getContent()[0];
            const oFooter = oPage.getAggregation("footer");
            var oCommentssec = this._view.byId("sales::PurchaseEnquiryObjectPage--fe::CustomSubSection::Comments--_IDGenTextArea");
            var errormess = "";
            const specialCharPattern = /^[^a-zA-Z0-9]+$/;
            // Retrieve comment text from TextArea
            const oTextArea = oView.getContent()[0].mAggregations.sections[5]
                .mForwardedAggregations.subSections[0]
                .mAggregations._grid.mAggregations.content[0]
                .mAggregations.content.mAggregations.items[1];


            let oContext1 = oEvent.oBinding.oElementContext;
            var oBindingData = oContext1.getObject();

            const baseUrl = oEvent.oModel.sServiceUrl;
            oBindingData.baseUrl = baseUrl;

            // vehicle plant 
            const vUrl = baseUrl + oEvent.sPath.slice(1) + '/enquiryToVehicle';
            const vehicles = await fetchData(vUrl);
            let vDetails = true;
            vehicles.value.forEach(vehicle => {
                if (!vehicle.plant) {
                  vDetails = false;
                } 
              });
              if(!vDetails) text.push('Plant is Missing in Quotation Details');

        //    comment
            if (!oBindingData.commentsText) { text3 = false; text.push('Comment is missing'); } 
            else if (specialCharPattern.test(oBindingData.commentsText)) {
                text3 = false;
                text.push('Comments cannot consist solely of special characters.');
            }
            if(!oBindingData.companyCode || !oBindingData.vendorCode || !oBindingData.purchOrg || !oBindingData.purchGroup){
                text.push('Inquiry Details are missing.');
            }

            

            const commentText = oTextArea.getValue();
            var sPath = oEvent.sPath;
            const regex = /purchaseEnquiryUuid=([a-fA-F0-9-]+)/;
            const match = sPath.match(regex);

            // let funcname = 'quotationFun';
            // let oFunction = oEvent.getModel().bindContext(`/${funcname}(...)`);
            // var val1 = 'check';
            // oFunction.setParameter('peUuid', match[1]);
            // oFunction.setParameter('value', val1);
            // await oFunction.execute();

            // const oContext = oFunction.getBoundContext();
            // debugger
            // const result = oContext.getValue();
            // if (result && result.value === 'empty enquiry fields') {
                //     var oErrorDialog1 = new Dialog({
                //         title: "Error",
                //         type: "Message",
                //         state: "Error",
                //         content: new sap.m.Label({ text: 'Enter All Enquiry Details' }),
                //         beginButton: new Button({
                //             text: "OK",
                //             press: function () {
                //                 oErrorDialog1.close();
                //                 BusyIndicator.hide();
                //             }
                //         }),
                //         afterClose: function () {
                //             oErrorDialog1.destroy();
                //         }
                //     });
                //    oErrorDialog1.open();
                //    return
                // text3 = false;
                // text.push('Enquiry Details are missing.');
            // }
            // if (result && result.value === 'empty Plant Data') {
                //     var oErrorDialog1 = new Dialog({
                //         title: "Error",
                //         type: "Message",
                //         state: "Error",
                //         content: new sap.m.Label({ text: 'Enter Plant Details' }),
                //         beginButton: new Button({
                //             text: "OK",
                //             press: function () {
                //                 oErrorDialog1.close();
                //                 BusyIndicator.hide();
                //             }
                //         }),
                //         afterClose: function () {
                //             oErrorDialog1.destroy();
                //         }
                //     });
                //    oErrorDialog1.open();
                //    return
                // text.push('Plant Details are missing.');
            // }

            

            // if (!commentText) {
            //     // errormess = "Comment is empty. Please enter a Comment.";
            //     text.push('Comment is missing.');
            // }
            // if (specialCharPattern.test(commentText)) {
            //     // errormess = "Comments cannot consist solely of special characters.";
            //     text.push('Comments cannot consist solely of special characters.');
            // }
            const errorMessage = text.join('\n');

            if (errorMessage.length > 0) {
                
                var oErrorDialog = new Dialog({
                    title: "Error",
                    type: "Message",
                    state: "Error",
                    content: new Text({ text: `${errorMessage}\nPlease complete all required fields.` }),
                    beginButton: new Button({
                        text: "OK",
                        press: function () {
                            oErrorDialog.close();
                            BusyIndicator.hide();
                        }
                    })
                });
                oErrorDialog.open();
                return;

            }
            else {

                var oDialog = new Dialog({
                    title: "Confirmation",
                    type: "Message",
                    content: new Text({ text: "Do you want to send Quotiation?\nBefore sending, Please Confirm" }),
                    beginButton: new Button({
                        text: "Confirm",
                        press: async function () {
                            try {

                                oDialog.close(); // Close the confirmation dialog before proceeding
                                BusyIndicator.show(0);
                                // Execute OData Function for Quotation
                                const currentUrl = window.location.href;
                                const regex = /purchaseEnquiryUuid=([a-f0-9\-]+)/;
                                const match = currentUrl.match(regex);
                                let pid;

                                if (match && match[1]) {
                                    pid = match[1];
                                } else {
                                    BusyIndicator.hide();
                                    console.log("UUID not found");
                                    MessageToast.show("Purchase Enquiry UUID not found.");
                                    return;
                                }

                                // Execute OData Function for Comments
                                let funcname1 = 'commentsFun';
                                let oFunction1 = oEvent.getModel().bindContext(`/${funcname1}(...)`);
                                oFunction1.setParameter('commentsText', commentText).setParameter('peUuid', pid);
                                await oFunction1.execute();
                                debugger
                                let funcname = 'quotationFun';
                                let oFunction = oEvent.getModel().bindContext(`/${funcname}(...)`);
                                var val = 'send';
                                oFunction.setParameter('peUuid', pid);
                                oFunction.setParameter('value', val);
                                await oFunction.execute();

                                const oContext = oFunction.getBoundContext();
                                debugger
                                const result = oContext.getValue();


                                console.log(result);
                                MessageToast.show("Quotation  Sent Successfully!");

                                setTimeout(function () {
                                    debugger
                                    oCommentssec.setValue("");
                                    debugger // Pass 'true' to refresh from the backend
                                }.bind(this), 800);

                                const buttons = oView.findAggregatedObjects(true, function (control) {
                                    return control.isA("sap.m.Button") &&
                                        (control.getId().includes("Edit") || control.getId().includes("send"));
                                });
                                buttons[0].setVisible(false);
                                buttons[1].setVisible(false);
                                oFooter.setVisible(false);
                                BusyIndicator.hide();
                            } catch (error) {
                                BusyIndicator.hide();
                                MessageToast.show('Error while processing request');
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
            }
            BusyIndicator.show(0);
            oDialog.open();
            BusyIndicator.hide();

            async function fetchData(url) {
                debugger
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
            BusyIndicator.hide();

        }
    };
});