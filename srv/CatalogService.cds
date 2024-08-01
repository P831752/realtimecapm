namespace realdbtask.srv;
using {anubhav.db.master as master} from '../db/datamodel';
using {anubhav.db.transaction as transaction} from '../db/datamodel';
using { cappo.cds } from '../db/CDSViews';

//changes are from VS tool

service CatalogService {
    //@readonly
    entity EmployeeSet @(restrict: [ 
                        { grant: ['READ'], to: 'Viewer', where: 'bankName = $user.BankName' },
                        { grant: ['WRITE'], to: 'Admin' }
                        ]) as projection on master.employees;
   
     entity BusinessPartnerSet as projection on master.businesspartner;
     //entity POs as projection on transaction.purchaseorder;

    //entity ProductView as projection on cds.CDSViews.ProductView;
    //  entity ProductView as projection on cds.CDSViews.ProductView {
    //     *,
    //     To_Items
    //  }actions{
    //     action boost();
    //     function largestOrder() returns array of POs;
    //  };
       entity PurchaseOrderItems as projection on transaction.poitems;
       entity POs @(odata.draft.enabled: true) as projection on transaction.purchaseorder{
        *,
        round(GROSS_AMOUNT) as GROSS_AMOUNT: Decimal(10,2),
        case OVERALL_STATUS
            when 'N' then 'New'
            when 'P' then 'Paid'
            when 'A' then 'Approved'
            when 'B' then 'Rejected'
            else 'Delivered' end as OVERALL_STATUS: String(20),
        case OVERALL_STATUS
            when 'N' then 3
            when 'P' then 1
            when 'A' then 4
            when 'B' then 2
            end as Criticality: Integer,
        Items: redirected to PurchaseOrderItems
    }actions{
        //definition
        @cds.odata.bindingparameter.name: '_ibm'
        @Common.SideEffects:{
            TargetProperties:['_ibm/GROSS_AMOUNT']
        }

        action boost();
        function largestOrder() returns array of POs;
    };

    entity ReadEmployeeSet as projection on master.employees;
}
