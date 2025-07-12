using { db } from '../db/schema';


service MyService {

    @restrict: [{ grant: ['READ', 'WRITE'], to: 'mahindra_user' }]
    entity Customer as projection on db.Customer;

    @odata.draft.enabled
    @odata.draft.bypass
    @restrict: [{ grant: ['READ', 'WRITE'], to: 'mahindra_user' }]
    entity PurchaseEnquiry as projection on db.PurchaseEnquiry;

    @restrict: [{ grant: ['READ', 'WRITE'], to: 'mahindra_user' }]
    entity PurchasePartners as projection on db.PurchasePartners;

    @odata.draft.bypass
    @restrict: [{ grant: ['READ', 'WRITE'], to: 'mahindra_user' }]
    entity EnquiryPartners as projection on db.EnquiryPartners;

    @odata.draft.bypass
    @Common.SideEffects: {
        $Type: 'Common.SideEffectsType',
        TargetEntities: [vehicleToEnquiry]
    }
    @restrict: [{ grant: ['READ', 'WRITE'], to: 'mahindra_user' }]
    entity EnquiryVehicle as projection on db.EnquiryVehicle;

    @restrict: [{ grant: ['READ', 'WRITE'], to: 'mahindra_user' }]
    entity EnquiryFiles as projection on db.EnquiryFiles;

    @odata.draft.bypass
    @restrict: [{ grant: ['READ', 'WRITE'], to: 'mahindra_user' }]
    entity EnquiryComments as projection on db.EnquiryComments;

    @odata.draft.enabled
    @odata.draft.bypass
    @restrict: [{ grant: ['READ', 'WRITE'], to: 'mahindra_user' }]
    entity PurchaseOrder as projection on db.PurchaseOrder;

    @odata.draft.bypass
    @restrict: [{ grant: ['READ', 'WRITE'], to: 'mahindra_user' }]
    entity PurchaseVehicle as projection on db.PurchaseVehicle;

    @odata.draft.bypass
    @restrict: [{ grant: ['READ', 'WRITE'], to: 'mahindra_user' }]
    entity PurchaseComments as projection on db.PurchaseComments;

    @restrict: [{ grant: ['READ', 'WRITE'], to: 'mahindra_user' }]
    entity VehicleInventory as projection on db.VehicleInventory;

    @restrict: [{ grant: ['READ', 'WRITE'], to: 'mahindra_user' }]
    entity SH as projection on db.SH;

    @restrict: [{ to: 'mahindra_user' }]
    function postattach(p: String) returns String;

    @restrict: [{ to: 'mahindra_user' }]
    function SendEmail(EmailId: String) returns String;

    @restrict: [{ to: 'mahindra_user' }]
    function disablebut(para: String) returns String;

    @restrict: [{ to: 'mahindra_user' }]
    function statusFun(purchaseEnquiryUuid: String, state: String) returns String;

    @restrict: [{ to: 'mahindra_user' }]
    function quotationFun(peUuid: String, value: String) returns String;

    @restrict: [{ to: 'mahindra_user' }]
    function requestFun(peUuid: String) returns String;

    @restrict: [{ to: 'mahindra_user' }]
    function negotiationFun(peUuid: String) returns String;

    @restrict: [{ to: 'mahindra_user' }]
    function inProcessFun(peUuid: String) returns String;

    @restrict: [{ to: 'mahindra_user' }]
    function commentsFun(commentsText: String, peUuid: String) returns String;

    @restrict: [{ to: 'mahindra_user' }]
    function purchaseOrderFun(PurchaseOrderUuid: String) returns String;

    @restrict: [{ to: 'mahindra_user' }]
    function payDetailsFun(PurchaseOrderUuid: String) returns String;

    @restrict: [{ to: 'mahindra_user' }]
    function getUserRoles() returns Array of String;

    @restrict: [{ to: 'mahindra_user' }]
    function getSH() returns String;

    @restrict: [{ to: 'mahindra_user' }]
    function purchaseOrg(companyCode: String, vendorCode: String) returns String;


    @restrict: [{ to: 'mahindra_user' }]
    function generateInvoice(purchaseOrderUuid: UUID) returns String;

    @restrict: [{ to: 'mahindra_user' }]
    function sendForRelease(data: String) returns String;

    @restrict: [{ to: 'mahindra_user' }]
    function generateSO(data: UUID) returns String;

    @restrict: [{ to: 'mahindra_user' }]
    function SyncDeliveryDetails(purchaseOrderUuid: UUID) returns String;

    @restrict: [{ to: 'mahindra_user' }]
    function totalFun(purchaseEnquiryUuid: UUID) returns Array of String;

    @restrict: [{ to: 'mahindra_user' }]
    function PatchEntity(purchaseOrderUuid: UUID, status: String) returns String;

    @restrict: [{ to: 'mahindra_user' }]
    function AddNotification(purchaseID: UUID, customerID: UUID, Text: String) returns String;

    @restrict: [{ to: 'mahindra_user' }]
    function SalesOrvalue(SalesOrg: String, DistChan: String, Division: String, Doctype: String) returns Array of String;

    @restrict: [{ to: 'mahindra_user' }]
    function getCustomers() returns Array of String;

    @restrict: [{ to: 'mahindra_user' }]
    function createOrder(amount: String) returns String;

    @restrict: [{ to: 'mahindra_user' }]
    function getPartnersSh(paramaters: String) returns String;

    @restrict: [{ to: 'mahindra_user' }]
    function getVehiclesSh(paramaters: String) returns String;

    annotate PurchaseVehicle with @Common.SideEffects: {
        SourceProperties: ['delDate'],
        TargetProperties: ['deliveryLeadTime']
    };

    annotate EnquiryVehicle with @Common.SideEffects: {
        SourceProperties: ['discount', 'discountedPrice'],
        TargetProperties: ['discountedPrice', 'actualPrice', 'totalPrice', 'taxPercentage', vehicleToEnquiry.totalAmount, vehicleToEnquiry.taxAmount, vehicleToEnquiry.grandTotal]
    };
}
