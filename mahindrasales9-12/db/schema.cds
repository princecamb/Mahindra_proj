namespace db;

using {managed} from '@sap/cds/common';

entity Customer {

  key customerId              : UUID;
      name                    : String;
      companyName             : String;
      address                 : String;
      email                   : String;
      phone                   : String;
      userID                  : String;
      password                : String;
      van                     : String default 'NA';
      sapCustomerId           : String;
      location                : String;
      contactPerson           : String;
      department              : String;
      jobTitle                : String;
      taxId                   : String;
      Currency                : String;
      Language                : String;
      Country                 : String;
      City                    : String;
      Street                  : String;
      postalCode              : String;

      @Core.MediaType  : panMediaDocType
      panCardDoc              : LargeBinary;

      @Core.IsMediaType: true
      panMediaDocType         : String;

      @Core.MediaType  : profilePicType
      profilePic              : LargeBinary;

      @Core.IsMediaType: true
      profilePicType          : String;

      @Core.MediaType  : gstCertificateMediaType
      gstCertificate          : LargeBinary;

      @Core.IsMediaType: true
      gstCertificateMediaType : String;

      @Core.MediaType  : bankMediaType
      bankMandate             : LargeBinary;

      @Core.IsMediaType: true
      bankMediaType           : String;

      customerToEnquiry       : Composition of many PurchaseEnquiry
                                  on customerToEnquiry.enquiryToCustomer = $self;
      customerToPurchase      : Composition of many PurchaseOrder
                                  on customerToPurchase.purchaseToCustomer = $self;
}

entity PurchaseEnquiry : managed {
  key purchaseEnquiryUuid  : UUID;
      purchaseEnquiryId    : String;
      customerId           : UUID;
      deliveryLocation     : String;
      contactPerson        : String;
      division             : String;
      distributionChannels : String;
      status               : String default 'Draft';
      totalAmount          : String default '0';
      taxAmount            : String default '0';
      grandTotal           : String default '0';
      quotationId          : String;
      commentsText         : String;
      docType              : String;
      vendorCode           : String;
      companyCode          : String default '1000';
      salesOrg             : String;
      purchOrg             : String default '1000';
      purchGroup           : String;
      enquiryToCustomer    : Association to one Customer
                               on enquiryToCustomer.customerId = customerId;
      enquiryToVehicle     : Composition of many EnquiryVehicle
                               on enquiryToVehicle.vehicleToEnquiry = $self;
      enquiryToPartners    : Composition of many EnquiryPartners
                               on enquiryToPartners.partnersToEnquiry = $self;
      enquiryToFile        : Association to many EnquiryFiles
                               on enquiryToFile.fileToEnquiry = $self;
      enquiryToComments    : Composition of many EnquiryComments
                               on enquiryToComments.commentToEnquiry = $self;
}

entity EnquiryPartners {
  key partnerRole         : String;
  key purchaseEnquiryUuid : UUID;
      partnerNumber       : String;
      partnerName       : String;
      partnersToEnquiry   : Association to one PurchaseEnquiry
                              on partnersToEnquiry.purchaseEnquiryUuid = purchaseEnquiryUuid;
}

entity EnquiryVehicle {
  key vehicleId            : UUID;
      purchaseEnquiryUuid  : UUID;
      materialCode         : String;
      vehicleName          : String;
      vehicleColor         : String;
      quantity             : Integer;
      band                 : String;
      virtual isChecked    : Boolean;
      pricePerUnit         : String;
      taxPercentage        : String;
      actualPrice          : String default '0';
      totalPrice           : String default '0';
      mDiscount            : String default '0';
      discount             : String default '0';
      discountedPrice      : String default '0';
      itemNo               : String;
      plant                : String;
      meterial             : String;
      delId                : String;
      preferredDelDate     : Date;
      preferredDelLocation : String;
      vehicleToEnquiry     : Association to one PurchaseEnquiry
                               on vehicleToEnquiry.purchaseEnquiryUuid = purchaseEnquiryUuid;
}

entity EnquiryFiles : managed {
  key id                  : UUID;
      purchaseEnquiryUuid : UUID;
      purchaseOrderUuid   : UUID;

      @Core.MediaType  : mediaType
      content             : LargeBinary;

      @Core.IsMediaType: true
      mediaType           : String;
      fileName            : String;
      size                : Integer;
      url                 : String;
      fileToEnquiry       : Association to one PurchaseEnquiry
                              on fileToEnquiry.purchaseEnquiryUuid = purchaseEnquiryUuid;
      fileToPurchase      : Association to one PurchaseOrder
                              on fileToPurchase.purchaseOrderUuid = purchaseOrderUuid;
}

entity PurchaseComments : managed {
  key commentId         : UUID;
      user              : String;
      purchaseOrderUuid : UUID;
      customerId        : UUID;
      commentsText      : String;
      commentToPurchase : Association to one PurchaseOrder
                            on commentToPurchase.purchaseOrderUuid = purchaseOrderUuid;
}

entity EnquiryComments : managed {
  key commentId           : UUID;
      user                : String;
      purchaseEnquiryUuid : UUID;
      customerId          : UUID;
      commentsText        : String;
      commentToEnquiry    : Association to one PurchaseEnquiry
                              on commentToEnquiry.purchaseEnquiryUuid = purchaseEnquiryUuid;
}

entity PurchaseOrder : managed {
  key purchaseOrderUuid    : UUID;
      purchaseOrderId      : String;
      customerId           : UUID;
      deliveryLocation     : String;
      salesOrderId         : String;
      dealerCode           : String;
      bankName             : String;
      accNumber            : String;
      ifscCode             : String;
      branch               : String;
      accHoldersName       : String;
      dueDate              : Date;
      transactionId        : String;
      accountNo            : String;
      amount               : String;
      paymentMethod        : String;
      contactPerson        : String;
      division             : String;
      distributionChannels : String;
      purchaseEnquiryId    : String;
      totalAmount          : String;
      taxAmount            : String;
      grandTotal           : String;
      quotationID          : String;
      commentsText         : String;
      docType              : String;
      salesOrg             : String;
      purchOrg             : String;
      purchGroup           : String;
      vendorCode           : String;
      companyCode          : String;

      @Core.MediaType  : mediaType
      invoice              : LargeBinary;

      @Core.IsMediaType: true
      mediaType            : String;

      @Core.MediaType  : mediaType
      paymentBill          : LargeBinary;

      @Core.IsMediaType: true
      paymentBillType      : String;
      paymentBillFileName  : String;
      instanceId           : String;
      status               : String;
      soModifiedAt         : Timestamp;
      rzpOrderId           : String;

      purchaseToCustomer   : Association to one Customer
                               on purchaseToCustomer.customerId = customerId;
      purchaseToVehicle    : Composition of many PurchaseVehicle
                               on purchaseToVehicle.vehicleToPurchase = $self;
      purchaseToPartners   : Composition of many PurchasePartners
                               on purchaseToPartners.partnersToPurchase = $self;
      purchaseToFiles      : Association to many EnquiryFiles
                               on purchaseToFiles.fileToPurchase = $self;
      purchaseToComments   : Composition of many PurchaseComments
                               on purchaseToComments.commentToPurchase = $self;

}

entity PurchasePartners {
  key partnerRole        : String;
  key purchaseOrderUuid  : UUID;
      partnerNumber      : String;
      partnerName       : String;
      partnersToPurchase : Association to one PurchaseOrder
                             on partnersToPurchase.purchaseOrderUuid = purchaseOrderUuid;
}

entity PurchaseVehicle {

  key vehicleID            : UUID;
      purchaseOrderUuid    : UUID;
      materialCode         : String;
      vehicleName          : String;
      vehicleColor         : String;
      quantity             : Integer;
      band                 : String;
      pricePerUnit         : String;
      taxPercentage        : String;
      actualPrice          : String;
      totalPrice           : String;
      discount             : String;
      discountedPrice      : String;
      delId                : String;
      preferredDelDate     : Date;
      preferredDelLocation : String;
      delDate              : Date;
      delLocation          : String;
      transportMode        : String;
      deliveryLeadTime     : String;
      shippingPoint        : String;
      // deliveryDate : Date;
      // shippingMethod : String;
      // shippingCharges : String;

      // plannedQuantity: String;
      // shippingDate: Date;
      // expectedDeliveryDate : Date;
      // allocationStatus: String;
      itemNo               : String;
      plant                : String;
      material             : String;
      // partnerRole : String;
      // partnerNumber : String;

      vehicleToPurchase    : Association to one PurchaseOrder
                               on vehicleToPurchase.purchaseOrderUuid = purchaseOrderUuid;
}


//   entity EnquiryFiles : managed {
//     key id        : UUID;
//         purchaseOrderUuid      : UUID;
//         @Core.MediaType  : mediaType
//         content   : LargeBinary;
//         @Core.IsMediaType: true
//         mediaType : String;
//         url       : String;
//   fileName  : String;
//         filesToPurchase  : Association to one PurchaseOrder on filesToPurchase.purchaseOrderUuid = purchaseOrderUuid;

// }


entity VehicleInventory {
  key vehicleCode       : String;
  key salesOrg          : String;
  key distributionChnl  : String;
      plant             : String;
      vehicleName       : String;
      vehicleColor      : String;
      quantity          : Integer;
      pricePerUnit      : String;
      taxPercentage     : Integer;
      silverPer         : Integer;
      goldPer           : Integer;
      platinumPer       : Integer;
      silverMinQty      : Integer;
      goldMinQty        : Integer;
      platinumMinQty    : Integer;
      allocatedVehicles : Integer default 0;
}

entity SH {
  key sHKey          : UUID;
      sHField        : String;
      sHId           : String(4);
      sHDescription  : String;
      sHField2       : String;
      sHId2          : String(4);
      sHDescription2 : String;
      sHField3       : String;
      sHId3          : String(4);
      sHDescription3 : String;

// sHDistributionId : String(4);
// sHDistributionDescription:String;
// sHDivisionId : String(4);
// sHDivisionDescription:String;
}
