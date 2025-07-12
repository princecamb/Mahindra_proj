sap.ui.define(['sap/ui/core/mvc/ControllerExtension'], function (ControllerExtension) {
	'use strict';

	return ControllerExtension.extend('sales.ext.controller.List_page_sales', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf sales.ext.controller.List_page_sales
			 */
			onInit: function (oEvent) {
				debugger
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();
			},
			onAfterRendering: async function (oParameter) {
				debugger
				// if (sap.ushell && sap.ushell.Container) 
				// {
				// oUserInfoService = sap.ushell.Container.getService("UserInfo");
				// oUserEmail = oUserInfoService.getEmail(); 
				// }
				// this.base.getView().mAggregations.content[0].mAggregations.content.mAggregations.content.mAggregations._header.mAggregations.items[0].mAggregations.content[1].mAggregations.content.mForwardedAggregations.actions[0].setVisible(false);
				this.base.getView().getContent()[0].mAggregations.header.mAggregations.content[0].mAggregations.items[0].mAggregations.content.removeAllFilterItems(false);
				this.base.getView().mAggregations.content[0].mAggregations.header.mAggregations.content[0].mAggregations.items[0].mAggregations.content._btnAdapt.mProperties.visible = false;
				this.base.getView().mAggregations.content[0].mAggregations.header.mAggregations.content[0].mAggregations.items[0].mAggregations.content._btnSearch.mProperties.visible = false;

				// var craeteInproce = this.base.getView().mAggregations.content[0].mAggregations.content.mAggregations.content.mAggregations._header.mAggregations.items[1].mAggregations.content[1].mAggregations.content.mForwardedAggregations.actions[0].mAggregations.action.mProperties.visible = false;
				// var craeteNego = this.base.getView().mAggregations.content[0].mAggregations.content.mAggregations.content.mAggregations._header.mAggregations.items[2].mAggregations.content[1].mAggregations.content.mForwardedAggregations.actions[0].mAggregations.action.mProperties.visible = false;
				// var CreatePO = this.base.getView().mAggregations.content[0].mAggregations.content.mAggregations.content.mAggregations._header.mAggregations.items[3].mAggregations.content[1].mAggregations.content.mForwardedAggregations.actions[0].mAggregations.action.mProperties.visible = false;
				// var CreatePending = this.base.getView().mAggregations.content[0].mAggregations.content.mAggregations.content.mAggregations._header.mAggregations.items[4].mAggregations.content[1].mAggregations.content.mForwardedAggregations.actions[0].mAggregations.action.mProperties.visible = false;
				// var CreateSO = this.base.getView().mAggregations.content[0].mAggregations.content.mAggregations.content.mAggregations._header.mAggregations.items[5].mAggregations.content[1].mAggregations.content.mForwardedAggregations.actions[0].mAggregations.action.mProperties.visible = false;
				// var CreatePOS = this.base.getView().mAggregations.content[0].mAggregations.content.mAggregations.content.mAggregations._header.mAggregations.items[6].mAggregations.content[1].mAggregations.content.mForwardedAggregations.actions[0].mAggregations.action.mProperties.visible = false;
				// var POS = this.base.getView().mAggregations.content[0].mAggregations.content.mAggregations.content.mAggregations._header.mAggregations.items[7].mAggregations.content[1].mAggregations.content.mForwardedAggregations.actions[0].mAggregations.action.mProperties.visible = false;

				// var pay = this.base.getView().mAggregations.content[0].mAggregations.content.mAggregations.content.mAggregations._header.mAggregations.items[4].mAggregations.content[1].mAggregations.content.mForwardedAggregations.actions[0].mAggregations.action.mProperties.visible = false;
				// var deletePO = this.base.getView().mAggregations.content[0].mAggregations.content.mAggregations.content.mAggregations._header.mAggregations.items[3].mAggregations.content[1].mAggregations.content.mForwardedAggregations.actions[1].mAggregations.action.mProperties.visible = false;
			
			},
			routing: {
				onBeforeBinding: async function (oParameter) {
					// try {
						debugger;
					
					

					// const baseUrl = oParameter.oModel.sServiceUrl + '/getUserRoles()';
					// const baseUrl = this.getView().getParent().getManifestObject()._oBaseUri._string + '/getUserRoles()';
					var oModel = this.base.getExtensionAPI().getModel();
					if(oModel) {
						var sServiceUrl = oModel.sServiceUrl;
					}
					const baseUrl = sServiceUrl + 'getUserRoles()';

					const response = await new Promise((resolve, reject) => {
						$.ajax({
						url: baseUrl,
						method: "GET",
						success: function (oData) {
							resolve(oData);
						}
					});
					});

					const oView = this.base.getView();
					const views = this.base.getView()._oContainingView._oContainingView.mAggregations.content[0].mAggregations.content.mAggregations.content.mForwardedAggregations.items

					const roleCollections = response.value[0]["xs.system.attributes"]["xs.rolecollections"];
					// const roleCollections = ['Mahindra Finance'];
						if (roleCollections.includes('Mahindra Finance')) {
							views[0].setVisible(false);
							views[1].setVisible(false);
							views[2].setVisible(false);
							views[3].setVisible(false);
							views[7].setVisible(true);
							views[4].setVisible(true);
							views[5].setVisible(true);
							views[6].setVisible(false);
						} else if (roleCollections.includes('Mahindra Sales')) {
							views[4].setVisible(false);
							views[5].setVisible(false);
							views[6].setVisible(true);
							views[0].setVisible(true);
							views[1].setVisible(true);
							views[2].setVisible(true);
							views[3].setVisible(true);
							views[7].setVisible(true);
						}
					}

				},

				onAfterBinding: async function (oParameter) {
					debugger
				}
			
		}
	});
});
