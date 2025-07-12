 sap.ui.define(['sap/ui/core/mvc/ControllerExtension','sap/m/MessageBox'], function (ControllerExtension, MessageBox) {
	'use strict';
	var paymentDetails, Upload, comment, savevisiblity, send, Quotation1, Quotation,comment, comments, a, res = 0, flag = 0;
	return ControllerExtension.extend('sales.ext.controller.Obj_page_sales', {
// 		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
 		override: {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf sales.ext.controller.Obj_page_sales
			 */
			onInit: function () {
				debugger
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();
			},
			// editFlow: {
			// 	onAfterEdit: async function (mParameters) {
			// 		debugger
			// 		setTimeout(() => {
			// 			comments.setEnabled(true);
			// 			send.setVisible(false);
			// 		}, 800);
			// 	},
			// 	onAfterSave: function (mParameters) {
			// 		debugger
			// 		// this.base.getView().mAggregations.content[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[2].mProperties.text = 'Edit';
			// 		setTimeout(() => {
			// 			comments.setEnabled(false);
			// 			send.setVisible(true);
			// 		}, 800);
			// 		res = 0;
			// 	}

			// },
			// onAfterRendering: async function (oParameter) {
			// 	debugger
			// 	this.base.getView().mAggregations.content[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[4].mProperties.text = 'Review Quotation';
			// },
			// routing: {
			// 	onAfterBinding: async function () {

			// 		debugger
			// 		// var oUserEmail,oUserInfoService;
			// 		// if (sap.ushell && sap.ushell.Container) 
			// 		// 	{
			// 		// 	oUserInfoService = sap.ushell.Container.getService("UserInfo");
			// 		// 	oUserEmail = oUserInfoService.getEmail(); 
			// 		// 	}
			// 		// oUserEmail = 'gnharsha.13@gmail.com'
			// 		// let funcname = 'SendEmail';
			// 		// let oFunction = this.getView().getModel().bindContext(`/${funcname}(...)`);
			// 		// oFunction.setParameter('EmailId', oUserEmail); 
			// 		// await oFunction.execute();
			// 	},
			// 	onBeforeBinding: async function (oParameter) {
			// 		debugger
			// 		// const buttons = this.base.getView().findAggregatedObjects(true, function (control) {
			// 		// 	return control.isA("sap.m.Button") && (control.getId().includes("f1") || control.getId().includes("Edit"));
			// 		// });
			// 		// buttons[0].setVisible(true);
			// 		// buttons[1].setVisible(true);
			// 		// const oView = this.base.getView();
			// 		// const oPage = oView.getContent()[0];
			// 		// const oFooter = oPage.getAggregation("footer");
			// 		// oFooter.setVisible(true);
					
			// 		savevisiblity = this.base.getView().mAggregations.content[0].mAggregations.footer.mAggregations.content[6].mProperties.visible;
			// 		Upload = this.base.getView().mAggregations.content[0].mAggregations.sections[4];
			// 		comment = this.base.getView().mAggregations.content[0].mAggregations.sections[5];
			// 		Quotation = this.base.getView().mAggregations.content[0].mAggregations.sections[2];
			// 		Quotation1 = this.base.getView().mAggregations.content[0].mAggregations.sections[3];
			// 		comments = this.base.getView().mAggregations.content[0].mAggregations.sections[5].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[0].mAggregations.content.mAggregations.items[1];
			// 		send = this.base.getView().mAggregations.content[0].mAggregations.footer.mAggregations.content[5];
			// 		comments.setEnabled(false);
					
			// 		if(!savevisiblity){
			// 			send.setVisible(false);
			// 		}

			// 		let funcname = 'Fileds';
			// 		let oFunction = oParameter.getModel().bindContext(`/${funcname}(...)`);
			// 		var uuid = window.location.href;
			// 		const regex1 = /purchaseEnquiryUuid=([a-fA-F0-9-]+)/;;
			// 		const match1 = uuid.match(regex1);
			// 		if (match1) {
			// 			a = match1[1];
			// 			console.log(a);
			// 		}
			// 		oFunction.setParameter('purchaseEnquiryUuid', a);
			// 		await oFunction.execute();
			// 		const oContext = oFunction.getBoundContext();
			// 		result = oContext.getValue();
			// 		debugger
			// 		var Pe = result.value.purchaseEnquiryId;
			// 		if (result.value.status === 'Request' || result.value.status === null) {
			// 			this.base.getView().getContent()[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[4].setEnabled(true);
			// 			Quotation1.setVisible(false);
			// 			Quotation.setVisible(true);

			// 			let funcname = 'Request';
			// 			let oFunction = oParameter.getModel().bindContext(`/${funcname}(...)`);
			// 			oFunction.setParameter('r1', a);
			// 			await oFunction.execute();
			// 			const oContext = oFunction.getBoundContext();
			// 			result = oContext.getValue();
			// 			debugger
			// 			if (res == 0) {
			// 				if (result.value.success) {
			// 					MessageBox.success(result.value.message, {
			// 						title: "Success",
			// 						onClose: function () {
			// 							console.log("Success dialog closed");
			// 						}
			// 					});
			// 				} else {
			// 					const issues = result.value.message.split('<br>');
			// 					// Concatenate issues into a single formatted string
			// 					const formattedMessage = issues.join('\n');
			// 					MessageBox.warning(formattedMessage, {
			// 						title: "Stocks Warning",
			// 						onClose: function () {
			// 							console.log("Warning dialog closed");
			// 						}
			// 					});
			// 					flag = flag + 1;
			// 				}
			// 				res = res + 1;
			// 			}

			// 		} else if (result.value.status === 'Negotiation') {
			// 			this.base.getView().getContent()[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[4].setEnabled(true);
			// 			Quotation1.setVisible(true);
			// 			Quotation.setVisible(false);
						
			// 			let funcname = 'Nego';
			// 			let oFunction = oParameter.getModel().bindContext(`/${funcname}(...)`);
			// 			oFunction.setParameter('n1', a);
			// 			await oFunction.execute();
			// 			const oContext = oFunction.getBoundContext();
			// 			var result = oContext.getValue();

			// 		} else if (result.value.status === 'Approved') {
			// 			this.base.getView().getContent()[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[4].setEnabled(false);
			// 			Quotation1.setVisible(true);
			// 			Quotation.setVisible(false);
			// 			send.setVisible(false);
			// 			paymentDetails.setVisible(false);


			// 		} else if (result.value.status === 'In Process') {
			// 			this.base.getView().getContent()[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[4].setEnabled(false);
			// 			Quotation.setVisible(false);
			// 			Quotation1.setVisible(true);
			// 			send.setVisible(false);
			// 		}
			// 		else if (result.value.status === 'Pending') {
			// 			this.base.getView().getContent()[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[4].setEnabled(false);
			// 			Quotation.setVisible(false);
			// 			Quotation1.setVisible(false);
			// 			send.setVisible(false);
			// 			Upload.setVisible(false);
			// 			comment.setVisible(false);
			// 			paymentDetails.setVisible(true);
			// 		}
			// 	}
			// }
		}
	});
});
