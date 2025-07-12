

// const { release } = require("@sap/cds/libx/_runtime/hana/pool");

sap.ui.define(['sap/ui/core/mvc/ControllerExtension'], function (ControllerExtension) {
	'use strict';
	var oTextArea;
	var status;
	var purchaseOrderUuid;

	return ControllerExtension.extend('sales.ext.controller.Obj_PurchaseOrder_Page', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf sales.ext.controller.Obj_PurchaseOrder_Page
			 */
			onInit: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();
			},
			editFlow: {
				onAfterSave: async function (mParameters) {
					
				},
				onBeforeSave: async function (mParameters) { 
					// debugger
					// const baseUrl = mParameters.context.oModel.sServiceUrl;
					// if(status === 'SO Pending') {
					// 	const sUrl = baseUrl + `generateSO(data=${purchaseOrderUuid})`;
					// 	const response = await this.fetchData(sUrl);
					// }
				},
			},
			routing: {
				onBeforeBinding: async function (oUrl) {
					debugger;
				
					
				
				},
				onAfterBinding: async function (oUrl) {
				debugger
				
				const buttons = this.base.getView().findAggregatedObjects(true, function (control) {
					return control.isA("sap.m.Button") && (control.getId().includes("release-so") || control.getId().includes("Edit") || control.getId().includes("Save"));
				});
				const deliverybutton = this.base.getView().findAggregatedObjects(true, function (control) {
					return control.isA("sap.m.Button") && (control.getId().includes("sync-delivery"));
				});

				let match = oUrl.getPath().match(/purchaseOrderUuid=([\w-]+).*IsActiveEntity=(\w+)/);
				if(match) {
					purchaseOrderUuid = match[1];
					var isActiveEntity = match[2];
				}
				let oFunction = oUrl.getModel().bindContext(`/statusFun(...)`);
				oFunction.setParameter('purchaseEnquiryUuid',purchaseOrderUuid).setParameter('state','PO');
				await oFunction.execute();
				var res = oFunction.getBoundContext().getValue();
				console.log(res);
				
				const oView = this.base.getView();
				const oPage = oView.getContent()[0];
				const aSections = oPage.getSections();
				const oFooter = oPage.getAggregation("footer");
				const delDetails = aSections[5].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[0].mAggregations.content.mAggregations.content.mAggregations.columns;
				const soDetails = aSections[2].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[1].mAggregations.content.mAggregations.content.mAggregations.formContainers[0].mAggregations.formElements;
				oTextArea = aSections[10].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[0].mAggregations.content.mAggregations.items[1];
				
				var today = new Date();
				today.setDate(today.getDate() + 5); 
				this.getView().getModel("ui").setProperty("/minDate", today);
				this.getView().getModel("ui").setProperty("/visible-pdf1", true);
				this.getView().getModel("ui").setProperty("/visible-pdf2", false);
				const dueDate = aSections[6].mAggregations._grid.mAggregations.content[0].mAggregations._grid.findAggregatedObjects(true, function (control) {
					return control.isA("sap.m.DatePicker")  && control.getId().includes("dueDate");
				});
				let tomorrow = new Date(); // Get the current date and time
				tomorrow.setDate(tomorrow.getDate() + 1); // Add 1 day
				dueDate[0].setMinDate(tomorrow);
				if(res.value.minDelDate) {
					var min = new Date(res.value.minDelDate);
					min.setDate(min.getDate() - 1);
					this.getView().getModel("ui").setProperty("/minDueDate", min);
				} else {
					this.getView().getModel("ui").setProperty("/minDueDate", today);
				}
				dueDate[0].bindProperty("maxDate", "ui>/minDueDate");

				var oBindingData = res.value.result;
				status = oBindingData.status;
				 const roleCollections = res.value.roles["xs.system.attributes"]["xs.rolecollections"];
				// const roleCollections = ['Mahindra Finance'];

				if(roleCollections.includes('Mahindra Sales')){
					oTextArea.setEditable(false);
					buttons[2].setVisible(false);
					deliverybutton && deliverybutton[0]?.setVisible(false);
					if (oBindingData.status === 'SO Pending' || oBindingData.status === 'Approved' || oBindingData.status === 'Paid' || oBindingData.status === 'Rejected' ||
						oBindingData.status === 'Sent for Release' || oBindingData.status === 'Waiting for Payment Confirmation' || oBindingData.status === 'Credit Request' || oBindingData.status === 'Credit Approved' || oBindingData.status === 'Payment Confirmed'){
							buttons[0].setEnabled(false);
							buttons[2].setVisible(false);
							oFooter.setVisible(false);
							if(oBindingData.status === 'SO Pending' ) {
								delDetails[1]._oInnerColumn.setVisible(false);
								soDetails[0].setVisible(false);
							} else {
								delDetails[1]._oInnerColumn.setVisible(true);
								soDetails[0].setVisible(true);
							}
					}
					if(oBindingData.status === 'SO Pending') { soDetails[0].setVisible(false) } else { soDetails[0].setVisible(true) }
				} else if(roleCollections.includes('Mahindra Finance')) {
					if(isActiveEntity === "true") {
						oTextArea.setEditable(false);
						deliverybutton && deliverybutton[0]?.setVisible(false);
					if (oBindingData.status === 'SO Pending') {
						 buttons[0].setEnabled(true);
						buttons[2].setVisible(true);
						oFooter.setVisible(true);
						if(res.value.draftStatus){
							oFooter.setVisible(false);
						}
						delDetails[1]._oInnerColumn.setVisible(false);
						soDetails[0].setVisible(false);
						
					} 
					else if(oBindingData.status === 'Sent for Release' || oBindingData.status === 'Waiting for Payment Confirmation' || oBindingData.status === 'Payment Confirmed' || oBindingData.status === 'Paid' || oBindingData.status === 'Rejected' || oBindingData.status === 'Credit Request' || oBindingData.status === 'Credit Approved' || oBindingData.status === 'Payment Overdue' ) {
						buttons[0].setEnabled(false);
						oFooter.setVisible(false);
						delDetails[1]._oInnerColumn.setVisible(true);
						soDetails[0].setVisible(true);
					}

					} else {
						oTextArea.setEditable(true);
						deliverybutton && deliverybutton[0]?.setVisible(true);
						 deliverybutton && deliverybutton[0]?.addStyleClass("custom-delivery-button");
						buttons[2].setVisible(false);
						oFooter.setVisible(true);		
					}
				}

					if ( oBindingData.status === 'Approved' ) {
						aSections[1].setVisible(true); // po
						aSections[2].setVisible(false); // so
						aSections[4].setVisible(true); //vehicle
						aSections[5].setVisible(false); // delivery 
						aSections[6].setVisible(false); // payment 
						aSections[7].setVisible(false); // transaction
						aSections[8].setVisible(false); // invoice
						aSections[9].setVisible(true); // documents
						aSections[10].setVisible(true); //comments
					} 
					else if( oBindingData.status === 'Sent for Release' || oBindingData.status === 'Rejected' || oBindingData.status === 'SO Pending' ) {
						aSections[1].setVisible(false);
						aSections[2].setVisible(true);
						aSections[4].setVisible(true);
						aSections[5].setVisible(true);
						aSections[6].setVisible(true);
						aSections[7].setVisible(false);
						aSections[8].setVisible(false);
						aSections[9].setVisible(true);
						aSections[10].setVisible(true);
					} 
					else if( oBindingData.status === 'Waiting for Payment Confirmation' || oBindingData.status === 'Paid' || oBindingData.status === 'Credit Request' || oBindingData.status === 'Payment Confirmed' || oBindingData.status === 'Payment Overdue' || oBindingData.status === 'Credit Approved' ) {
						aSections[1].setVisible(false);
						aSections[2].setVisible(true);
						aSections[4].setVisible(true);
						aSections[5].setVisible(true);
						aSections[6].setVisible(true);
						aSections[7].setVisible(false);
						aSections[8].setVisible(true);
						aSections[9].setVisible(false);
						aSections[10].setVisible(true);
					} 
					if(oBindingData.status === 'Paid' ) {
						aSections[7].setVisible(true);
						aSections[6].setVisible(false);
					}
					if(oBindingData.status === 'Payment Confirmed'){
						this.getView().getModel("ui").setProperty("/visible-pdf2", true);
						aSections[7].setVisible(true);
						aSections[6].setVisible(false);
					} if(oBindingData.status === 'Credit Approved'){ 
						this.getView().getModel("ui").setProperty("/visible-pdf2", true);
					}

					setTimeout(async function() {
						if(!buttons[0].getEnabled()) buttons[0].setVisible(false);
					}.bind(this), 800);	

					// var TolTip = aSections[1].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[0].mAggregations.content.mAggregations.content.mAggregations.formContainers[0].mAggregations.formElements;
					var TolTip = aSections[1].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[1].mAggregations.content.mAggregations.content.mAggregations.formContainers[0].mAggregations.formElements;
					
					TolTip[4].mAggregations.fields[0].mAggregations.content.mAggregations.contentDisplay.setText(oBindingData.salesOrg);
					TolTip[6].mAggregations.fields[0].mAggregations.content.mAggregations.contentDisplay.setText(oBindingData.distributionChannels);
					TolTip[5].mAggregations.fields[0].mAggregations.content.mAggregations.contentDisplay.setText(oBindingData.division);
					TolTip[7].mAggregations.fields[0].mAggregations.content.mAggregations.contentDisplay.setText(oBindingData.docType);
                                         
                    // var TolTip1 = aSections[2].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[0].mAggregations.content.mAggregations.content.mAggregations.formContainers[0].mAggregations.formElements;
					var TolTip1 = aSections[2].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[1].mAggregations.content.mAggregations.content.mAggregations.formContainers[0].mAggregations.formElements;
                    TolTip1[1].mAggregations.fields[0].mAggregations.content.mAggregations.contentDisplay.setText(oBindingData.salesOrg);
					TolTip1[3].mAggregations.fields[0].mAggregations.content.mAggregations.contentDisplay.setText(oBindingData.distributionChannels);
					TolTip1[4].mAggregations.fields[0].mAggregations.content.mAggregations.contentDisplay.setText(oBindingData.division);
					TolTip1[5].mAggregations.fields[0].mAggregations.content.mAggregations.contentDisplay.setText(oBindingData.docType);
			}
		}
		},
		fetchData : async function(url) {
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
		},
	});
});

