sap.ui.define(['sap/ui/core/mvc/ControllerExtension', 'sap/m/MessageBox'], function (ControllerExtension, MessageBox) {
	'use strict';
	var result,currentstatus;
	return ControllerExtension.extend('sales.ext.controller.PurchaseEnquiryObjPage', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf sales.ext.controller.PurchaseEnquiryObjPage
			 */

			onInit: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();
			},
			editFlow: {
				onAfterEdit: async function (mParameters) {

				},
				onAfterSave: async function (oParameters) {

				}
				// setDraftStatus: async function (oParameters) { 
				// 	debugger
				// 	console.log('hiii aa');
				// },
				// toggleDraftActive: async function (oParameters) {
				// 	debugger
				// 	this.base.editFlow.setDraftStatus()
				// }

			},
			onAfterRendering: async function (oParameter) {
				debugger
				const oView = this.base.getView();
			
			},
			routing: {
				onAfterBinding: async function () {
					const oView = this.base.getView();
					const oPage = oView.getContent()[0];
				    const aSections = oPage.getSections();
					const oFooter = oPage.getAggregation("footer");
					setTimeout(() => {
						const buttons1 = this.base.getView().findAggregatedObjects(true, function (control) {
							return control.isA("sap.m.Button") && (control.getId().includes("SwitchDraftAndActiveObject"));
						});
						if(buttons1[0].getVisible() == true){
							if(buttons1[0].getText() == "Saved Version"){
								oFooter.setVisible(false);
							}else if(buttons1[0].getText() == "Draft"){
								oFooter.setVisible(true);
							}
						}
					}, 1000);
					
					
				},
				onBeforeBinding: async function (oParameter) {
					debugger
					const oView = this.base.getView();
					const oPage = oView.getContent()[0];
				    const aSections = oPage.getSections();
					var subtitle = aSections[3].mForwardedAggregations.subSections[0].setShowTitle(false);
					var quotationdetails = aSections[1].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[0].mAggregations.content.mAggregations.form.mAggregations.formContainers[0].mAggregations.formElements[13].mAggregations.fields[0];
					//quotationdetails.setVisible(false)
					let match = oParameter.getPath().match(/purchaseEnquiryUuid=([\w-]+).*IsActiveEntity=(\w+)/);
					if(match) {
						var purchaseEnquiryUuid = match[1];
						var isActiveEntity = match[2];
					}
					var s = 'PE';
					let oFunction = oParameter.getModel().bindContext(`/statusFun(...)`);
					oFunction.setParameter('purchaseEnquiryUuid', purchaseEnquiryUuid);
					oFunction.setParameter('state', s);
					await oFunction.execute();
					result = oFunction.getBoundContext().getValue();
					var priceDetails = result.value.priceDetails;
					
					var form = this.base.getView().mAggregations.content[0].mAggregations.sections[3].mAggregations._grid.mAggregations.content[1].mAggregations._grid.mAggregations.content[0].mAggregations.content.mAggregations.items;
					form[0].mAggregations.items[1].setText(priceDetails.total);
					form[1].mAggregations.items[1].setText(priceDetails.totaltax);
					form[2].mAggregations.items[1].setText(priceDetails.grandtotal);

					var oBindingData = result.value.result;
					console.log('Descriptions PE',result);
					
					const buttons = this.base.getView().findAggregatedObjects(true, function (control) {
						return control.isA("sap.m.Button") && (control.getId().includes("Edit") || control.getId().includes("send"));
					});
					const buttons1 = this.base.getView().findAggregatedObjects(true, function (control) {
						return control.isA("sap.m.Button") && (control.getId().includes("SwitchDraftAndActiveObject"));
					});
					
					
					const oFooter = oPage.getAggregation("footer");
					var ToolTip=this.base.getView().mAggregations.content[0].mAggregations.sections[1].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[0].mAggregations.content.mAggregations.form.mAggregations.formContainers[0].mAggregations.formElements;
					const oTextArea = aSections[5].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[0].mAggregations.content.mAggregations.items[1];
					// let content = aSections[0].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[1].mAggregations.content.mAggregations.content.mAggregations.formContainers[0].mAggregations.formElements;
					// let columns = aSections[3].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[1].mAggregations.content.mAggregations.content.getColumns();
					let columns = aSections[3].mAggregations._grid.mAggregations.content[0]._aAggregationProxy.blocks[1].mAggregations.content.mAggregations.content.mAggregations.columns;


					// columns[8].mAggregations.template.attachChange(function(oEvent) {
					// 	debugger
					// 	var newValue = oEvent.getParameter("value");
					// 	console.log("Value changed to: ", newValue);
					// });

					currentstatus = result.value.result.status;

					var text1 = isActiveEntity === 'true' || currentstatus === 'Negotiation'
					var comboBox1 = isActiveEntity === 'false' && currentstatus === 'Request'
					this.getView().getModel("ui").setProperty("/text", text1);
					this.getView().getModel("ui").setProperty("/comboBox", comboBox1);

					if(isActiveEntity === 'true') { 
						debugger
						oTextArea.setEditable(false);
						buttons[1].setVisible(true);
						//columns[10]._oInnerColumn.setVisible(false);
						if (currentstatus === 'Negotiation') {
							buttons[0].setEnabled(true);
							buttons[1].setVisible(true);
							oFooter.setVisible(true);
							quotationdetails.setVisible(true)
							buttons[0].setText('Negotiate');
						}
						else if (currentstatus === 'Request') { 
							buttons[0].setEnabled(true);
							buttons[1].setVisible(true);
							oFooter.setVisible(true);
							quotationdetails.setVisible(false);
							buttons[0].setText('Review Quotation');
						} else if (currentstatus === 'In Process') {
							buttons[0].setEnabled(false);
							buttons[1].setVisible(false);
							oFooter.setVisible(false);	
							quotationdetails.setVisible(true)
						}
					} 
					else if(isActiveEntity === 'false')
					{
						oTextArea.setEditable(true);
						buttons[1].setVisible(false);
						oFooter.setVisible(true);
						//columns[10]._oInnerColumn.setVisible(true);
					}

					if(currentstatus === 'Request'){
						quotationdetails.setVisible(false);
						columns[7]._oInnerColumn.setVisible(false);
						columns[8]._oInnerColumn.setVisible(false);
						// columns[15]._oInnerColumn.setVisible(true);
						columns[14]._oInnerColumn.setVisible(true); //false
					}
					else if(currentstatus === 'In Process'){
						quotationdetails.setVisible(true);
						columns[7]._oInnerColumn.setVisible(true);
						columns[8]._oInnerColumn.setVisible(false);
						columns[14]._oInnerColumn.setVisible(true);
						// columns[15]._oInnerColumn.setVisible(false);
					}
					else if(currentstatus === 'Negotiation'){
						quotationdetails.setVisible(true);
						columns[14]._oInnerColumn.setVisible(true);
						// columns[15]._oInnerColumn.setVisible(false);
						if(isActiveEntity === 'false'){
							columns[7]._oInnerColumn.setVisible(true);
							columns[8]._oInnerColumn.setVisible(true);
						}
						else{
							columns[7]._oInnerColumn.setVisible(true);
							columns[8]._oInnerColumn.setVisible(false);
						}
					}
					setTimeout(async function() {
						if(!buttons[0].getEnabled()) buttons[0].setVisible(false);
						ToolTip[2].mAggregations.fields[0].setText(oBindingData.salesOrg);
						ToolTip[3].mAggregations.fields[0].setText(oBindingData.distributionChannels);
						ToolTip[4].mAggregations.fields[0].setText(oBindingData.division);
						ToolTip[5].mAggregations.fields[0].setText(oBindingData.docType);
					}.bind(this), 800);	
				}
			}
		}
	});
});
