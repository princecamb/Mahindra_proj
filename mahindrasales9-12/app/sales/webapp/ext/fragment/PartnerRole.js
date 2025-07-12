sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        onPress: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
        },
        formatter: {
            formatText: function (sValue) {
                console.log(sValue);
                if(sValue === 'SP') return `${sValue} (Sold-to-party)`;
                else if(sValue === 'SH') return `${sValue} (Ship-to-party)`;
                else if(sValue === 'PY') return `${sValue} (Payer)`;
                else if(sValue === 'BP') return `${sValue} (Bill-to-party)`;
                else return sValue;
            },
        }
    };
});