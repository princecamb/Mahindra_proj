sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text",
    "sap/ui/core/BusyIndicator"
], function(MessageToast, Dialog, Button, Text, BusyIndicator) {
    'use strict';

    return {
        REalseSO:  async function(oEvent) {
            debugger
            
            const buttons = this._view.findAggregatedObjects(true, function (control) {
                return control.isA("sap.m.Button") && (control.getId().includes("release-so") || control.getId().includes("Edit"));
            });
            // buttons[1].setEnabled(false);
			BusyIndicator.show(0);

            const oView = this._view;
			const oPage = oView.getContent()[0];
            const aSections = oPage.getSections();
            const oTextArea = aSections[10].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[0].mAggregations.content.mAggregations.items[1];
            const oFooter = oPage.getAggregation("footer");

            let oContext = oEvent.oBinding.oElementContext;  
            var oBindingData = oContext.getObject();  

            const baseUrl = oEvent.oModel.sServiceUrl;
            oBindingData.baseUrl = baseUrl;
            const cUrl = baseUrl + oEvent.sPath.slice(1) + '/purchaseToComments';
            const commentData = {
			    "commentsText": oBindingData.commentsText,
                "user": "M",
				"IsActiveEntity": true,
			};
            const vUrl = baseUrl + oEvent.sPath.slice(1) + '/purchaseToVehicle';
            const vehicles = await fetchData(vUrl);
            let paymentDetails = true;
            let DealercodeDetails = true;
            let vDetails = true;
            let text = [];
            var text1='', text2='';
            var text3 = true;
            const specialCharPattern = /^[^a-zA-Z0-9]+$/;

            // if (!oBindingData.bankName) paymentDetails = false;
            // if (!oBindingData.accNumber) paymentDetails = false;
            // if (!oBindingData.ifscCode) paymentDetails = false;
            // if (!oBindingData.branch) paymentDetails = false;
            // if (!oBindingData.accHoldersName) paymentDetails = false;
            if (!oBindingData.dueDate) paymentDetails = false;
            
            if(!oBindingData.dealerCode) DealercodeDetails = false; 
            if (!oBindingData.commentsText) { text3 = false; text.push('Comment is missing'); } 
            else if (specialCharPattern.test(oBindingData.commentsText)) {
                text3 = false;
                text.push('Comments cannot consist solely of special characters.');
            }

            if(!paymentDetails) text.push(' Due Date  is missing.');
            if(!DealercodeDetails) text.push('Dealer Code is Missing');
                vehicles.value.forEach(vehicle => {
                  if (!vehicle.deliveryLeadTime || !vehicle.delDate || !vehicle.transportMode || !vehicle.delLocation || !vehicle.shippingPoint) {
                    vDetails = false;
                  } 
                });

            if(!vDetails) text.push('Delivery Details for some vehicles are missing');
            const errorMessage = text.join('\n');

                if (!vDetails || !paymentDetails || !text3 || !DealercodeDetails) {
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
                    return; // Exit the function if fields are missing
                }
            
            var oDialog = new Dialog({
                title: "Confirmation",
                type: "Message",
                content: new Text({ text: "Do you want to send sales order for release?\nBefore sending, Please Confirm." }),
                beginButton: new Button({
                    text: "Confirm",
                    press: async function () { 
                        oDialog.close();
                        await onPress();
                    } 
                }),
                endButton: new Button({
                    text: "Cancel",
                    press: function () {
                        oDialog.close();
                    }
                })
            });
            //MessageToast.show("Custom handler invoked.");

            async function onPress() {
                debugger
                BusyIndicator.show(0);
                const aData =JSON.stringify(oBindingData);
                if(oBindingData.commentsText) {
                    const response1 = await postData(cUrl, commentData);
                }
                try {

                const puuid = oBindingData.purchaseOrderUuid;
                const Url = baseUrl + `generateSO(data=${puuid})`;
                const res = await fetchData(Url);
                console.log(res);
                if(res.value === 'success') {
                    const sUrl = baseUrl + `sendForRelease(data='${encodeURIComponent(aData)}')`;

                    const response = await fetchData(sUrl);
                    console.log(response);

                    if(response.value) {
                        MessageToast.show('Sent for Release!');
                        buttons[0].setVisible(false);
                        buttons[1].setVisible(false);
                        oFooter.setVisible(false);
                        oTextArea.setValue("");
                        BusyIndicator.hide();
                    }

            }
            } catch(error){
                BusyIndicator.hide();
                MessageToast.show('Error while processing request');
                // MessageToast.show(error);
            }
            }

            async function fetchData (url) {
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

            
            async function postData (url, data) {
                debugger
                return new Promise((resolve, reject) => {
                    jQuery.ajax({
                        url: url,
                        method: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(data),
                        success: function (response) {
                            debugger
                            resolve(response);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            reject(new Error(`${textStatus}: ${errorThrown}`));
                        }
                    });
                });
            }
            BusyIndicator.show(0);
            oDialog.open();
            BusyIndicator.hide();

        }
    };
});
