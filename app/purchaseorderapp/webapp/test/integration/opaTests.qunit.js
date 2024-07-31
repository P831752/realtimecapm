sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/ats/purchaseorderapp/test/integration/FirstJourney',
		'com/ats/purchaseorderapp/test/integration/pages/POsList',
		'com/ats/purchaseorderapp/test/integration/pages/POsObjectPage',
		'com/ats/purchaseorderapp/test/integration/pages/PurchaseOrderItemsObjectPage'
    ],
    function(JourneyRunner, opaJourney, POsList, POsObjectPage, PurchaseOrderItemsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/ats/purchaseorderapp') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThePOsList: POsList,
					onThePOsObjectPage: POsObjectPage,
					onThePurchaseOrderItemsObjectPage: PurchaseOrderItemsObjectPage
                }
            },
            opaJourney.run
        );
    }
);