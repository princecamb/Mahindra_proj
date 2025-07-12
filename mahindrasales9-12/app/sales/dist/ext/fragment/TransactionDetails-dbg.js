sap.ui.define([], function() {
    'use strict';

    return {
        predefinedMethod: function() {},
        formatter: {
            formatText: function (sValue) {
                return sValue || '_';
            }
        }
    };
});
