const { update } = require('@sap/cds');
const cds = require('@sap/cds');
const { select } = require('@sap/cds/libx/_runtime/hana/execute');
const axios = require('axios');
const { debug } = require('console');
const { nextTick, addListener } = require('process');
const { jsPDF } = require("jspdf");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { jwtDecode } = require('jwt-decode')
const { json, response } = require('express');
const { getDestination } = require('@sap-cloud-sdk/connectivity');
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');
var UUid, userEmailId = 'pradeep.n@peolsolutions.com';

const Razorpay = require("razorpay");
const { constants } = require('module');

module.exports = async function (params, srv) {

    let { PurchaseEnquiry, EnquiryVehicle, Customer, EnquiryFiles, EnquiryComments, PurchaseOrder, PurchaseVehicle, PurchaseComments, VehicleInventory, SH, PurchasePartners, EnquiryPartners} = this.entities;
   
    //Dhanush Gangatkar
    function getXsuaaAuth() {
        return {
            clientid:process.env.clientid,
            clientsecret:process.env.clientsecret,
            xsuaaauthurl:process.env.xsuaaauthurl,
            userid:process.env.userid,
            userpassword:process.env.userpassword
        }
    }

    this.before('CREATE', PurchaseEnquiry, async (req, next) => {
        try {
            let custData= await SELECT.from(Customer).where({customerId:req.data.customerId});
            req.data.enquiryToPartners = [
                {partnerRole:'SP',partnerNumber:custData[0].sapCustomerId,partnerName:custData[0].name},
                {partnerRole:'SH',partnerNumber:custData[0].sapCustomerId,partnerName:custData[0].name},
                {partnerRole:'PY',partnerNumber:custData[0].sapCustomerId,partnerName:custData[0].name},
                {partnerRole:'BP',partnerNumber:custData[0].sapCustomerId,partnerName:custData[0].name}
            ];
        } catch (error) {
            console.log(error);
        }
    })
    this.on("getPartnersSh",async (req)=>{
        try {
            let conditionsBody = JSON.parse(req.data.paramaters);
            var abapDest = await cds.connect.to("ABAP_Destinations");
            let res =await abapDest.get(`/sap/Z_SALES_PARTNERS_16_SRV/Get_Partners?salesOrg='${conditionsBody.salesOrg}'&distributionChnl='${conditionsBody.distributionChannels}'&division='${conditionsBody.division}'`);
            // let res =Fthi [
            //     { partnerNumber: '001', partnerName: 'name1' },
            //     { partnerNumber: '002', partnerName: 'name2' },
            //     { partnerNumber: '003', partnerName: 'name3' },
            //     { partnerNumber: '004', partnerName: 'name4' }
            //   ];
            return JSON.stringify(res);
        } catch (error) {
            console.log(error)
        }
    })
    this.on("getVehiclesSh",async (req)=>{
        try {
            let conditionsBody = JSON.parse(req.data.paramaters);
            var abapDest = await cds.connect.to("ABAP_Destinations");
            let res =await abapDest.get(`/sap/Z_SALES_PARTNERS_16_SRV/Get_Vehicles?salesOrg='${conditionsBody.salesOrg}'&distributionChnl='${conditionsBody.distributionChannels}'`);
            // let res = [
            //     { partnerNumber: '001', partnerName: 'name1' },
            //     { partnerNumber: '002', partnerName: 'name2' },
            //     { partnerNumber: '003', partnerName: 'name3' },
            //     { partnerNumber: '004', partnerName: 'name4' }
            //   ];
            return JSON.stringify(res);
        } catch (error) {
            console.log(error)
        }
    })

    
    //Dhanush Gangatkar

    this.on('SalesOrvalue', async (req) => {

        // if(req.data.SalesOrg && req.data.Division && req.data.DistChan && req.data.Doctype){ 
        var sal2 = await SELECT.one.from(SH).where({ sHId: req.data.SalesOrg });
        var div2 = await SELECT.one.from(SH).where({ sHId: req.data.Division });
        var discha2 = await SELECT.one.from(SH).where({ sHId: req.data.DistChan });
        var doctyp2 = await SELECT.one.from(SH).where({ sHId: req.data.Doctype });

        if (sal2 && div2 && discha2 && doctyp2) {



            let s1 = sal2.sHDescription;
            let s2 = div2.sHDescription;
            let s3 = discha2.sHDescription;
            let s4 = doctyp2.sHDescription;
            let values = [s1, s2, s3, s4];
            console.log(values);
            return values;

        }
    });
    this.on('purchaseOrg', async (req) => {
        debugger
        if(req.data.vendorCode && req.data.companyCode){
            var status = await SELECT.from(SH).where({ sHId2 : req.data.companyCode,sHDescription :req.data.vendorCode });
            return status;
        }   
    })

    this.on('statusFun', async (req) => {
        debugger
        var status;
        var draft;
        var decoded;
        var minDate; 
        var vehicles;
        if (req.data.state === 'PE') {
            status = await SELECT.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });
            vehicles = await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });

        }
        else if (req.data.state === 'PO') {
            vehicles = await SELECT.from(PurchaseVehicle).where({ purchaseOrderUuid: req.data.purchaseEnquiryUuid });
            status = await SELECT.from(PurchaseOrder).where({ purchaseOrderUuid: req.data.purchaseEnquiryUuid });
            draft = await SELECT.one.from(PurchaseOrder.drafts).where({ purchaseOrderUuid: req.data.purchaseEnquiryUuid });
            console.log('pradeep',draft);
            var minDates = await SELECT('delDate').from(PurchaseVehicle.drafts).where({ purchaseOrderUuid: req.data.purchaseEnquiryUuid });
            console.log('min', minDates)
            minDate = new Date( Math.min( ...minDates?.map(obj => new Date(obj.delDate).getTime()) ) );
            console.log('minDate',minDate);
        }

        if (status && req.data.purchaseEnquiryUuid || req.data.purchaseOrderUuid) {

            UUid = req.data.purchaseEnquiryUuid;

            var sal2 = await SELECT.one.from(SH).where({ sHId: status[0].salesOrg });
            var div2 = await SELECT.one.from(SH).where({ sHId2: status[0].division });
            var discha2 = await SELECT.one.from(SH).where({ sHId2: status[0].distributionChannels });
            var doctyp2 = await SELECT.one.from(SH).where({ sHId: status[0].docType });

            status[0].docType = doctyp2 ? `${status[0].docType} (${doctyp2.sHDescription})` : status[0].docType;
            status[0].salesOrg = sal2 ? `${status[0].salesOrg} (${sal2.sHDescription})` : status[0].salesOrg;
            status[0].division = div2 ? `${status[0].division} (${div2.sHDescription2})` : status[0].division;
            status[0].distributionChannels = discha2 ? `${status[0].distributionChannels} (${discha2.sHDescription2})` : status[0].distributionChannels;

            let auth = req?.headers?.authorization;
            if (auth != undefined) {
                let token = auth.split(" ");
                decoded = jwtDecode(token[1]);
                //console.log('jwt token', decoded);
            }

            priceDetail1 = await TempTotal(req.data.purchaseEnquiryUuid);

            var res = {
                result: status[0],
                veh: vehicles,
                roles: decoded,
                draftStatus: draft ? true : false,
                minDelDate : minDate,
                priceDetails : priceDetail1
            }
            return res;
        }
    });

    async function TempTotal(peUuid) { 
        const vehicles = await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryUuid: peUuid });
        var grandtotal =0;
        var totaltax = 0;
        var total = 0;
        for (const vehicle of vehicles) {
            debugger	 
            var bandvalue =  vehicle.band.match(/\(([^)]+)\)/);
            var band =  parseFloat(bandvalue[1].replace("%", ""));
            var discount = vehicle.mDiscount;
            //var banddiscount = parseFloat(vehicle.actualPrice) * ( (100 - band) / 100);
            var totaldiscount
            if (discount.includes('%')) {
                discount = parseFloat(discount.replace("%", ""));
                var dis = discount + band;
                totaldiscount = parseFloat(vehicle.actualPrice) * ( (100 - dis) / 100);
                
            } else {
                discount = parseFloat(discount);
                var banddiscount = parseFloat(vehicle.actualPrice) * ( (100 - band) / 100);
                totaldiscount = banddiscount - discount;
            }
            total = total + totaldiscount;
            var grand = totaldiscount + ( totaldiscount * ( parseFloat(vehicle.taxPercentage )) /100 );
             grandtotal = grandtotal + grand;
             totaltax = totaltax + ( totaldiscount * ( parseFloat(vehicle.taxPercentage )) /100 )
        }

        const priceDetails = {
            "total" : total.toFixed(2).toString(),
		    "totaltax" : totaltax.toFixed(2).toString(),
		    "grandtotal" : grandtotal.toFixed(2).toString()
        }
        return priceDetails;
    }

    async function Total(vdata) {
        debugger
        let totalPrice = 0;
        let totalTax = 0;
        if (vdata) {
            for (const vehicle of vdata) {
                debugger
                if (vehicle.materialCode && vehicle.materialCode != null) {
                    var stockData = await SELECT.from(VehicleInventory).where({ vehicleCode: vehicle.materialCode });
                    if (vehicle.discountedPrice == vehicle.actualPrice) {
                        totalPrice += parseFloat(vehicle.actualPrice) || 0;
                        // const taxAmount = (parseFloat(stockData[0].pricePerUnit) * (stockData[0].taxPercentage) / 100) * (parseInt(vehicle.quantity) || 0);
                        const taxAmount = parseFloat(vehicle.totalPrice) - parseFloat(vehicle.discountedPrice);
                        totalTax += taxAmount;
                    } else {
                        if (vehicle.discountedPrice && vehicle.totalPrice) {
                            totalPrice += parseFloat(vehicle.discountedPrice) || 0;
                            // const taxAmount = (parseFloat(vehicle.discountedPrice) * (stockData[0].taxPercentage) / 100);
                            const taxAmount = parseFloat(vehicle.totalPrice) - parseFloat(vehicle.discountedPrice);
                            totalTax += taxAmount;
                        }
                    }
                }
            }
            var grandtotal1 = totalPrice + totalTax;

            await cds.update(PurchaseEnquiry).set({
                totalAmount: totalPrice.toFixed(2).toString(),
                taxAmount: totalTax.toFixed(2).toString(),
                grandTotal: grandtotal1.toFixed(2).toString(),
            }).where({ purchaseEnquiryUuid: vdata[0].purchaseEnquiryUuid })
        }
    }

    this.on('quotationFun', async (req) => {
        debugger
        var flag = 0;

        const LoadingStatus = await SELECT.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.data.peUuid });
        const VehicleData = await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryUuid: req.data.peUuid });
        const partners = await SELECT.from(EnquiryPartners).where({ purchaseEnquiryUuid: req.data.peUuid });
        debugger
        var grandtotal =0;
		var totaltax = 0;
		var total = 0;
        for(const vehicle of VehicleData ) {
            debugger
            await cds.update(EnquiryVehicle).set({ discount: vehicle.mDiscount }).where({ vehicleId: vehicle.vehicleId });
            total = total + parseFloat(vehicle.discountedPrice);
            grandtotal = grandtotal + parseFloat(vehicle.totalPrice);
            totaltax= totaltax + ( total * ( parseFloat(vehicle.taxPercentage )) /100 );
            
          }         
        await cds.update(PurchaseEnquiry).set({ grandTotal: grandtotal.toFixed(2).toString(),taxAmount: totaltax.toFixed(2).toString(),totalAmount: total.toFixed(2).toString()}).where({ purchaseEnquiryUuid: req.data.peUuid });	       
        if (LoadingStatus && req.data.value === 'send') {
            var { totalAmount, grandTotal, taxAmount } = LoadingStatus[0];

            var missingFields = [];
            if (!totalAmount || totalAmount == 0) missingFields.push('Total Price');
            if (!grandTotal || grandTotal == 0) missingFields.push('grand Total');
            if (!taxAmount || taxAmount == 0) missingFields.push('Tax');
            // if (missingFields.length > 0) {
            //     var result = (`The following fields are missing: ${missingFields.join(', ')}`);
            //     return result; // Stop further processing
            // }
            if (LoadingStatus[0].status == 'Request') {
                const payload2 = {
                    "DocType": 'AG',
                    "SalesOrg": LoadingStatus[0]?.salesOrg,
                    "DistChan": LoadingStatus[0]?.distributionChannels,
                    "Division": LoadingStatus[0]?.division,
                    "qt_itemSet": VehicleData
                        .filter(item => item.itemNo && item.materialCode && item.quantity) // Exclude items with null/undefined values
                        .map(item => ({
                            "ItemNumber": item.itemNo,
                            "Material": item.materialCode,
                            "Quantity": String(item.quantity)
                        })),
                    "qt_partnerSet": partners
                        .filter(item3 => item3.partnerRole && item3.partnerNumber) // Exclude items with null/undefined values
                        .map(item3 => ({
                            "PartRole": item3.partnerRole,
                            "PartNumber": item3.partnerNumber
                        }))
                };
                console.log('quotation payload',payload2)
                const link2 = '/sap/ZOD_PO_GENERATE_SRV/qt_headerSet';
                const response1 = await postSalesOrderData(payload2, link2);

                console.log('Quotation Id ', response1.d.QtNumber);
                if (response1.d.QtNumber) {
                    const updatedRos2 = await UPDATE(PurchaseEnquiry)
                        .set({
                            status: 'In Process',
                            quotationId: response1.d.QtNumber
                        })
                        .where({ purchaseEnquiryUuid: req.data.peUuid });
                }
                const commentText = `${LoadingStatus[0].purchaseEnquiryId} - Quotation Received`;

                await AddNotification(req.data.peUuid, LoadingStatus[0].customerId, commentText);

            } else if (LoadingStatus[0].status == 'Negotiation') {
                await cds.update(PurchaseEnquiry).set({ status: 'In Process' }).where({ purchaseEnquiryUuid: UUid });
                const commentText = `${LoadingStatus[0].purchaseEnquiryId} - Negotiated Quotation`;

                await AddNotification(req.data.peUuid, LoadingStatus[0].customerId, commentText);

                // await cds.update(PurchaseEnquiry).set({ status: 'In Process' }).where({ purchaseEnquiryUuid: UUid });
                // const values = {
                //     purchaseEnquiryUuid: LoadingStatus[0].purchaseEnquiryUuid,
                //     customerId: LoadingStatus[0].customerId,
                //     commentsText: ` ${LoadingStatus[0].purchaseEnquiryId} - Negotiated Quotation`
                // }
                // await INSERT.into(EnquiryComments).entries(values);
            }
            return 'success';
        }
    });

    this.before('DELETE', PurchaseEnquiry, async (req) => {
        debugger
        // await cds.delete.from(EnquiryFiles).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });
        await DELETE.from(EnquiryFiles).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });

    });

    this.before('UPDATE', EnquiryPartners, async (req) => { 
        // abap validation
        console.log(req.data);
        if(req.data.partnerNumber ){
            console.log('inside 1st');
            const partners = await SELECT.one.from(EnquiryPartners).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });
            const enquiry = await SELECT.one.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });
            var abapDest = await cds.connect.to("ABAP_Destinations");
            let res =await abapDest.get(`/sap/Z_SALES_PARTNERS_16_SRV/Get_Partners?salesOrg='${enquiry.salesOrg}'&distributionChnl='${enquiry.distributionChannels}'&division='${enquiry.division}'`);
            console.dir(res, { depth: null }); //to the the structure of an object in depth(Nested structures)
            if(!res.some(partner => partner.partnerNumber === req.data.partnerNumber)){
                return req.reject(400, `Partner ${req.data.partnerNumber} does not exists in selected sales area`);
            }
        } else if(req.data.partnerRole === 'SP' && ( req.data.partnerNumber === null || req.data.partnerNumber === '' || !req.data.partnerNumber)){
            console.log('inside 2nd');
            return req.reject(400, `Partner Role SP (Sold-to-party) is mandatory`);
        }
        
        // abap validation
    });

    this.before('UPDATE', PurchaseEnquiry, async (req) => {
        console.log('before update');
        
        console.dir(req, { depth: null });
        // abap validation
        if(req.data.salesOrg || req.data.distributionChannels || req.data.division){
            const purchaseenquiry = await SELECT.one.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });
            const salOrg = req.data.salesOrg || purchaseenquiry.salesOrg;
            const div = req.data.division || purchaseenquiry.division;
            const distChnl = req.data.distributionChannels || purchaseenquiry.distributionChannels;
            if(salOrg && div && distChnl) {
                const shdistchannel = await SELECT.one.from(SH).where({ sHField: 'Sales Organisation', sHId: salOrg, sHField2: 'Distribution Channel', sHId2: distChnl});
                const shDivision = await SELECT.one.from(SH).where({ sHField: 'Sales Organisation', sHId: salOrg, sHField2: 'Division', sHId2: div });
                if(!shdistchannel) return req.reject(400, "The selected distribution channel is not associated with the chosen sales organization.");
                if(!shDivision) return req.reject(400, "The selected division is not associated with the chosen sales organization.");
            }
        }
        if(req.data.docType && req.data.docType !== 'AF') return req.reject(400, "Document type should be AF for Inquiry.");
        // abap validation

        if (req.data.status === 'Create Request') {
            
            // var purchaseenquiry  = await SELECT.one.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });      
            const vehicles = await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });
            const purchaseenquiry = await SELECT.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });

            const partners = await SELECT.from(EnquiryPartners).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });
            const payload = {
                "DocType": 'AF',
                "SalesOrg": purchaseenquiry[0]?.salesOrg || '',
                "DistChan": purchaseenquiry[0]?.distributionChannels || '',
                "Division": purchaseenquiry[0]?.division || '',
                "inq_itemSet": vehicles
                    .filter(item => item.materialCode) // Exclude items with null/undefined values
                    .map(item => ({
                        "Material": item.materialCode
                    })),
                "inq_partnerSet": partners
                    .filter(item3 => item3.partnerRole && item3.partnerNumber) // Exclude items with null/undefined values
                    .map(item3 => ({
                        "PartRole": item3.partnerRole,
                        "PartNumber": item3.partnerNumber
                    }))
            };
            console.log('ABAP CALL Payload', payload);
            const link = '/sap/ZOD_PO_GENERATE_SRV/inq_headerSet';
            var post = await postSalesOrderData(payload, link);
            if(post.d.inq_itemSet) {
                console.log('bikram', post.d.inq_itemSet);
                for(const item of post.d.inq_itemSet.results){
                    console.log('item', item);
                    await cds.update(EnquiryVehicle).set({ itemNo : item.ItemNumber }).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid, materialCode : item.Material });
                }
            }

            console.log('Purchase Enquiry Id', post.d.InqNumber);
            if (post.d.InqNumber) {
                req.data.purchaseEnquiryId = post.d.InqNumber
            }
            
        }
        if (req.data.status === 'Negotiation') {

            console.log("CommentsTextNegotiation");
            var purchaseEnquiry = await SELECT.one.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });

            if (purchaseEnquiry.status === 'In Process') {
                // if (req.data.commentsText) {
                const newComment = {
                    purchaseEnquiryUuid: req.data.purchaseEnquiryUuid,
                    commentsText: purchaseEnquiry.commentsText,
                    user: 'C'
                };
                await INSERT.into(EnquiryComments).entries(newComment);
                await cds.update(PurchaseEnquiry).set({ commentsText: null }).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });
                // req.data.commentsText = null;
                console.log('Approved comments inserted');
                //}
            }
            const enquiryVehicles = await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });
            enquiryVehicles.forEach(async veh => {
                await cds.update(EnquiryVehicle).set({mDiscount:veh.discount}).where({vehicleId : veh.vehicleId})
                console.log(`danush`,veh);
            });
            // Check if all vehicles have the band as 'platinum'
            const allPlatinum = enquiryVehicles.every(vehicle => vehicle.band === `Platinum(${vehicle.discount}`);
            if (allPlatinum) {
                console.log("All are platinum, you cannot enter the discount");
            } else {
                console.log("Some vehicles are not platinum, discount can be entered.");
            }
        } else if (req.data.status === 'Approved') {

            var purchaseEnquiry = await SELECT.one.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });
            const newComment = {
                purchaseEnquiryUuid: req.data.purchaseEnquiryUuid,
                commentsText: purchaseEnquiry.commentsText,
                user: 'C'
            };
            if (purchaseEnquiry.commentsText) {
                await INSERT.into(EnquiryComments).entries(newComment);
                req.data.commentsText = null;
            }

            const enquiryData = await SELECT.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });
            const LoadingStatus = await SELECT.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });
            const custdata = await SELECT.from(Customer).where({ customerId: LoadingStatus[0].customerId });
            const VehicleData = await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });
            // let PoId;

            const payload1 = {
                comp_code: LoadingStatus[0]?.companyCode || '1000',
                doc_type: 'NB',
                vendor: LoadingStatus[0]?.vendorCode || '1000',
                purch_org: LoadingStatus[0]?.purchOrg || '1000',
                pur_group: LoadingStatus[0]?.purchGroup || '001',
                po_itemSet: VehicleData
                    .filter(item => item.itemNo && item.materialCode && item.plant && item.quantity && item.totalPrice) // Exclude null/undefined
                    .map(item => ({
                        po_item_no: item.itemNo,
                        material: item.materialCode,
                        plant: item.plant,
                        quantity: String(item.quantity),
                        net_price: String(item.totalPrice)
                    }))
            };
            console.log('Items', payload1);
            const link1 = '/sap/Z_ODATA_CREATE_PO_22_SRV/po_headerSet';
            const response = await postSalesOrderData(payload1, link1);
            console.log('Purchase order Id', response.d.po);

            if (enquiryData) {
                debugger
                const purchaseEnquiry = enquiryData[0];
                const purchaseOrderData = {
                    purchaseOrderUuid: cds.utils.uuid(),
                    purchaseOrderId: response.d.po,
                    customerId: purchaseEnquiry.customerId,
                    deliveryLocation: purchaseEnquiry.deliveryLocation,
                    contactPerson: purchaseEnquiry.contactPerson,
                    division: purchaseEnquiry.division,
                    distributionChannels: purchaseEnquiry.distributionChannels,
                    purchaseEnquiryId: purchaseEnquiry.purchaseEnquiryId,
                    totalAmount: purchaseEnquiry.totalAmount,
                    taxAmount: purchaseEnquiry.taxAmount,
                    grandTotal: purchaseEnquiry.grandTotal,
                    quotationID: purchaseEnquiry.quotationId,
                    commentsText: '',
                    status: 'Approved',
                    docType: purchaseEnquiry.docType,
                    salesOrg: purchaseEnquiry.salesOrg,
                    purchOrg: purchaseEnquiry.purchOrg,
                    purchGroup: purchaseEnquiry.purchGroup,
                    vendorCode:purchaseEnquiry.vendorCode,
                    companyCode:purchaseEnquiry.companyCode,
                    soModifiedAt: new Date(),
                    purchaseToCustomer: { customerId: purchaseEnquiry.customerId }
                };
                var POder = await INSERT.into(PurchaseOrder).entries(purchaseOrderData);
                const purchaseVehicleData = [];
                const enquiryVehicles = await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryUuid: purchaseEnquiry.purchaseEnquiryUuid });
                if (enquiryVehicles && enquiryVehicles.length != 0) {
                    for (const vehicle of enquiryVehicles) {
                        purchaseVehicleData.push({
                            vehicleID: cds.utils.uuid(),
                            purchaseOrderUuid: purchaseOrderData.purchaseOrderUuid,
                            materialCode: vehicle.materialCode,
                            vehicleName: vehicle.vehicleName,
                            vehicleColor: vehicle.vehicleColor,
                            quantity: vehicle.quantity,
                            band: vehicle.band,
                            pricePerUnit: vehicle.pricePerUnit,
                            taxPercentage: vehicle.taxPercentage,
                            actualPrice: vehicle.actualPrice,
                            totalPrice: vehicle.totalPrice,
                            discount: vehicle.discount,
                            mDiscount: vehicle.discount,
                            discountedPrice: vehicle.discountedPrice,
                            itemNo: vehicle.itemNo,
                            plant: vehicle.plant,
                            preferredDelLocation: vehicle.preferredDelLocation,
                            preferredDelDate: vehicle.preferredDelDate
                        });
                    }
                    if (purchaseVehicleData) {
                        await INSERT.into(PurchaseVehicle).entries(purchaseVehicleData);
                    }
                }

                const purchaseCommentData = [];
                debugger
                const enquiryComments = await SELECT.from(EnquiryComments).where({ purchaseEnquiryUuid: purchaseEnquiry.purchaseEnquiryUuid });
                console.log('enquiry comments', enquiryComments);
                if (enquiryComments.length > 0) {
                enquiryComments.map((comment) => {
                    comment.purchaseOrderUuid = purchaseOrderData.purchaseOrderUuid;
                });
                
                    await INSERT.into(PurchaseComments).entries(enquiryComments);
                }

                const partners = await SELECT.from(EnquiryPartners).where({ purchaseEnquiryUuid: purchaseEnquiry.purchaseEnquiryUuid });
                if(partners.length > 0) {
                    partners.map((partner) => {
                        partner.purchaseOrderUuid = purchaseOrderData.purchaseOrderUuid;
                    });
                    await INSERT.into(PurchasePartners).entries(partners);
                }
                
                await cds.update(EnquiryFiles).set({ purchaseOrderUuid: purchaseOrderData.purchaseOrderUuid }).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });

                //Divya's FlowEnquiry
                var poData1 = await SELECT.from(PurchaseOrder).where({ purchaseOrderUuid: purchaseOrderData.purchaseOrderUuid });
                var cust = await SELECT.from(Customer).where({ customerId: poData1[0].customerId });
                var veh = await SELECT.from(PurchaseVehicle).where({ purchaseOrderUuid: purchaseOrderData.purchaseOrderUuid });
                const vehicleDetails = JSON.stringify(veh);
                const comments = await SELECT.from(PurchaseComments).where({ purchaseOrderUuid: purchaseOrderData.purchaseOrderUuid });
                var commentDetails = JSON.stringify(comments);

                var divdescription = await SELECT.one.from(SH).where({ sHId2: poData1[0].division, sHField2: 'Division' });
                var div = poData1[0].division + "(" + divdescription.sHDescription2 + ")";

                var distdescription = await SELECT.one.from(SH).where({ sHId2: poData1[0].distributionChannels, sHField2: 'Distribution Channel'});
                var dischnl = poData1[0].distributionChannels + "(" + distdescription.sHDescription2 + ")";
                
                var salesorgdescription = await SELECT.one.from(SH).where({ sHId: poData1[0].salesOrg, sHField: 'Sales Organisation' });
                var doctypedescription = await SELECT.one.from(SH).where({ sHId: poData1[0].docType, sHField: 'Document Type' });
                var doc = poData1[0].docType + "(" + doctypedescription.sHDescription + ")" ;
                var sorg = poData1[0].salesOrg + "(" + salesorgdescription.sHDescription + ")" ;
                debugger

                // const oauthToken = await getOAuthToken2();
                // const token = `Bearer ${oauthToken}`;
                const Auth = getXsuaaAuth();
                console.log('Authorization divya', Auth);
                const sAuth = JSON.stringify(Auth);

                var workflowContent = {

                    "definitionId": "us10.44f10b5ftrial.purchaseorder.purchaseOrder_Process",
                    "context": {
                        "poid": poData1[0].purchaseOrderId || '',
                        "companyname": cust[0].companyName || '',
                        "contactperson": poData1[0].contactPerson || '',
                        "phonenumber": cust[0].phone || '',
                        "emailaddress": cust[0].email || '',
                        "van": cust[0].van || '',
                        "address": cust[0].address || '',
                        "documenttype": doc || '',
                        "salesorg": sorg || '',
                        "distributionchannel": dischnl || '',
                        "division": div || '',
                        "vechiclelink": vehicleDetails,
                        "commentlink": commentDetails || '',
                        "pouuid": poData1[0].purchaseOrderUuid || '',
                        "jobtitle": cust[0].jobTitle || '',
                        "department": cust[0].department || '',
                        "taxid": cust[0].taxId || '',
                        "currency": cust[0].Currency || '',
                        "language": cust[0].Language || '',
                        "country": cust[0].Country || '',
                        "city": cust[0].City || '',
                        "street": cust[0].Street || '',
                        "namee": cust[0].name || '',
                        "postalcode": cust[0].postalCode || '',
                        "location": cust[0].location || '',
                        "taxamount": poData1[0].taxAmount || '',
                        "grandtotal": poData1[0].grandTotal || '',
                        "totalprice": poData1[0].totalAmount || '',
                        "companycode": poData1[0].companyCode || '',
                        "purchgroup": poData1[0].purchGroup || '',
                        "purchorg": poData1[0].purchOrg || '',
                        "vendorcode": poData1[0].vendorCode || '',
                        "_sapcustomerid": cust[0].sapCustomerId || '',
                        "baseurl": sAuth || ""
                    }
                };
                console.log('PO flow data',workflowContent);

                var BPA_Trigger = await cds.connect.to("BPA_Trigger");
                var result = await BPA_Trigger.post('/workflow/rest/v1/workflow-instances', workflowContent);
                console.log(result);
            }
        }
        // console.log("return", req.data)
        return req;
    });

    this.after('UPDATE', PurchaseEnquiry, async (req) => {
        debugger;

        if (req.status === 'Request') {
            const vdata = await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryUuid: req.purchaseEnquiryUuid });
            debugger
            if (vdata.length > 0) {
                await Total(vdata);
            }
        }
        console.log("patch call after");
        if (req.status === 'Create Request') {

            var purchaseEnquiry = await SELECT.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.purchaseEnquiryUuid });
            // var purchaseEnquirydraft = await SELECT.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.purchaseEnquiryUuid });

            var cust = await SELECT.from(Customer).where({ customerId: purchaseEnquiry[0].customerId });
            var veh = await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryUuid: req.purchaseEnquiryUuid });
            const vehicleDetails = JSON.stringify(veh);
            
            // var comments =await SELECT.from(EnquiryVehicle).where({ purchaseEnquiryUuid: req.purchaseEnquiryUuid });
            console.log('Prince', purchaseEnquiry[0].purchaseEnquiryId);
            
            if (purchaseEnquiry[0].commentsText) {
                const newComment = {
                    commentId: cds.utils.uuid(),
                    purchaseEnquiryUuid: req.purchaseEnquiryUuid,
                    commentsText: purchaseEnquiry[0].commentsText,
                    user: 'C'
                };
                await INSERT.into(EnquiryComments).entries(newComment);
                await UPDATE(PurchaseEnquiry).set({ commentsText: null }).where({ purchaseEnquiryUuid: req.purchaseEnquiryUuid });
                console.log('comments insert');
            }
            // prince's flow

            const comments = await SELECT.from(EnquiryComments).where({ purchaseEnquiryUuid: req.purchaseEnquiryUuid });
            var commentDetails = JSON.stringify(comments);
            
            var divdescription = await SELECT.one.from(SH).where({ sHId2: purchaseEnquiry[0].division, sHField2: 'Division' });
            var div = divdescription.sHDescription2 ? purchaseEnquiry[0].division + "(" + divdescription.sHDescription2 + ")" : purchaseEnquiry[0].division;

            var distdescription = await SELECT.one.from(SH).where({ sHId2: purchaseEnquiry[0].distributionChannels, sHField2: 'Distribution Channel' });
            var dischnl = distdescription.sHDescription2 ? purchaseEnquiry[0].distributionChannels + "(" + distdescription.sHDescription2 + ")" : purchaseEnquiry[0].distributionChannels;
            
            var salesorgdescription = await SELECT.one.from(SH).where({ sHId: purchaseEnquiry[0].salesOrg, sHField: 'Sales Organisation' });
            var doctypedescription = await SELECT.one.from(SH).where({ sHId: purchaseEnquiry[0].docType, sHField: 'Document Type' });
            var doc = doctypedescription.sHDescription ?  purchaseEnquiry[0].docType + "(" + doctypedescription.sHDescription + ")" : purchaseEnquiry[0].docType;
            var sorg = salesorgdescription.sHDescription ? purchaseEnquiry[0].salesOrg + "(" + salesorgdescription.sHDescription + ")" : purchaseEnquiry[0].salesOrg;
            debugger

            // const oauthToken = await getOAuthTokenCR();
            // const token = `Bearer ${oauthToken}`;
            const Auth = getXsuaaAuth();
            console.log('Authorization Prince', Auth);
            const sAuth = JSON.stringify(Auth);
            var workflowData = {
                "definitionId": "us10.44f10b5ftrial.enquiry.enquiryFlow",
                "context": {
                    "purchaseenquiryid": purchaseEnquiry[0]?.purchaseEnquiryId || "",
                    "contactperson": purchaseEnquiry[0]?.contactPerson || "",
                    "customerid": cust[0]?.sapCustomerId || "",
                    "division": div || "",
                    "companyname": cust[0]?.companyName || "",
                    "address": cust[0]?.address || "",
                    "contactnumber": cust[0]?.phone || "",
                    "email": cust[0]?.email || "",
                    "van": cust[0]?.van || "NA",
                    "salesorg": sorg || "",
                    "documenttype": doc || "",
                    "distributionChannel": dischnl || "",
                    "puuid": purchaseEnquiry[0]?.purchaseEnquiryUuid || "",
                    "commentlink": commentDetails || '',
                    "jobtitle": cust[0]?.jobTitle || "",
                    "department": cust[0]?.department || "",
                    "taxid": cust[0]?.taxId || "",
                    "currency": cust[0]?.Currency || "",
                    "language": cust[0]?.Language || "",
                    "country": cust[0]?.Country || "",
                    "city": cust[0]?.City || "",
                    "street": cust[0]?.Street || "",
                    "postalcode": cust[0]?.postalCode || "",
                    "location": cust[0]?.location || "",
                    "link": vehicleDetails,
                    "vendorcode": purchaseEnquiry[0]?.vendorCode || "",
                     "baseurl": sAuth || ""
                    
                }
            };
            console.log('Enquiry Flow data', workflowData);
            
            var BPA_Trigger = await cds.connect.to("BPA_Trigger");
            var result = await BPA_Trigger.post('/workflow/rest/v1/workflow-instances', workflowData);
            console.log(result);
            debugger
        }
        return req;
    });

    this.before('UPDATE', PurchaseOrder, async (req) => { 
        debugger
        if(req.data.dueDate){
            var minDates = await SELECT('delDate').from(PurchaseVehicle.drafts).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });
            console.log('min', minDates)
            var minDate = new Date( Math.min( ...minDates?.map(obj => new Date(obj.delDate).getTime()) ) );
            console.log('minDate',minDate);
            if(minDate <= new Date(req.data.dueDate) || new Date(req.data.dueDate) <= new Date()){
                req.reject(400, 'Please enter proper due date');
            }
        }
    });

    this.before('UPDATE', PurchaseOrder, async (req) => {
        if (req.data.status === 'Credit Approved') {
            var purchase = await SELECT.one.from(PurchaseOrder).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });
            var cust = await SELECT.from(Customer).where({ customerId: purchase.customerId });
            const payload = {
                purchaseEnquiryUuid: req.data.purchaseOrderUuid,
                customerId: purchase.customerId,
                commentsText: `${purchase.purchaseOrderId} - Credit Request Approved`
            }
            const result = await INSERT.into(EnquiryComments).entries(payload);

            const discount1 = (parseFloat(purchase.grandTotal) - parseFloat(purchase.taxAmount) ) - parseFloat(purchase.totalAmount);
            console.log("discount12", discount1 );

            const paymentDetails = {
                customer: {
                    name: cust.name || 'John Doe',
                    email: cust.email || 'john.doe@example.com',
                    phone: cust.phone || '123-456-7890'
                },
                grandTotal: {
                    subtotal: parseFloat(purchase.totalAmount) || 59000.00,
                    tax: parseFloat(purchase.taxAmount) || 5900.00,
                    discount: 500.00,
                    finalAmount: parseFloat(purchase.grandTotal) || 64400.00
                }
            };
            

            console.log("darshu", paymentDetails)
            const pdfBuffer = await generateVehicleBill(paymentDetails);
            console.log("buffer", pdfBuffer);
            await cds.update(PurchaseOrder).set({ paymentBill: pdfBuffer, paymentBillType: 'application/pdf' }).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });
            debugger
            console.log('hello');


        }
        if (req.data.status === 'Credit Request') {
            debugger
            var purchase = await SELECT.one.from(PurchaseOrder).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });
            var cust = await SELECT.from(Customer).where({ customerId: purchase.customerId });
            const comments = await SELECT.from(PurchaseComments).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });
            var commentDetails = JSON.stringify(comments);
            var veh = await SELECT.from(PurchaseVehicle).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });
            const vehicleDetails = JSON.stringify(veh);
            var { div, dischnl, sorg, doc } =  await getDescription(purchase.purchaseOrderUuid, 'PO');

            // const oauthToken = await getOAuthToken();
            // const token = `Bearer ${oauthToken}`;
            //nida's flow
            const Auth = getXsuaaAuth();
            console.log('Authorization Credit Request', Auth);
            const sAuth = JSON.stringify(Auth);

            var workflowContent = {
               "definitionId": "us10.44f10b5ftrial.payment1.approvalMatrix",
                "context": {
                    "accountno": purchase.accNumber || '',
                    "address": cust[0].address || '',
                    "bankname": purchase.bankName || '',
                    "branch": purchase.branch || '',
                    "city": cust[0].City || '',
                    "companyname": cust[0].companyName || '',
                    "contactnumber": cust[0].phone || '',
                    "contactperson": purchase.contactPerson || '',
                    "country": cust[0].Country || '',
                    "currency": cust[0].Currency,
                    "customerid": cust[0].sapCustomerId || '',
                    "customername": cust[0].name || '',
                    "department": cust[0].department || '',
                    "email": cust[0].email || '',
                    "ifscCode": purchase.ifscCode || '',
                    "jobtitle": cust[0].jobTitle || '',
                    "language": cust[0].Language || '',
                    "location": cust[0].location || '',
                    "postalcode": cust[0].postalCode || '',
                    "pouuid": purchase.purchaseOrderUuid || '',
                    "soid": purchase.salesOrderId || '',
                    "street": cust[0].Street || '',
                    "taxid": cust[0].taxId || '',
                    "van": cust[0].van || '',
                    "vehiclelink": vehicleDetails || '',
                    "dueDate": purchase.dueDate || '',
                    "accholdersname": purchase.accHoldersName || '',
                    "distributionchannels": dischnl || "",
                    "dealercode": purchase.dealerCode || "",
                    "division": div || "",
                    "quotationid": purchase.quotationID || "",
                    "doctype":  doc || "",
                    "salesorg":  sorg || "",
                    "status":  purchase.status || "",
                    "totalprice":  purchase.totalAmount || "",
                    "taxamount":  purchase.taxAmount || "",
                    "grandtotal":  purchase.grandTotal || "",
                    "purchorg": purchase.purchOrg || "",
                    "purchgroup": purchase.purchGroup || "",
                    "vendorcode": purchase.vendorCode || "",
                    "companycode": purchase.companyCode || "",
                    "_sapcustomerid": cust[0].sapCustomerId || "",
                    "baseurl": sAuth || ""
                }
            }

            console.log(workflowContent);
            
            var BPA_Trigger = await cds.connect.to("BPA_Trigger");
            var result = await BPA_Trigger.post('/workflow/rest/v1/workflow-instances', workflowContent);
            await cds.update(PurchaseOrder).set({ commentsText: null }).where({ purchaseOrderUuid: purchase.purchaseOrderUuid });

            console.log(result);
        }
        if (req.data.status === 'Paid') {
            var purchase = await SELECT.one.from(PurchaseOrder).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });
            var cust = await SELECT.from(Customer).where({ customerId: purchase.customerId });
            const comments = await SELECT.from(PurchaseComments).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });
            var commentDetails = JSON.stringify(comments);
            var veh = await SELECT.from(PurchaseVehicle).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });
            const vehicleDetails = JSON.stringify(veh);
            var { div, dischnl, sorg, doc } =  await getDescription(purchase.purchaseOrderUuid, 'PO');
            console.log('division', div);

            // const oauthToken = await getOAuthToken();
            // const token = `Bearer ${oauthToken}`;
            const Auth = getXsuaaAuth();
                console.log('Authorization nida', Auth);
                const sAuth = JSON.stringify(Auth);

            //nida flow
            var workflowContent = {
                "definitionId": "us10.44f10b5ftrial.payment1.paymentProcess",
                "context": {
                    "transactionid": purchase.transactionId || '',
                    "accountno": purchase.accNumber || '',
                    "amount": purchase.grandTotal || '',
                    "paymentmethod": purchase.paymentMethod || '',
                    "soid": purchase.salesOrderId || '',
                    "companyname": cust[0].companyName || '',
                    "contactperson": purchase.contactPerson || '',
                    "contactnumber": cust[0].phone || '',
                    "email": cust[0].email || '',
                    "van": cust[0].van || '',
                    "address": cust[0].address || '',
                    "pouuid": purchase.purchaseOrderUuid || '',
                    "customername": cust[0].name || '',
                    "jobtitle": cust[0].jobTitle || '',
                    "department": cust[0].department || '',
                    "taxid": cust[0].taxId || '',
                    "currency": cust[0].Currency || '',
                    "language": cust[0].Language || '',
                    "country": cust[0].Country || '',
                    "city": cust[0].City || '',
                    "street": cust[0].Street || '',
                    "postalcode": cust[0].postalCode || '',
                    "location": cust[0].location || '',
                    "vehiclelink": vehicleDetails || '',
                    "distributionchannels": dischnl || "",
                    "dealercode": purchase.dealerCode || "",
                    "division": div || "",
                    "quotationid": purchase.quotationID || "",
                    "doctype": doc || "",
                    "salesorg": sorg || "",
                    "status": purchase.status || "",
                    "totalprice": purchase.totalAmount || "",
                    "taxamount": purchase.taxAmount|| "",
                    "grandtotal": purchase.grandTotal || "",
                    "soid": purchase.salesOrderId || "",
                    "purchorg": purchase.purchOrg || "",
                    "purchgroup": purchase.purchGroup || "",
                    "vendorcode": purchase.vendorCode || "",
                    "companycode": purchase.companyCode || "",
                    "_sapcustomerid": cust[0].sapCustomerId || "",
                    "baseurl": sAuth || ""
                }
            };
            console.log('nida',workflowContent);
            
            var BPA_Trigger = await cds.connect.to("BPA_Trigger");
            var result = await BPA_Trigger.post('/workflow/rest/v1/workflow-instances', workflowContent);
            console.log(result);
            debugger
            await cds.update(PurchaseOrder).set({ commentsText: null,grandTotal : purchase.grandTotal }).where({ purchaseOrderUuid: purchase.purchaseOrderUuid });
            var peData = await SELECT.one.from(PurchaseOrder).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });
            console.log('pedata', peData);
            // const oauthToken1 = await getOAuthToken();
            // const token1 = `Bearer ${oauthToken1}`;

            var workflowContent = {
                "definitionId": "us10.44f10b5ftrial.payment1.salesProcess",
                "context": {
                    "instanceid": purchase.instanceId || ""
                }
            };
            console.log("adi", workflowContent);
            
            var BPA_Trigger = await cds.connect.to("BPA_Trigger");
            var result = await BPA_Trigger.post('/workflow/rest/v1/workflow-instances', workflowContent);
            console.log(result); 
        }

        if (req.data.status && req.data.status === 'Rejected') {
            var purchase = await SELECT.one.from(PurchaseOrder).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });
            const payload = {
                purchaseEnquiryUuid: req.data.purchaseOrderUuid,
                customerId: purchase.customerId,
                commentsText: `${purchase.purchaseOrderId} - Order Rejected`
            }
            const result = await INSERT.into(EnquiryComments).entries(payload);
            var purvehicle = await SELECT.from(PurchaseVehicle).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });
            // Inventry minus call

            const oPayload = {
                "VehicleInventorySet": purvehicle.map(vehicle => ({
                    "vehicleCode": vehicle.materialCode,
                    "quantity": vehicle.quantity,
                    "status" : req.data.status  
                }))
              };
               //"status" : req.data.status
            console.log('abap inventory :',oPayload);
            var link = '/sap/Z_VEHICLEINVENTORY_SRV/PurchaseOrderSet'
            const response = await postSalesOrderData(oPayload, link);
            console.dir(response, { depth: null });

            for (const vehicle of purvehicle) {
                debugger
                const inventory = await SELECT.one.from(VehicleInventory).where({ vehicleCode: vehicle.materialCode });
                allocatedquantity = inventory.allocatedVehicles - vehicle.quantity;
                await cds.update(VehicleInventory).set({ allocatedVehicles: allocatedquantity }).where({ vehicleCode: vehicle.materialCode });
            }

        }

        if (req.data.status && req.data.status === 'Waiting for Payment Confirmation') {


            const purchase = await SELECT.one.from(PurchaseOrder).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });
            const payload = {
                purchaseEnquiryUuid: req.data.purchaseOrderUuid,
                customerId: purchase.customerId,
                commentsText: `${purchase.purchaseOrderId} - Sales Order & Payment Request`
            }
            // const commentText = `${purchase.purchaseOrderId} - PO Accepted`;
            const result = await INSERT.into(EnquiryComments).entries(payload);

            var vehicle = await SELECT.from(PurchaseVehicle).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });
            var customer1 = await SELECT.one.from(Customer).where({ customerId: purchase.customerId });
            const invoice1 = {
                invoiceNumber: purchase.purchaseOrderId,
                date: new Date().toLocaleDateString('en-CA'),
                dueDate: purchase.dueDate,
                customerName: customer1.name,
                customerAddress: customer1.address,
                items: vehicle,
                grandTotal: purchase.grandTotal
            };

            const pdfData = await generateInvoice1(invoice1);

            await cds.update(PurchaseOrder).set({ invoice: pdfData, mediaType: 'application/pdf' }).where({ purchaseOrderUuid: purchase.purchaseOrderUuid });

            const customer = await SELECT.one.from(Customer).where({ customerId: purchase.customerId });
            const comments = await SELECT.from(PurchaseComments).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });
            var commentDetails = JSON.stringify(comments);
            var veh = await SELECT.from(PurchaseVehicle).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });
            const vehicleDetails = JSON.stringify(veh);

            // const oauthToken = await getOAuthToken();
            // const token = `Bearer ${oauthToken}`;

            // const now = new Date(); // Current date and time
            // let futureDate = new Date(purchase.dueDate);
            // console.log(now, ' nnn ', futureDate);
            // const differenceInMs = futureDate - now;
            // const differenceInMinutes = Math.floor(differenceInMs / (1000 * 60));
            
            let beforeDuedate = new Date(purchase.dueDate + "T23:59:59");
            let afterDuedate = new Date(purchase.dueDate + "T23:59:59");
            beforeDuedate.setMinutes(beforeDuedate.getMinutes() - 10);
        
            // const beforeDuedate = differenceInMinutes - 10; 
            // const afterDuedate = differenceInMinutes; 

            console.log("Minutes before due date:", beforeDuedate);
            console.log("Minutes after due date:", afterDuedate);

            var workflowContent = {
                 "definitionId": "us10.44f10b5ftrial.payment1.delayProcess",
                "context": {
                    "pouuid": purchase.purchaseOrderUuid || '',
                    "duedate": purchase.dueDate || '',
                    "afterduedate":  20,
                    "notificationtext": `'${purchase.purchaseOrderId} - Payment Reminder'`,
                    "creditnotification": `'${purchase.purchaseOrderId} - Payment is Overdue, Request for Credit'`,
                    "customerid": customer.customerId || '',
                    "soid": purchase.salesOrderId,
                    "customername": customer1.name || ''
                }
            }
            console.log('delayflow', workflowContent);
            
            var BPA_Trigger = await cds.connect.to("BPA_Trigger");
            var res = await BPA_Trigger.post('/workflow/rest/v1/workflow-instances', workflowContent);
            console.log(res);
          
        }

        if (req.data.status && req.data.status === 'Payment Confirmed') {
            var purchase = await SELECT.one.from(PurchaseOrder).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });
            const payload = {
                purchaseEnquiryUuid: req.data.purchaseOrderUuid,
                customerId: purchase.customerId,
                commentsText: `${purchase.purchaseOrderId} - Payment Confirmed`
            }
            const result = await INSERT.into(EnquiryComments).entries(payload);
            var purvehicle = await SELECT.from(PurchaseVehicle).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });

            // Inventry minus call

            const oPayload = {
                "VehicleInventorySet": purvehicle.map(vehicle => ({
                    "vehicleCode": vehicle.materialCode,
                    "quantity": vehicle.quantity,  
                    "status" : req.data.status
                }))
              };
               
            console.log('abap inventory :',oPayload);
            var link = '/sap/Z_VEHICLEINVENTORY_SRV/PurchaseOrderSet'
            const response = await postSalesOrderData(oPayload, link);
            console.dir(response, { depth: null });

            for (const vehicle of purvehicle) {
                const inventory = await SELECT.one.from(VehicleInventory).where({ vehicleCode: vehicle.materialCode });
                inventoryquantity = inventory.quantity - vehicle.quantity;
                allocatedquantity = inventory.allocatedVehicles - vehicle.quantity;
                await cds.update(VehicleInventory).set({ quantity: inventoryquantity, allocatedVehicles: allocatedquantity }).where({ vehicleCode: vehicle.materialCode });
            }

            // const purchase = await SELECT.one.from(PurchaseOrder).where ({purchaseOrderUuid : req.data.purchaseOrderUuid});

            const paymentDetails = {
                transactionId: purchase.transactionId || ' ',
                bankName: purchase.bankName || ' ',
                accHoldersName: purchase.accHoldersName || ' ',
                accNumber: 'NA',
                amount: purchase.grandTotal || ' ',
                ifscCode: purchase.ifscCode || ' ',
                paymentMethod: purchase.paymentMethod || 'DD',
                status: 'Paid',
                salesOrderId: purchase.salesOrderId || ' ',

            };
            console.log("darshu", paymentDetails)
            const pdfBuffer = await generateInvoice2(paymentDetails);
            console.log("buffer", pdfBuffer);
            await cds.update(PurchaseOrder).set({ paymentBill: pdfBuffer, paymentBillType: 'application/pdf' }).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });
            debugger
            console.log('hello');
        }

        var purchase = await SELECT.one.from(PurchaseOrder).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });
        if (purchase.status === 'Approved' && req.data.status === 'SO Pending') {
            console.log('Hiii Pradeep');

            const payload = {
                purchaseEnquiryUuid: req.data.purchaseOrderUuid,
                customerId: purchase.customerId,
                commentsText: `${purchase.purchaseOrderId} - PO Accepted`
            }
            const result = await INSERT.into(EnquiryComments).entries(payload);
            var purvehicle = await SELECT.from(PurchaseVehicle).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });
            // Inventry minus call

            const oPayload = {
                "VehicleInventorySet": purvehicle.map(vehicle => ({
                    "vehicleCode": vehicle.materialCode,
                    "quantity": vehicle.quantity, 
                    "status" : req.data.status 
                }))
              };
               
            console.log('abap inventory :',oPayload);
            var link = '/sap/Z_VEHICLEINVENTORY_SRV/PurchaseOrderSet'
            const response = await postSalesOrderData(oPayload, link);
            console.dir(response, { depth: null });

            for (const vehicle of purvehicle) {

                const inventory = await SELECT.one.from(VehicleInventory).where({ vehicleCode: vehicle.materialCode });

                // inventoryquantity = inventory.quantity -  vehicle.quantity;
                allocatedquantity = inventory.allocatedVehicles + vehicle.quantity;
                await cds.update(VehicleInventory).set({ allocatedVehicles: allocatedquantity }).where({ vehicleCode: vehicle.materialCode });
            }

        }
    });

    this.on('SyncDeliveryDetails', async (req) => {
        debugger
        if (req.data.purchaseOrderUuid) {
            var vdata = await SELECT.from(PurchaseVehicle).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });
            const purchase = await SELECT.one.from(PurchaseOrder).where({ purchaseOrderUuid: req.data.purchaseOrderUuid });
            for (let vehicle of vdata) {
                const deliveryDate = new Date(vehicle.preferredDelDate); // Convert to Date object
                const createdAt = new Date(purchase.createdAt);

                const diffMilliseconds = deliveryDate - createdAt; // Difference in milliseconds
                const daysDifference = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24)); // Convert to days
                var days;
                if(vehicle.preferredDelDate) days = `${daysDifference} days`
                await cds.update(PurchaseVehicle.drafts).set({ delDate: vehicle.preferredDelDate, delLocation: vehicle.preferredDelLocation, deliveryLeadTime: days }).where({ vehicleID: vehicle.vehicleID });
            }
        }
    });

    this.on('AddNotification', async (req) => {
        if (req.data.purchaseID && req.data.customerID && req.data.Text) {
            const payload = {
                purchaseEnquiryUuid: req.data.purchaseID,
                customerId: req.data.customerID,

                commentsText: req.data.Text
            }
            const result = await INSERT.into(EnquiryComments).entries(payload);
        }

    });


    this.on('commentsFun', async (req) => {
        debugger
        const newComment = {
            purchaseEnquiryUuid: req.data.peUuid,
            commentsText: req.data.commentsText,
            user: 'M'
        };
        await INSERT.into(EnquiryComments).entries(newComment);
        await UPDATE(PurchaseEnquiry).set({ commentsText: null }).where({ purchaseEnquiryUuid: req.data.peUuid });
        console.log('comments insert');
    });



    const logoPath = path.join(__dirname, 'mahindra-logo.png');

    // Function to download image
    async function downloadImage(url) {
        debugger
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'arraybuffer',
        });
        return Buffer.from(response.data, 'binary');
    }

    // Main function to generate the PDF in memory
    function generateInvoice1(invoice) {
        return new Promise(async (resolve, reject) => {
            let doc = new PDFDocument({ margin: 50 });
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers); // Combine buffer parts into one
                resolve(pdfData); // Resolve the Promise with the PDF data
            });

            const logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/8/82/Mahindra_Auto.png';
            const response = await axios.get(logoUrl, { responseType: 'arraybuffer' });
            const logoBuffer = Buffer.from(response.data);

            // Add the logo on the right and "INVOICE" text on the left
            doc.image(logoBuffer, 400, 45, { width: 150 })
                .fontSize(20)
                .text("INVOICE", 50, 50)
                .moveDown();

            // Invoice header
            doc.fontSize(10)
                .text(`Invoice Number: ${invoice.invoiceNumber}`, 50, 120)
                .text(`Date: ${invoice.date}`, 50, 135)
                .text(`Due Date: ${invoice.dueDate}`, 50, 150)
                .moveDown();

            // Customer details
            doc.fontSize(10)
                .text(`Bill To:`, 50, 180)
                .text(`${invoice.customerName}`, 50, 195)
                .text(`${invoice.customerAddress}`, 50, 210)
                .moveDown(2);

            // Draw a horizontal line to separate header from item details
            doc.moveTo(50, 250)
                .lineTo(550, 250)
                .stroke();

            // Invoice table header with borders and centered text
            let tableTop = 260;
            drawTableRow(doc, tableTop, "Material Code", "Unit Price", "Quantity", "Discount", "Tax", "Total", true);

            // Add a table for the invoice items with borders and centered text
            let itemIndex = 0;
            let totalAmount = 0;
            invoice.items.forEach(item => {
                const description = item.materialCode;
                const y = tableTop + 25 + (itemIndex * 25);
                drawTableRow(doc, y, description, item.pricePerUnit, item.quantity, item.discount, item.taxPercentage, item.totalPrice, false);
                totalAmount += item.totalPrice;
                itemIndex++;
            });

            // Add total amount at the bottom
            const totalY = tableTop + (itemIndex * 25) + 50;
            doc.fontSize(12)
                .text(`Grand Total: ${invoice.grandTotal}`, 400, totalY, { align: 'right' });

            // Draw a horizontal line above the total
            doc.moveTo(50, totalY - 10)
                .lineTo(550, totalY - 10)
                .stroke();

            // Footer
            doc.moveDown(2);
            doc.fontSize(10)
                .text("Thank you for your business!", 50, totalY + 50, { align: 'center' })
                .text("Please make payment by the due date.", 50, totalY + 65, { align: 'center' });

            // Finalize and store the PDF
            doc.end();
        });
    }

    // Helper function to draw a table row with borders and centered text
    function drawTableRow(doc, y, description, unitPrice, quantity, discount, tax, total, isHeader) {
        const rowHeight = 25;
        const textPadding = 5;

        // Define column widths
        const descWidth = 150;
        const priceWidth = 75;
        const quantityWidth = 75;
        const discountWidth = 75;
        const taxWidth = 75;
        const totalWidth = 75;

        // Draw borders for the row
        doc.rect(50, y, descWidth, rowHeight).stroke(); // Description column
        doc.rect(50 + descWidth, y, priceWidth, rowHeight).stroke(); // Unit Price column
        doc.rect(50 + descWidth + priceWidth, y, quantityWidth, rowHeight).stroke(); // Quantity column
        doc.rect(50 + descWidth + priceWidth + quantityWidth, y, discountWidth, rowHeight).stroke(); // Discount column
        doc.rect(50 + descWidth + priceWidth + quantityWidth + discountWidth, y, taxWidth, rowHeight).stroke(); // Tax column
        doc.rect(50 + descWidth + priceWidth + quantityWidth + discountWidth + taxWidth, y, totalWidth, rowHeight).stroke(); // Total column

        // Set bold font for header
        if (isHeader) {
            doc.font('Helvetica-Bold');
        } else {
            doc.font('Helvetica');
        }

        // Center align the text inside the columns
        doc.fontSize(10)
            .text(description, 50, y + textPadding, { width: descWidth, align: 'center' })
            .text(`${unitPrice}`, 50 + descWidth, y + textPadding, { width: priceWidth, align: 'center' })
            .text(quantity, 50 + descWidth + priceWidth, y + textPadding, { width: quantityWidth, align: 'center' })
            .text(`${discount}`, 50 + descWidth + priceWidth + quantityWidth, y + textPadding, { width: discountWidth, align: 'center' })
            .text(`${tax}%`, 50 + descWidth + priceWidth + quantityWidth + discountWidth, y + textPadding, { width: taxWidth, align: 'center' })
            .text(`${total}`, 50 + descWidth + priceWidth + quantityWidth + discountWidth + taxWidth, y + textPadding, { width: totalWidth, align: 'center' });
    }


    async function generateInvoice2(paymentDetails) {
        console.log('inside function')
        return new Promise(async (resolve, reject) => {
            const doc = new PDFDocument({ margin: 30 });
            const buffers = [];

            // Collect data as buffer in memory
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
            console.log('start try')
            try {
                // Download logo and add it to the PDF
                const logoBuffer = await downloadImage('https://upload.wikimedia.org/wikipedia/commons/8/82/Mahindra_Auto.png');

                const headerY = 30; // Initial position of the logo
                const logoSize = 80; // Logo size
                const logoX = 50; // Position of the logo
                const headingX = logoX + logoSize + 60; // Adjust this value to move the heading further to the right
                const headingY = headerY + 50; // Y-position of the heading

                // Position the logo
                doc.image(logoBuffer, logoX, headerY, { width: logoSize, height: logoSize });

                // Position "Payment Details" below the logo and move it to the right
                doc.fontSize(18).fillColor('blue')
                    .text('Payment Details', headingX, headingY); // Move this to the right

                // Get current date and time
                const currentDate = new Date().toLocaleDateString(); // Format: MM/DD/YYYY
                const currentTime = new Date().toLocaleTimeString(); // Format: HH:MM:SS AM/PM

                // Position date and time to the right of the heading
                const dateX = headingX + 250; // Move the date further to the right from the heading
                const dateY = headingY; // Y-position for the date, same as heading

                const timeY = dateY + 20; // Y-position for the time, moved downwards

                // Print Date with reduced font size
                doc.fontSize(10).fillColor('black') // Set font size and color for the date
                    .text(`Date: ${currentDate}`, dateX, dateY); // Align to the right side of the heading

                // Print Time with reduced font size
                doc.fontSize(10).fillColor('black') // Set font size and color for the time
                    .text(`Time: ${currentTime}`, dateX, timeY); // Align to the right side of the date

                // Draw horizontal line below the heading
                const lineY = timeY + 30; // New Y-position for the line, below the time
                doc.moveTo(logoX, lineY) // Align with the left side of the logo
                    .lineTo(doc.page.width - 50, lineY) // Extend line to the right margin
                    .lineWidth(2)
                    .stroke();


                doc.moveDown(1);
                // Table setup with payment details
                const details = [
                    { label: 'Transaction ID:', value: paymentDetails.transactionId },
                    { label: 'Bank:', value: paymentDetails.bankName },
                    { label: 'Name:', value: paymentDetails.accHoldersName },
                    { label: 'Account Number:', value: paymentDetails.accNumber },
                    { label: 'Amount:', value: paymentDetails.amount},
                    { label: 'IFSC Code:', value: paymentDetails.ifscCode },
                    { label: 'Payment Method:', value: paymentDetails.paymentMethod },
                    { label: 'Status:', value: paymentDetails.status },
                    { label: 'Sales Order ID:', value: paymentDetails.salesOrderId }
                ];


                // Table layout properties
                const tableTop = doc.y + 20;
                const rowHeight = 25;
                const labelWidth = 150;
                const valueWidth = 250;
                const leftMargin = 50;

                // Render table rows
                details.forEach((item, index) => {
                    const currentY = tableTop + (index + 1) * rowHeight;
                    doc.strokeColor('black').rect(leftMargin, currentY, labelWidth, rowHeight).stroke();
                    doc.fillColor('black').fontSize(12).font('Helvetica').text(item.label, leftMargin + 10, currentY + 5);
                    doc.strokeColor('black').rect(leftMargin + labelWidth, currentY, valueWidth, rowHeight).stroke();
                    doc.fillColor('black').text(item.value, leftMargin + labelWidth + 10, currentY + 5);
                });

                // Footer with centered message
                doc.moveDown(3);
                const footerLineY = doc.y;
                doc.lineWidth(1).moveTo(50, footerLineY).lineTo(550, footerLineY).stroke();
                const footerText = 'Thanks You for Making Payment!';
                const footerWidth = doc.widthOfString(footerText);
                doc.fontSize(12).fillColor('black').text(footerText, (doc.page.width - footerWidth) / 2, footerLineY + 10);

                // Finalize and end document
                doc.end();
            } catch (error) {
                console.log(error);
            }
        });
    }

    function generateVehicleBill(data) {
        return new Promise((resolve, reject) => {
            try {
                // Create a new PDF document
                const doc = new PDFDocument({ margin: 50 });
    
                // Collect PDF content in a buffer
                const chunks = [];
                doc.on('data', chunk => chunks.push(chunk)); // Listen for data chunks
                doc.on('end', () => {
                    const pdfBuffer = Buffer.concat(chunks); // Concatenate all chunks
                    resolve(pdfBuffer); // Return the buffer
                });
    
                // Generate Bill Number
                const billNumber = `BILL-${Math.floor(Math.random() * 100000) + 1000}`;
    
                // Get the current date and time of bill generation
                const currentDate = new Date();
                const dateStr = currentDate.toLocaleDateString();
                const timeStr = currentDate.toLocaleTimeString();
    
                // Title
                doc.fontSize(22).font('Helvetica-Bold').text('Credit Approval Bill', { align: 'center', underline: true });
                doc.moveDown(1);
    
                // Bill Number, Date, Time
                doc.fontSize(12).font('Helvetica').text(`Bill Number: ${billNumber}`, { align: 'left' });
                doc.text(`Date: ${dateStr}`, { align: 'left' });
                doc.text(`Time: ${timeStr}`, { align: 'left' });
                doc.moveDown(2);
    
                // Customer Details Section
                doc.fontSize(14).font('Helvetica-Bold').text('Customer Details', { align: 'left' });
                doc.fontSize(12).font('Helvetica').text(`Customer Name: ${data.customer.name}`);
                doc.text(`Email: ${data.customer.email}`);
                doc.text(`Phone: ${data.customer.phone}`);
                doc.moveDown(1);
    
                // Grand Total Section
                doc.fontSize(14).font('Helvetica-Bold').text('Grand Total', { align: 'left' });
                doc.fontSize(12).font('Helvetica').text(`Subtotal: $${data.grandTotal.subtotal.toFixed(2)}`);
                doc.text(`Tax: $${data.grandTotal.tax.toFixed(2)}`);
                doc.text(`Discount: -$${data.grandTotal.discount.toFixed(2)}`);
                doc.text(`Grand Total: $${data.grandTotal.finalAmount.toFixed(2)}`);
                doc.moveDown(2);
    
                // Greeting Message
                doc.fontSize(12).font('Helvetica').text('Thank you for choosing Mahindra!', { align: 'center' });
                doc.moveDown(1);
                doc.fontSize(10).text('For support, please contact us at support@mahindra.com or call 1800-123-4567', { align: 'center' });
    
                // Finalize the document
                doc.end();
            } catch (error) {
                reject(error); // Catch and reject errors
            }
        });
    }


    this.before('CREATE', EnquiryFiles, async (req) => {
        debugger
        req.data.url = `EnquiryFiles(id=${req.data.id})/content`;
    });


    this.before('CREATE', EnquiryVehicle, async (req, next) => {
        debugger
        const PurchaseEnquiryData = await SELECT.one.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });
    
        if (req.data.materialCode && req.data.quantity) {
            if(req.data.quantity.toString().includes('-')){
                return req.reject(`Negative Quantity${req.data.quantity} is not allowed`);
            }
            // abap validation
            var abapDest = await cds.connect.to("ABAP_Destinations");
            let res1 =await abapDest.get(`/sap/Z_SALES_PARTNERS_16_SRV/Get_Vehicles?salesOrg='${PurchaseEnquiryData.salesOrg}'&distributionChnl='${PurchaseEnquiryData.distributionChannels}'`);
            console.dir(res1, { depth: null });
            if(!res1.some(vehicle => vehicle.vehicleCode === req.data.materialCode)){
                return req.reject(400, `Vehicle ${req.data.materialCode} does not exists in selected sales org & distribution channel`);
            }
            // abap validation

            // var vdata = await SELECT.one.from(EnquiryVehicle).where({ materialCode: req.data.materialCode , purchaseEnquiryUuid : req.data.purchaseEnquiryUuid});
            var vehicle = await SELECT.one.from(VehicleInventory).where({ vehicleCode: req.data.materialCode });
            var vdata = await SELECT.one.from(EnquiryVehicle).where({ materialCode: req.data.materialCode, purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });
            // const salesorg10 = await SELECT.from(PurchaseEnquiry).columns('salesOrg').where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });
            // const partnerrole1 = await SELECT.from(SH).where({ sHId: salesorg10[0].salesOrg });

            if (!vdata) {
               
                var AvailableQuantity = vehicle.quantity - vehicle.allocatedVehicles;
                if (req.data.quantity <= AvailableQuantity) {

                    req.data.vehicleName = vehicle.vehicleName;
                    req.data.vehicleColor = vehicle.vehicleColor;
                    req.data.pricePerUnit = parseFloat(vehicle.pricePerUnit).toFixed(2).toString();
                    req.data.taxPercentage = (vehicle.taxPercentage).toString();
                    req.data.itemNo = (Math.floor(100000 + Math.random() * 900000)).toString();

                    req.data.actualPrice = (parseFloat(vehicle.pricePerUnit) * req.data.quantity).toFixed(2).toString();

                    // Calculate the actual price based on quantity and stock price
                    const quantity = req.data.quantity;
                    if (quantity >= vehicle.platinumMinQty) {
                        req.data.discount = (vehicle.platinumPer).toFixed(2).toString();
                        req.data.band = `Platinum(${req.data.discount}%)`;
                    } else if (quantity >= vehicle.goldMinQty) {
                        req.data.discount = (vehicle.goldPer).toFixed(2).toString();
                        req.data.band = `Gold(${req.data.discount}%)`;
                    } else if (quantity >= vehicle.silverMinQty) {
                        req.data.discount = (vehicle.silverPer).toFixed(2).toString();
                        req.data.band = `Silver(${req.data.discount}%)`;
                    } else {
                        req.data.discount = '0';
                        req.data.band = 'None(0%)';
                    }
                    const actualPrice = parseFloat(vehicle.pricePerUnit) * quantity;
                    const discount = parseFloat(req.data.discount);


                    if (req.data.discount === '0') {
                        req.data.discountedPrice = actualPrice.toFixed(2).toString();
                        req.data.totalPrice = (parseFloat(req.data.discountedPrice) + (parseFloat(req.data.discountedPrice) * (parseFloat(req.data.taxPercentage)) / 100)).toFixed(2).toString();
                    } else {
                        req.data.discountedPrice = (actualPrice - (actualPrice * discount / 100)).toFixed(2).toString();
                        req.data.totalPrice = (parseFloat(req.data.discountedPrice) + (parseFloat(req.data.discountedPrice) * (parseFloat(req.data.taxPercentage)) / 100)).toFixed(2).toString();
                    }
                    req.data.discount = '0';

                } else {
                    return req.reject(400, `Requested Quantity ${req.data.quantity}exceeds the existing quantity ${AvailableQuantity}`);
                }
            } else {
                return req.reject(400, `Vehicle already exsist ${req.data.materialCode}`);
            }
        } else {
            return req.reject(400, 'null entry');
        }
    });

    this.before('UPDATE', EnquiryVehicle, async (req, next) => {
        debugger
        var vdata = await SELECT.one.from(EnquiryVehicle).where({ vehicleId: req.data.vehicleId });
        var Enquirydata = await SELECT.one.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: vdata.purchaseEnquiryUuid });
        var vehicle = await SELECT.one.from(VehicleInventory).where({ vehicleCode: vdata.materialCode });
        console.log('vdata', vdata)
        console.log('vehi', vehicle);
        if( req.data.quantity && req.data.quantity.toString().includes('-')){
            return req.reject(`Negative Quantity${req.data.quantity} is not allowed`);
        }
        if (req.data.quantity && Enquirydata.status === 'Draft') {
            
            var AvailableQuantity = vehicle.quantity - vehicle.allocatedVehicles;
            if (req.data.quantity <= AvailableQuantity) {
                req.data.pricePerUnit = vehicle.pricePerUnit;
                req.data.actualPrice = (parseFloat(vehicle.pricePerUnit) * req.data.quantity).toFixed(2).toString();

                // Calculate the actual price based on quantity and stock price
                const quantity = req.data.quantity;
                if (quantity >= vehicle.platinumMinQty) {
                    req.data.discount = (vehicle.platinumPer).toFixed(2).toString();
                    req.data.band = `Platinum(${req.data.discount}%)`;
                } else if (quantity >= vehicle.goldMinQty) {
                    req.data.discount = (vehicle.goldPer).toFixed(2).toString();
                    req.data.band = `Gold(${req.data.discount}%)`;
                } else if (quantity >= vehicle.silverMinQty) {
                    req.data.discount = (vehicle.silverPer).toFixed(2).toString();
                    req.data.band = `Silver(${req.data.discount}%)`;
                } else {
                    req.data.discount = '0';
                    req.data.band = 'None(0%)';
                }
                const actualPrice = parseFloat(vehicle.pricePerUnit) * quantity;
                const discount = parseFloat(req.data.discount);
                

                if (req.data.discount === '0') {
                    req.data.discountedPrice = actualPrice.toFixed(2).toString();
                    req.data.totalPrice = (parseFloat(req.data.discountedPrice) + (parseFloat(req.data.discountedPrice) * (parseFloat(vdata.taxPercentage)) / 100)).toFixed(2).toString();
                } else {
                    req.data.discountedPrice = (actualPrice - (actualPrice * discount / 100)).toFixed(2).toString();
                    req.data.totalPrice = (parseFloat(req.data.discountedPrice) + (parseFloat(req.data.discountedPrice) * (parseFloat(vdata.taxPercentage)) / 100)).toFixed(2).toString();
                }
                req.data.discount = '0';
            } else {
                return req.reject(400, `Requested Quantity ${req.data.quantity}exceeds the existing quantity ${AvailableQuantity}`);
            }

        }
    });

    this.on('getUserRoles', async (req) => {
        let auth = req?.headers?.authorization;
        if (auth != undefined) {
            let token = auth.split(" ");
            var decoded = jwtDecode(token[1]);
            //console.log('jwt token', decoded);
            return decoded;
        }
    });


    this.before('UPDATE', PurchaseVehicle.drafts, async (req, next) => {
        debugger
        if (req.data.delDate) {
            const vehicle = await SELECT.one.from(PurchaseVehicle).where({ vehicleID: req.data.vehicleID });
            const purchase = await SELECT.one.from(PurchaseOrder).where({ purchaseOrderUuid: vehicle.purchaseOrderUuid });

            const deliveryDate = new Date(req.data.delDate); // Convert to Date object
            const createdAt = new Date(purchase.createdAt);

            const diffMilliseconds = deliveryDate - createdAt; // Difference in milliseconds
            const daysDifference = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24)); // Convert to days
            const days = `${daysDifference} days`
            req.data.deliveryLeadTime = days;
            // await cds.update(PurchaseVehicle.drafts).set({ deliveryLeadTime: days, deliveryDate: req.data.deliveryDate }).where({ vehicleID: req.data.vehicleID });
            console.log(daysDifference);
            debugger
        } else if (req.data.delDate === null) req.data.deliveryLeadTime = null;
    });

    async function AddNotification(purchaseID, customerID, Text) {
        const payload = {
            purchaseEnquiryUuid: purchaseID,
            customerId: customerID,
            commentsText: Text
        }
        const result = await INSERT.into(EnquiryComments).entries(payload);
    }


    this.on('generateSO', async (req) => {
        debugger
        const purchaseUUID = req.data.data;
        const purchaseOrder = await SELECT.one.from(PurchaseOrder).where({ purchaseOrderUuid: purchaseUUID });
        const purchasevehicles = await SELECT.from(PurchaseVehicle).where({ purchaseOrderUuid: purchaseUUID });
        const customer = await SELECT.one.from(Customer).where({ customerId: purchaseOrder.customerId });
        const partners = await SELECT.from(PurchasePartners).where({ purchaseOrderUuid: purchaseUUID });
        const customerid = purchaseOrder.customerId

        const payload = {
            "doc_type" : "TA",
            "sales_org" : purchaseOrder.salesOrg,
            "distr_chan" : purchaseOrder.distributionChannels,
            "division": purchaseOrder.division,
            "itemsSet" : purchasevehicles.map(vehicle => ({
                "item_number" : vehicle.itemNo,
                "material" : vehicle.materialCode,
                "target_qty" : vehicle.quantity.toString(),
                "plant" : vehicle.plant,
                "shipping_point" : vehicle.shippingPoint || "1000"
            })),
           "PartnersSet" : partners.map(vehicle => ({
                "partner_role" : vehicle.partnerRole,
                "partner_number" : vehicle.partnerNumber
            }))
        }
        console.log("so payload", payload)
        var soid;
        var link = '/sap/Z_SALESORDER_16_SRV/salesOrderSet'
        const response = await postSalesOrderData(payload, link);
        console.log('dar', response.d.itemsSet);
        console.log('darshan', response);
        console.log('ashok', response.d.sales_document);
        console.dir(response, { depth: null });
        //console.log('ashok', response.d.sales_document);

        if(response.d.sales_document) {
            soid = response.d.sales_document;
            await cds.update(PurchaseOrder).set({
                salesOrderId: soid,
                soModifiedAt: new Date(),
                bankName : 'State Bank of India',
                accNumber : '00676600455',
                ifscCode : 'SBIB0896778',
                branch : 'Bengaluru',
                accHoldersName : 'M&M'
            }).where({ purchaseOrderUuid: purchaseUUID });
        }

        if(response.d.itemsSet){
            var pvehicles = response.d.itemsSet.results;
            var deliverySet = {
                "so_item" : pvehicles.map(vehicle => ({
                    "so": soid,
                    "so_item_no":  vehicle.item_number,
                    "quantity": vehicle.target_qty,
                }))
            }
            console.log('deliverySet payload :', deliverySet);
        }

        var link2 = '/sap/Z_ODATA_DELIVERY_23_SRV/deliverySet'
        const response2 = await postSalesOrderData(deliverySet, link2);
        console.log('delivery : ', response2.d.delivery_code);
        if(response2.d.delivery_code) {
            await cds.update(PurchaseVehicle).set({ delId: response2.d.delivery_code}).where({ purchaseOrderUuid: purchaseUUID });
            return 'success';
        }   
    });


    this.on('sendForRelease', async (req) => {
        debugger
        const jsonString = req.data.data;  
        const po = JSON.parse(jsonString); 
        
        const data = await SELECT.one.from(PurchaseOrder).where({ purchaseOrderUuid: po.purchaseOrderUuid });

        const createdAt = data?.createdAt;
        console.log('created at', createdAt)
        const vehicle = await SELECT.from(PurchaseVehicle).where({ purchaseOrderUuid: po.purchaseOrderUuid });
        const vehicleDetails = JSON.stringify(vehicle);
        const customer = await SELECT.one.from(Customer).where({ customerId: data.customerId });
        const comments = await SELECT.from(PurchaseComments).where({ purchaseOrderUuid: po.purchaseOrderUuid });
        var commentDetails = JSON.stringify(comments);
        debugger
        var { div, dischnl, sorg, doc } =  await getDescription(po.purchaseOrderUuid, 'PO');

        // const oauthToken = await getOAuthTokenfinance();
        // const token = `Bearer ${oauthToken}`;
        const Auth = getXsuaaAuth();
        console.log('Authorization', Auth);
        const sAuth = JSON.stringify(Auth);
        const workflowData =
        {
            "definitionId": "us10.44f10b5ftrial.releaseso.sORelease",
            "context": {
                "customerid": customer.sapCustomerId || '',
                "_name": customer.name || '',
                "address": customer.address || '',
                "companyname": customer.companyName || '',
                "contactperson": data.contactPerson || '',
                "contactnumber": customer.phone || '',
                "email": customer.email || '',
                "van": customer.van || '',
                "jobtitle": customer.jobTitle || '',
                "department": customer.department || '',
                "currency": customer.Currency || '',
                "language": customer.Language || '',
                "country": customer.Country || '',
                "city": customer.City || '',
                "street": customer.Street || '',
                "postalcode": customer.postalCode || '',
                "_address": customer.location || '',
                "accnumber": data.accNumber || '',
                "ifsccode": data.ifscCode || '',
                "branch": data.branch || '',
                "accholdersname": data.accHoldersName || '',
                "duedate": data.dueDate || '',
                "vehiclelink": vehicleDetails || '',
                "commentlink": commentDetails || '',
                "quotationid": data.quotationID || '',
                "status": data.status || '',
                "doctype": doc || '',
                "salesorg": sorg || '',
                "dealercode": data.dealerCode || '',
                "division": div || '',
                "distributionchannels": dischnl || '',
                "poid": data.purchaseOrderUuid || '',
                "soid": data.salesOrderId || '',
                "totalprice": data.totalAmount || '',
                "taxamount": data.taxAmount || '',
                "grandtotal": data.grandTotal || '',
                "poreleasedate": createdAt || '',
                "bankname": data.bankName || '',
                "taxid": customer.taxId || '',
                "companycode": data.companyCode || '',
                "purchorg": data.purchOrg || '',
                "purchgroup": data.purchGroup || '',
                "vendorcode": data.vendorCode || '',
                "baseurl" : sAuth || ''  
            }
        }
         console.log(workflowData);
        
        var BPA_Trigger = await cds.connect.to("BPA_Trigger");
        var result = await BPA_Trigger.post('/workflow/rest/v1/workflow-instances', workflowData);
        console.log(result);
        const st = 'Sent for Release';
        await cds.update(PurchaseOrder).set({ status: st, soModifiedAt: new Date(), commentsText: null }).where({ purchaseOrderUuid: data.purchaseOrderUuid });
        console.log("Workflow started successfully:");
        return 'Sales Order Sent For Release';
    });



    this.after('READ', EnquiryVehicle.drafts, (req) => {
        for (const veh of req) {
            if (veh.mDiscount) {
                veh.isChecked = veh.mDiscount.includes('%'); // Compute based on discount value
                console.log(veh.mDiscount, veh.isChecked);
            } else {
                console.log(veh.mDiscount, 'else part');
                veh.isChecked = false;
            }
        }               
    });
    // this.after('READ', EnquiryVehicle, (req) => {
    //     for (const veh of req) {
    //         if (veh.mDiscount) {
    //             veh.isChecked = veh.mDiscount.includes('%'); // Compute based on discount value
    //             console.log(veh.mDiscount, veh.isChecked);
    //         } else {
    //             console.log('else part');
    //             veh.isChecked = false;
    //         }
    //     }               
    // });

    async function getDescription(pUuid, state) {
        debugger
        var data;
        if(state === 'PE') {
            data = await SELECT.one.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: pUuid });
        } else if(state === 'PO'){
            data = await SELECT.one.from(PurchaseOrder).where({ purchaseOrderUuid: pUuid });
        }
        if(data) {
            var divdescription = await SELECT.one('sHDescription2').from(SH).where({ sHId2: data.division, sHField2: 'Division' });
            var div = divdescription ? data.division + ` (${divdescription.sHDescription2})` : data.division;

            var distdescription = await SELECT.one('sHDescription2').from(SH).where({ sHId2: data.distributionChannels, sHField2: 'Distribution Channel' });
            var dischnl = distdescription ? data.distributionChannels + ` (${distdescription.sHDescription2})` : data.distributionChannels;

            var salesorgdescription = await SELECT.one('sHDescription').from(SH).where({ sHId: data.salesOrg, sHField: 'Sales Organisation' });
            var sorg = salesorgdescription ? data.salesOrg + ` (${salesorgdescription.sHDescription})` : data.salesOrg;

            var doctypedescription = await SELECT.one('sHDescription').from(SH).where({ sHId: data.docType, sHField: 'Document Type' });
            var doc = doctypedescription ? data.docType + ` (${doctypedescription.sHDescription})` : data.docType;
        }
        

        return {
            "div" : div,
            "dischnl" : dischnl,
            "sorg" : sorg,
            "doc" : doc
        }
    }

    this.on('getCustomers', async (req) => {
        debugger
        var BpaDest = await cds.connect.to("ABAP_Destinations");
        const link = '/sap/ZOD_CUSTOMER_014_SRV/CustomerSet';
        var result = await BpaDest.get(link);
        if(result){
            console.dir(result, { depth: null });

            var cust = result.map(data => ({
                "name" : data.Name,
                "City" : data.City,
                "postalCode" : data.PostalCode,
                "Street" : data.Street,
                "Country" : data.Country,
                "Currency" : data.Currency,
                "Language" : data.Language,
                "sapCustomerId" : data.CustomerNumber
            }))
            console.log('customer payload', cust);
            // await INSERT.into(Customer).entries(cust);
            return result;
        }
        return result;
    });


    this.on('getSH', async (req) => {
        debugger
        try {
            // Step 1: Connect to the destination and fetch data
            var BpaDest = await cds.connect.to("ABAP_Destinations");
            const link = '/sap/Z_SALESORDER_16_SRV/SalesDetailsSet';
            const link1 = '/sap/Z_ODATA_CREATE_PO_22_SRV/PurchaseDetailsSet?$top=100';
            var result = await BpaDest.get(link);
            var result1 = await BpaDest.get(link1);
            var deletedCount;
            if(result1 && Array.isArray(result1)){
                console.log('PO DATA',result1);
                 deletedCount = await DELETE.from(SH);
                console.log(`Deleted ${deletedCount} records from SH entity.`);
        
                for(let j = 0; j < result1.length; j++){
                    const output = result1[j];
                   
    
                    let entry1 = {
                        sHField: output.Name1 , 
                        sHDescription: output.Value1 ,
                        sHField2: output.Name2, 
                        sHId2: output.Value2,   
                        sHDescription2: output.Description2,
                        sHField3: output.Name3, 
                        sHId3: output.Value3,   
                        sHDescription3: output.Description3,
            
                    };
                    try {
                        // Insert the record into SH one by one
                        await INSERT.into(SH).entries(entry1);
                       
                    } catch (insertError) {
                        console.error(`Failed to insert Po record ${i + 1}:`, insertError);
                    }

                }
                }

            if (result && Array.isArray(result)) {
                let insertedCount = 0; 
                for (let i = 0; i < Math.min(result.length, 100); i++) {
                    const record = result[i];

                    // Prepare entry to insert
                    let entry = {
                        sHField: record.Name, 
                        sHId: record.Value,   
                        sHDescription: record.Description ,
                        sHField2: record.Name2, 
                        sHId2: record.Value2,   
                        sHDescription2: record.Description2
                    };

                    try {
                        await INSERT.into(SH).entries(entry);
                        insertedCount++; // Increment inserted count if successful
                    } catch (insertError) {
                        console.error(`Failed to insert record ${i + 1}:`, insertError);
                    }
                }

                console.log(`${insertedCount} records inserted into SH entity.`);
                return {
                    deletedRecords: deletedCount,
                    insertedRecords: insertedCount,
                    message: `Deleted ${deletedCount} records and inserted ${insertedCount} records into SH entity.`
                };
            } else {
                console.log("No result received or result is not an array, skipping processing.");

            }
        } catch (error) {
            console.error("Error occurred:", error);
            return {
                error: error.message || error
            };
        }

        //     try {
        //         const link = '/sap/Z_VEHICLEINVENTORY_SRV/Vehicle_InventorySet'
        //         var BpaDest = await cds.connect.to("ABAP_Destinations");
        //     var result = await BpaDest.get(link);
        //     console.log('Result is',result);
        //     if (result && Array.isArray(result)) {
        //         const deletedCount = await DELETE.from(VehicleInventory);
        //         await cds.run(INSERT.into(VehicleInventory).entries(result));
        //     }
        // }
        //     catch (error) {
        //         console.error("Error occurred:", error);
        //         return {
        //             error: error.message || error
        //         };
        //     }
    });
}

async function postSalesOrderData(payload, link) {
    debugger
    const destinationName = 'ABAP_Destinations';
    try {
        const destination = await getDestination({ destinationName });
        
        if (!destination || !destination.url) {
            throw new Error('Destination URL not found or destination not configured correctly.');
        }

        const odataUrl = `${destination.url}${link}`;
        console.log(odataUrl);
        const response = await executeHttpRequest(destination, {
            method: 'POST',
            url: odataUrl,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: payload,
            timeout: 30000
        });

        return response.data;

    } 
    catch (error)
    {
        console.error('Error in ABAP Call:', error.message || error.response?.data);
        throw error;
    }
}





