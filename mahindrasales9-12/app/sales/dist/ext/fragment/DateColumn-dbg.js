sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        onLiveChange : function(oEvent) 
        {
            debugger
            var min = oEvent.getParameter("value");
            var rows = oEvent.getSource().getParent().getParent().getParent().getRows();
            rows.forEach((row)=>{
                var cDate = row.getBindingContext()?.getProperty("delDate");
                const date1 = new Date(cDate);
                const date2 = new Date(min);
                if(cDate &&  date1 < date2 ) min = cDate;
            });
            min = new Date(min);
            min.setDate(min.getDate() - 1)
            this._view.getModel("ui").setProperty("/minDueDate", min);
            setTimeout(function() {
                oEvent.oSource.getParent().getParent().getBindingContext().refresh();
            }.bind(this), 800);
        }
    };
});
