module.exports = cds.service.impl( async function(){
  
    //Step 1: get the object of our odata entities
    const { EmployeeSet, POs, ReadEmployeeSet } = this.entities;

    this.before(['CREATE','UPDATE'], EmployeeSet, async(req,res) =>{
        console.log("BEFORE - Salary came:" +req.data.salaryAmount);
        if(parseFloat(req.data.salaryAmount) >= 1000){
            //throw an exception - reach to CAPM, it terminate the operation
            req.error(500,"The salary value not allowed!");
        }
    });

    this.on(['CREATE','UPDATE'], EmployeeSet, async (req, res) => {
        console.log("*** ON *****");
        
    });

    this.after(['CREATE','UPDATE'], EmployeeSet, async (req, res) => {
        console.log("AFTER - salary taken by WIFEEEEE");
        
    });

    this.on('boost', async (req,res) => {
        try {
            const ID = req.params[0];
            console.log("Hey Amigo, Your purchase order with id " + req.params[0] + " will be boosted");
            const tx = cds.tx(req);
            await tx.update(POs).with({
                GROSS_AMOUNT: { '+=' : 20000 },
                NOTE: 'Boosted!!'
            }).where(ID);
        } catch (error) {
            return "Error " + error.toString();
        }
    });

    this.on('largestOrder', async (req,res) => {
        try {
            const ID = req.params[0];
            const tx = cds.tx(req);
            
            //SELECT * UPTO 1 ROW FROM dbtab ORDER BY GROSS_AMOUNT desc
            const reply = await tx.read(POs).orderBy({
                GROSS_AMOUNT: 'desc'
            }).limit(1);

            return reply;
        } catch (error) {
            return "Error " + error.toString();
        }
    });

    this.on('READ', ReadEmployeeSet, async (req, res) => {
    //    return{
    //     "ID": "Dummy",
    //     "nameFirst": "Sally",
    //     "nameMiddle": null,
    //     "nameLast": "Spring",
    //     "nameInitials": null,
    //     "sex": "F",
    //    };

    //Read from custom entity
    const {employees} = cds.entities("anubhav.db.master");
    //Example 2: Manually extraction of data using CDS QL
    const cdstx = await cds.tx(req);
    const results = await cdstx.run(SELECT.from(employees).limit(5)
    .where({salaryAmount: {'>=' : 90000}})) ;

    return results;
        
    });

})