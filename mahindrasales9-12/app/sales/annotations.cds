using MyService as service from '../../srv/service';
annotate service.PurchaseEnquiry with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.companyName,
                Label : 'Company Name',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.phone,
                Label : 'Contact Number',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.email,
                Label : 'Email',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.van,
                Label : 'Virtual Account Number',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.address,
                Label : 'Address',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.jobTitle,
                Label : 'Job Title',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.department,
                Label : 'Department',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.taxId,
                Label : 'Tax ID',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.Currency,
                Label : 'Currency',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.Language,
                Label : 'Language',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.Country,
                Label : 'Country',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.City,
                Label : 'City',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.Street,
                Label : 'Street',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.postalCode,
                Label : 'Postal Code',
            },
            {
                $Type : 'UI.DataField',
                Value : enquiryToCustomer.location,
                Label : 'Location',
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Partners',
            ID : 'Partners',
            Target : 'enquiryToPartners/@UI.PresentationVariant#Partners',
        },
        {
            $Type : 'UI.CollectionFacet',
            Label : 'Quotation Details',
            ID : 'QuotationDetail',
            Facets : [
                {
                    $Type : 'UI.ReferenceFacet',
                    Label : 'Vehicle Details',
                    ID : 'VehicleDetails',
                    Target : 'enquiryToVehicle/@UI.LineItem#VehicleDetails2',
                },
            ],
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Purchase Inquiry ID',
            Value : purchaseEnquiryId,
        },
        {
            $Type : 'UI.DataField',
            Value : enquiryToCustomer.companyName,
            Label : 'Company Name',
        },
        {
            $Type : 'UI.DataField',
            Label : 'Contact Person',
            Value : contactPerson,
        },
    ],
    UI.FieldGroup #EnquiryDetails : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : contactPerson,
                Label : 'Contact Person',
            },
            {
                $Type : 'UI.DataField',
                Value : division,
                Label : 'Division',
            },
            {
                $Type : 'UI.DataField',
                Value : salesOrg,
                Label : 'Sales Organization',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseEnquiryId,
                Label : 'Purchase Inquiry ID',
            },
            {
                $Type : 'UI.DataField',
                Value : distributionChannels,
                Label : 'Distribution Channel',
            },
            {
                $Type : 'UI.DataField',
                Value : docType,
                Label : 'Document Type',
            },
        ],
    },
    UI.FieldGroup #Price : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : totalAmount,
                Label : 'Total Amount',
            },
            {
                $Type : 'UI.DataField',
                Value : taxAmount,
                Label : 'Tax Amount',
            },
            {
                $Type : 'UI.DataField',
                Value : grandTotal,
                Label : 'Grand Total',
            },
        ],
    },
    UI.FieldGroup #Price1 : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : totalAmount,
                Label : 'Total Amount',
            },
            {
                $Type : 'UI.DataField',
                Value : taxAmount,
                Label : 'Tax Amount',
            },
            {
                $Type : 'UI.DataField',
                Value : grandTotal,
                Label : 'Grand Total',
            },
        ],
    },
    UI.SelectionPresentationVariant #tableView : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem',
            ],
            SortOrder : [
                {
                    $Type : 'Common.SortOrderType',
                    Property : createdAt,
                    Descending : true,
                },
                {
                    $Type : 'Common.SortOrderType',
                    Property : modifiedAt,
                    Descending : true,
                },
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Request',
                        },
                    ],
                },
            ],
        },
        Text : 'Request',
    },
    UI.LineItem #tableView : [
        {
            $Type : 'UI.DataField',
            Value : purchaseEnquiryId,
            Label : 'Purchase Inquiry ID',
        },
        {
            $Type : 'UI.DataField',
            Value : enquiryToCustomer.companyName,
            Label : 'Company Name',
        },
        {
            $Type : 'UI.DataField',
            Value : contactPerson,
            Label : 'Contact Person',
        },
    ],
    UI.SelectionPresentationVariant #tableView1 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView',
            ],
            SortOrder : [
                {
                    $Type : 'Common.SortOrderType',
                    Property : modifiedAt,
                    Descending : true,
                },
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'In Process',
                        },
                    ],
                },
            ],
        },
        Text : 'In Process',
    },
    UI.LineItem #tableView1 : [
        {
            $Type : 'UI.DataField',
            Value : purchaseEnquiryId,
            Label : 'Purchase Inquiry ID',
        },
        {
            $Type : 'UI.DataField',
            Value : enquiryToCustomer.companyName,
            Label : 'Company Name',
        },
        {
            $Type : 'UI.DataField',
            Value : contactPerson,
            Label : 'Contact Person',
        },
    ],
    UI.SelectionPresentationVariant #tableView2 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView1',
            ],
            SortOrder : [
                {
                    $Type : 'Common.SortOrderType',
                    Property : modifiedAt,
                    Descending : true,
                },
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Negotiation',
                        },
                    ],
                },
            ],
        },
        Text : 'Negotiation',
    },
    UI.LineItem #tableView2 : [
    ],
    UI.SelectionPresentationVariant #tableView3 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView2',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : 'Table View 3',
    },
    UI.DeleteHidden : true,
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : enquiryToCustomer.companyName,
        },
        TypeName : '',
        TypeNamePlural : '',
        Description : {
            $Type : 'UI.DataField',
            Value : status,
        },
        ImageUrl : enquiryToCustomer.profilePic,
    },
    UI.LineItem #tableView3 : [
    ],
    UI.SelectionPresentationVariant #tableView4 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView3',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Pending',
                        },
                    ],
                },
            ],
        },
        Text : 'Payment Details',
    },
    UI.LineItem #tableView4 : [
        {
            $Type : 'UI.DataField',
            Value : purchaseEnquiryId,
            Label : 'purchaseEnquiryId',
        },
    ],
    UI.SelectionPresentationVariant #tableView5 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView4',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Pending',
                        },
                    ],
                },
            ],
        },
        Text : 'Payment Details',
    },
    UI.Identification : [
        
    ],
    UI.FieldGroup #PriceDetails : {
        $Type : 'UI.FieldGroupType',
        Data : [
        ],
    },
);

annotate service.EnquiryVehicle with @(
    UI.LineItem #VehicleDetails : [
        {
            $Type : 'UI.DataField',
            Value : materialCode,
            Label : 'Material Code',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleName,
            Label : 'Vehicle Name',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleColor,
            Label : 'Vehicle Color',
        },
        {
            $Type : 'UI.DataField',
            Value : partnerRole,
            Label : 'Partner Role',
        },
        {
            $Type : 'UI.DataField',
            Value : partnerNumber,
            Label : 'Partner Number',
        },
        {
            $Type : 'UI.DataField',
            Value : quantity,
            Label : 'Quantity',
        },
        {
            $Type : 'UI.DataField',
            Value : pricePerUnit,
            Label : 'Price Per Unit',
        },
        {
            $Type : 'UI.DataField',
            Value : actualPrice,
            Label : 'Actual Price',
        },
        {
            $Type : 'UI.DataField',
            Value : band,
            Label : 'Band',
        },
        {
            $Type : 'UI.DataField',
            Value : discountedPrice,
            Label : 'Discounted Price',
        },
        {
            $Type : 'UI.DataField',
            Value : taxPercentage,
            Label : 'Tax Percentage',
        },
        {
            $Type : 'UI.DataField',
            Value : totalPrice,
            Label : 'Total Price',
        },
        {
            $Type : 'UI.DataField',
            Value : preferredDelDate,
            Label : 'Preferred Delivery Date',
        },
        {
            $Type : 'UI.DataField',
            Value : preferredDelLocation,
            Label : 'Preferred Delivery Location',
        },
    ],
    UI.LineItem #VehicleDetails1 : [
        {
            $Type : 'UI.DataField',
            Value : vehicleName,
            Label : 'Vehicle Name',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleColor,
            Label : 'Vehicle Color',
        },
        {
            $Type : 'UI.DataField',
            Value : pricePerUnit,
            Label : 'Price Per Unit',
        },
        {
            $Type : 'UI.DataField',
            Value : actualPrice,
            Label : 'Actual Price',
        },
        {
            $Type : 'UI.DataField',
            Value : band,
            Label : 'Band',
        },
        {
            $Type : 'UI.DataField',
            Value : taxPercentage,
            Label : 'Tax Percentage',
        },
    ],
    UI.LineItem #tableMacro : [
        {
            $Type : 'UI.DataField',
            Value : materialCode,
            Label : 'Material Code',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleName,
            Label : 'Vehicle Name',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleColor,
            Label : ' Vehicle Color',
        },
        {
            $Type : 'UI.DataField',
            Value : quantity,
            Label : 'Quantity',
        },
        {
            $Type : 'UI.DataField',
            Value : pricePerUnit,
            Label : 'Price Per Unit',
        },
        {
            $Type : 'UI.DataField',
            Value : actualPrice,
            Label : 'Actual Price',
        },
        {
            $Type : 'UI.DataField',
            Value : band,
            Label : 'Band(%)',
        },
        {
            $Type : 'UI.DataField',
            Value : discountedPrice,
            Label : 'Discounted Price',
        },
        {
            $Type : 'UI.DataField',
            Value : taxPercentage,
            Label : 'Tax Percentage',
        },
        {
            $Type : 'UI.DataField',
            Value : totalPrice,
            Label : 'Total Price',
        },
        {
            $Type : 'UI.DataField',
            Value : preferredDelDate,
            Label : 'Preferred Delivery Date',
        },
        {
            $Type : 'UI.DataField',
            Value : preferredDelLocation,
            Label : 'Preferred Delivery Location',
        },
        {
            $Type : 'UI.DataField',
            Value : plant,
            Label : 'Plant',
        },
    ],
    UI.LineItem #QuotationDetail : [
    ],
    UI.LineItem #VehicleDetails2 : [
    ],
    UI.LineItem #hj : [
    ],
);

annotate service.PurchaseOrder with @(
    UI.LineItem #tableView : [
        {
            $Type : 'UI.DataField',
            Value : purchaseOrderId,
            Label : 'Purchase Order ID',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseEnquiryId,
            Label : 'Purchase Enquiry Id',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseToCustomer.companyName,
            Label : 'Company Name',
        },
        {
            $Type : 'UI.DataField',
            Value : contactPerson,
            Label : 'Contact Person',
        },
        {
            $Type : 'UI.DataField',
            Value : status,
            Label : 'status',
        },
    ],
    UI.SelectionPresentationVariant #tableView : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView',
            ],
            SortOrder : [
                {
                    $Type : 'Common.SortOrderType',
                    Property : createdAt,
                    Descending : true,
                },
                {
                    $Type : 'Common.SortOrderType',
                    Property : modifiedAt,
                    Descending : true,
                },
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'SO Pending',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Approved',
                        },
                    ],
                },
            ],
        },
        Text : 'Purchase Order',
    },
    UI.HeaderInfo : {
        TypeName : 'Purchase Order',
        TypeNamePlural : '',
        Title : {
            $Type : 'UI.DataField',
            Value : purchaseToCustomer.companyName,
        },
        Description : {
            $Type : 'UI.DataField',
            Value : status,
        },
        ImageUrl : purchaseToCustomer.profilePic,
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Purchase Order Details',
            ID : 'EnquiryDetials',
            Target : '@UI.FieldGroup#EnquiryDetials',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Sales Order Details',
            ID : 'SalesOrderDetails',
            Target : '@UI.FieldGroup#SalesOrderDetails',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Partners',
            ID : 'Partners',
            Target : 'purchaseToPartners/@UI.PresentationVariant#Partners',
        },
        {
            $Type : 'UI.CollectionFacet',
            Label : 'Vehicle Details',
            ID : 'QuotationDetails',
            Facets : [
                {
                    $Type : 'UI.ReferenceFacet',
                    ID : 'VehicleDetails',
                    Target : 'purchaseToVehicle/@UI.LineItem#VehicleDetails',
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    Label : 'Price Details',
                    ID : 'Price',
                    Target : '@UI.FieldGroup#Price',
                },
            ],
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Delivery Details',
            ID : 'DeliveryDetails',
            Target : 'purchaseToVehicle/@UI.LineItem#DeliveryDetails',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Payment Details',
            ID : 'PaymentDetails1',
            Target : '@UI.FieldGroup#PaymentDetails1',
        },
    ],
    UI.FieldGroup #CustomerInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.companyName,
                Label : 'Company Name',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.contactPerson,
                Label : 'Contact Person',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.name,
                Label : 'Name',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.email,
                Label : 'Email',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.address,
                Label : 'Address',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.phone,
                Label : 'Phone',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.location,
                Label : 'Location',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.van,
                Label : 'VAN',
            },
            {
                $Type : 'UI.DataField',
                Value : distributionChannels,
                Label : 'Distribution Channels',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.taxId,
                Label : 'Tax Id',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.jobTitle,
                Label : 'Job Title',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.department,
                Label : 'Department',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.City,
                Label : 'City',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.Country,
                Label : 'Country',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.Currency,
                Label : 'Currency',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.Language,
                Label : 'Language',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.postalCode,
                Label : 'Postal Code',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseToCustomer.Street,
                Label : 'Street',
            },
        ],
    },
    UI.FieldGroup #EnquiryDetials : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : purchaseOrderId,
                Label : 'Purchase Order Id',
            },
            {
                $Type : 'UI.DataField',
                Value : contactPerson,
                Label : 'Contact Person',
            },
            {
                $Type : 'UI.DataField',
                Value : purchaseEnquiryId,
                Label : 'Purchase Enquiry Id',
            },
            {
                $Type : 'UI.DataField',
                Value : salesOrg,
                Label : 'Sales Organisation',
            },
            {
                $Type : 'UI.DataField',
                Value : division,
                Label : 'Division',
            },
            {
                $Type : 'UI.DataField',
                Value : distributionChannels,
                Label : 'Distribution Channels',
            },
            {
                $Type : 'UI.DataField',
                Value : docType,
                Label : 'Document Type',
            },
            {
                $Type : 'UI.DataField',
                Value : vendorCode,
                Label : 'Vendor Code',
            },
            {
                $Type : 'UI.DataField',
                Value : companyCode,
                Label : 'Company Code',
            },
            {
                $Type : 'UI.DataField',
                Value : purchOrg,
                Label : 'Purchase Organization',
            },
            {
                $Type : 'UI.DataField',
                Value : purchGroup,
                Label : 'Purchase Group',
            },
        ],
    },
    UI.FieldGroup #Price : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : totalPrice,
                Label : 'Total Price',
            },
            {
                $Type : 'UI.DataField',
                Value : taxAmount,
                Label : 'Tax Amount',
            },
            {
                $Type : 'UI.DataField',
                Value : grandTotal,
                Label : 'Grand Total',
            },
        ],
    },
    UI.DeleteHidden : true,
    UI.LineItem #tableView1 : [
        {
            $Type : 'UI.DataField',
            Value : purchaseOrderId,
            Label : 'Purchase Order ID',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseToCustomer.companyName,
            Label : 'Company Name',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseToCustomer.contactPerson,
            Label : 'Contact Person',
        },
    ],
    UI.SelectionPresentationVariant #tableView1 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView1',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : 'Payment Details',
    },
    UI.LineItem #tableView2 : [
        {
            $Type : 'UI.DataField',
            Value : purchaseToCustomer.companyName,
            Label : 'Company Name',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseOrderId,
            Label : 'Purchase  Order ID',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseToCustomer.contactPerson,
            Label : 'Contact Person',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseEnquiryId,
            Label : 'Purchase Enquiry ID',
        },
        {
            $Type : 'UI.DataField',
            Value : status,
            Label : 'Status',
        },
    ],
    UI.SelectionPresentationVariant #tableView2 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView2',
            ],
            SortOrder : [
                {
                    $Type : 'Common.SortOrderType',
                    Property : modifiedAt,
                    Descending : true,
                },
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Waiting for Payment Confirmation',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Credit Request',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Payment Confirmed',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Paid',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Credit Approved',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Payment Overdue',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Sent for Release',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'SO Not Released',
                        },
                    ],
                },
            ],
        },
        Text : 'Sales Orders',
    },
    UI.LineItem #tableView3 : [
        {
            $Type : 'UI.DataField',
            Value : purchaseOrderId,
            Label : 'Purchase Order ID',
        },
        {
            $Type : 'UI.DataField',
            Value : status,
            Label : 'Status',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseToCustomer.companyName,
            Label : 'Company Name',
        },
    ],
    UI.SelectionPresentationVariant #tableView3 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView3',
            ],
            SortOrder : [
                {
                    $Type : 'Common.SortOrderType',
                    Property : soModifiedAt,
                    Descending : true,
                },
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Sent For Release',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Waiting For Payment Confirmation',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Payment Confirmed',
                        },
                    ],
                },
            ],
        },
        Text : 'SO Pending ',
    },
    UI.LineItem #tableView4 : [
        {
            $Type : 'UI.DataField',
            Value : purchaseOrderId,
            Label : 'Purchase Order ID',
        },
        {
            $Type : 'UI.DataField',
            Value : status,
            Label : 'Status',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseToCustomer.companyName,
            Label : 'Company Name',
        },
    ],
    UI.SelectionPresentationVariant #tableView4 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView4',
            ],
            SortOrder : [
                {
                    $Type : 'Common.SortOrderType',
                    Property : createdAt,
                    Descending : true,
                },
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'SO Not Released',
                        },
                    ],
                },
            ],
        },
        Text : 'Purchase Order',
    },
    UI.LineItem #tableView5 : [
        {
            $Type : 'UI.DataField',
            Value : salesOrderId,
            Label : 'Sales Order ID',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseToCustomer.companyName,
            Label : 'Company Name',
        },
        {
            $Type : 'UI.DataField',
            Value : status,
            Label : 'Status',
        },
    ],
    UI.SelectionPresentationVariant #tableView5 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView5',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : 'Sales Oder',
    },
    UI.FieldGroup #PaymentDetails : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : bankName,
                Label : 'Bank Name',
            },
            {
                $Type : 'UI.DataField',
                Value : accNumber,
                Label : 'Account Number',
            },
            {
                $Type : 'UI.DataField',
                Value : accHoldersName,
                Label : 'Account Holders Name',
            },
            {
                $Type : 'UI.DataField',
                Value : ifscCode,
                Label : 'IFSC Code',
            },
            {
                $Type : 'UI.DataField',
                Value : branch,
                Label : 'Branch',
            },
            {
                $Type : 'UI.DataField',
                Value : dueDate,
                Label : 'Due Date',
            },
        ],
    },
    UI.FieldGroup #TransactionDetails : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : accountNo,
                Label : 'Account Number',
            },
            {
                $Type : 'UI.DataField',
                Value : transactionId,
                Label : 'Transaction Id',
            },
            {
                $Type : 'UI.DataField',
                Value : amount,
                Label : 'Amount',
            },
            {
                $Type : 'UI.DataField',
                Value : paymentMethod,
                Label : 'Payment Method',
            },
        ],
    },
    UI.FieldGroup #SalesOrderDetails : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : salesOrderId,
                Label : 'Sales Order Id',
            },
            {
                $Type : 'UI.DataField',
                Value : salesOrg,
                Label : 'Sales Organisation',
            },
            {
                $Type : 'UI.DataField',
                Value : dealerCode,
                Label : 'Dealer Code',
            },
            {
                $Type : 'UI.DataField',
                Value : distributionChannels,
                Label : 'Distribution Channels',
            },
            {
                $Type : 'UI.DataField',
                Value : division,
                Label : 'Division',
            },
            {
                $Type : 'UI.DataField',
                Value : docType,
                Label : 'Document Type',
            },
            {
                $Type : 'UI.DataField',
                Value : quotationID,
                Label : 'Quotation Id',
            },
            {
                $Type : 'UI.DataField',
                Value : vendorCode,
                Label : 'Vendor Code',
            },
            {
                $Type : 'UI.DataField',
                Value : companyCode,
                Label : 'Company Code',
            },
            {
                $Type : 'UI.DataField',
                Value : purchOrg,
                Label : 'Purchase Organisation',
            },
            {
                $Type : 'UI.DataField',
                Value : purchGroup,
                Label : 'Purchase Group',
            },
        ],
    },
    UI.FieldGroup #PaymentDetails1 : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : bankName,
                Label : 'Bank Name',
            },
            {
                $Type : 'UI.DataField',
                Value : accNumber,
                Label : 'Account Number',
            },
            {
                $Type : 'UI.DataField',
                Value : accHoldersName,
                Label : 'Account Holders Name',
            },
            {
                $Type : 'UI.DataField',
                Value : ifscCode,
                Label : 'IFSC Code',
            },
            {
                $Type : 'UI.DataField',
                Value : branch,
                Label : 'Branch',
            },
            {
                $Type : 'UI.DataField',
                Value : dueDate,
                Label : 'Due Date',
            },
        ],
    },
    UI.LineItem #tableView6 : [
        {
            $Type : 'UI.DataField',
            Value : purchaseToCustomer.companyName,
            Label : 'Company Name',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseOrderId,
            Label : 'Purchase Order Id',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseEnquiryId,
            Label : 'Purchase Enquiry Id',
        },
    ],
    UI.SelectionPresentationVariant #tableView6 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView6',
            ],
            SortOrder : [
                {
                    $Type : 'Common.SortOrderType',
                    Property : soModifiedAt,
                    Descending : true,
                },
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'SO Pending',
                        },
                    ],
                },
            ],
        },
        Text : 'Pending Purchase Orders',
    },
    UI.LineItem #tableView7 : [
        {
            $Type : 'UI.DataField',
            Value : purchaseToCustomer.companyName,
            Label : 'Company Name',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseOrderId,
            Label : 'Purchase Order Id',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseEnquiryId,
            Label : 'Purchase Enquiry Id',
        },
    ],
    UI.SelectionPresentationVariant #tableView7 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView7',
            ],
            SortOrder : [
                {
                    $Type : 'Common.SortOrderType',
                    Property : soModifiedAt,
                    Descending : true,
                },
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'SO Pending',
                        },
                    ],
                },
            ],
        },
        Text : 'Pending Sales Orders',
    },
    UI.LineItem #tableView8 : [
        {
            $Type : 'UI.DataField',
            Value : purchaseToCustomer.companyName,
            Label : 'Company Name',
        },
        {
            $Type : 'UI.DataField',
            Value : salesOrderId,
            Label : 'Sales Order Id',
        },
        {
            $Type : 'UI.DataField',
            Value : status,
            Label : 'Status',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseOrderId,
            Label : 'purchaseOrderId',
        },
    ],
    UI.SelectionPresentationVariant #tableView8 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView8',
            ],
            SortOrder : [
                {
                    $Type : 'Common.SortOrderType',
                    Property : soModifiedAt,
                    Descending : true,
                },
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Sent for Release',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Waiting for Payment Confirmation',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Payment Confirmed',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Paid',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Credit Request',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Credit Approved',
                        },
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Payment Overdue',
                        },
                    ],
                },
            ],
        },
        Text : 'Sales Orders',
    },
    UI.FieldGroup #CustomerDetails : {
        $Type : 'UI.FieldGroupType',
        Data : [
        ],
    },
    UI.LineItem #tableView9 : [
        {
            $Type : 'UI.DataField',
            Value : purchaseOrderId,
            Label : 'Purchase Order Id',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseEnquiryId,
            Label : 'Purchase Enquiry Id',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseToCustomer.companyName,
            Label : 'Company Name',
        },
        {
            $Type : 'UI.DataField',
            Value : contactPerson,
            Label : 'Contact Person',
        },
    ],
    UI.SelectionPresentationVariant #tableView9 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView9',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Rejected',
                        },
                    ],
                },
            ],
        },
        Text : 'Rejected Orders',
    },
);

annotate service.EnquiryFiles with @(
    UI.LineItem #tableView : [
    ],
    UI.SelectionPresentationVariant #tableView : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : 'Table View EnquiryFiles',
    }
);

annotate service.PurchaseVehicle with @(
    UI.LineItem #VehicleDetails : [
        {
            $Type : 'UI.DataField',
            Value : materialCode,
            Label : 'Material Code',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleName,
            Label : 'Vehicle Name',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleColor,
            Label : 'Vehicle Color',
        },
        {
            $Type : 'UI.DataField',
            Value : quantity,
            Label : 'Quantity',
        },
        {
            $Type : 'UI.DataField',
            Value : pricePerUnit,
            Label : 'Price Per Unit',
        },
        {
            $Type : 'UI.DataField',
            Value : actualPrice,
            Label : 'Actual Price',
        },
        {
            $Type : 'UI.DataField',
            Value : band,
            Label : 'Band(%)',
        },
        {
            $Type : 'UI.DataField',
            Value : discount,
            Label : 'Discount',
        },
        {
            $Type : 'UI.DataField',
            Value : discountedPrice,
            Label : 'Discounted Price',
        },
        {
            $Type : 'UI.DataField',
            Value : taxPercentage,
            Label : 'Tax Percentage',
        },
        {
            $Type : 'UI.DataField',
            Value : totalPrice,
            Label : 'Total Price',
        },
    ],
    UI.LineItem #VehicleDetails1 : [
        {
            $Type : 'UI.DataField',
            Value : materialCode,
            Label : 'Vehicle Code',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleColor,
            Label : 'Vehicle Color',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleName,
            Label : 'Vehicle Name',
        },
        {
            $Type : 'UI.DataField',
            Value : quantity,
            Label : 'Quantity',
        },
    ],
    UI.LineItem #DeliveryDetails : [
        {
            $Type : 'UI.DataField',
            Value : materialCode,
            Label : 'Material Code',
        },
        {
            $Type : 'UI.DataField',
            Value : delId,
            Label : 'Delivery ID',
        },
        {
            $Type : 'UI.DataField',
            Value : preferredDelLocation,
            Label : 'Preferred Delivery Location',
        },
        {
            $Type : 'UI.DataField',
            Value : preferredDelDate,
            Label : 'Preferred Delivery Date',
        },
        {
            $Type : 'UI.DataField',
            Value : delLocation,
            Label : 'Delivery Location',
        },
        {
            $Type : 'UI.DataField',
            Value : plant,
            Label : 'Plant',
        },
    ],
    UI.PresentationVariant #VehicleDetails : {
        $Type : 'UI.PresentationVariantType',
        Visualizations : [
            '@UI.LineItem#VehicleDetails',
        ],
    },
);


annotate service.PurchaseOrder with {
    bankName @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    accNumber @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    accHoldersName @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    ifscCode @Common.FieldControl : #ReadOnly
};

annotate service.EnquiryVehicle with {
    vehicleName @Common.FieldControl : #ReadOnly
};

annotate service.EnquiryVehicle with {
    vehicleColor @Common.FieldControl : #ReadOnly
};

annotate service.EnquiryVehicle with {
    taxPercentage @Common.FieldControl : #ReadOnly
};

annotate service.EnquiryVehicle with {
    band @Common.FieldControl : #ReadOnly
};

annotate service.EnquiryVehicle with {
    pricePerUnit @Common.FieldControl : #ReadOnly
};

annotate service.EnquiryVehicle with {
    actualPrice @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with @(UI: {
    CreateHidden: true
});
annotate service.PurchaseOrder with @(UI: {
    CreateHidden: true
});

annotate service.EnquiryVehicle with @(UI: {
    CreateHidden: true,
    DeleteHidden: true
});

annotate service.PurchaseVehicle with @(UI: {
    CreateHidden: true,
    DeleteHidden: true
});

annotate service.PurchaseOrder with {
    branch @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    purchaseOrderId @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    quotationID @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    contactPerson @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    purchaseEnquiryId @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    division @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    distributionChannels @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    docType @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    salesOrderId @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    materialCode @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    vehicleName @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    vehicleColor @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    // partnerNumber @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    // partnerRole @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    quantity @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    pricePerUnit @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    actualPrice @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    band @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    discount @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    discountedPrice @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    taxPercentage @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    totalPrice @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    preferredDelDate @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    preferredDelLocation @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    salesOrg @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    totalPrice @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    taxAmount @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    grandTotal @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    delId @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseVehicle with {
    plant @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    vendorCode @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    companyCode @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    purchOrg @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseOrder with {
    purchGroup @Common.FieldControl : #ReadOnly
};

annotate service.EnquiryPartners with @(
    UI.LineItem #Partners : [
        
    ],
    UI.PresentationVariant #Partners : {
        $Type : 'UI.PresentationVariantType',
        Visualizations : [
            '@UI.LineItem#Partners',
        ],
        SortOrder : [
            {
                $Type : 'Common.SortOrderType',
                Property : partnerRole,
                Descending : true,
            },
        ],
    },
);

annotate service.PurchasePartners with @(
    UI.LineItem #Partners : [
        {
            $Type : 'UI.DataField',
            Value : partnerNumber,
            Label : 'Partner Number',
        },
        {
            $Type : 'UI.DataField',
            Value : partnerName,
            Label : 'Partner Name',
        },
    ],
    UI.PresentationVariant #Partners : {
        $Type : 'UI.PresentationVariantType',
        Visualizations : [
            '@UI.LineItem#Partners',
        ],
        SortOrder : [
            {
                $Type : 'Common.SortOrderType',
                Property : partnerRole,
                Descending : true,
            },
        ],
    },
);

annotate service.PurchasePartners with {
    partnerNumber @Common.FieldControl : #ReadOnly
};

annotate service.PurchasePartners with {
    partnerRole @Common.FieldControl : #ReadOnly
};


annotate service.PurchasePartners with @(UI: {
    CreateHidden: true,
    DeleteHidden: true
});

annotate service.EnquiryPartners with @(UI: {
    CreateHidden: true,
    DeleteHidden: true
});


annotate service.PurchasePartners with {
    partnerName @Common.FieldControl : #ReadOnly
};

