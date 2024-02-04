module.exports = (app) => {
  var router = require('express').Router()
  const tutorials = require('../controllers/tutorial.controller.js')
  const taxtype = require('../controllers/taxtype.controller.js')
  const uom = require('../controllers/uom.controller.js')
  const categorydetail = require('../controllers/categorydetail.controller.js')
  const transactiontypeconfig = require('../controllers/transactiontypeconfig.controller.js')
  const organizationdetail = require('../controllers/organiztiondetail.controller.js')
  const uomfactor = require('../controllers/uomfactor.controller.js')
  const transactiontype = require('../controllers/transactiontype.controller')
  const accounttypebase = require('../controllers/accounttypebase.controller')
  const transactiontypestatus = require('../controllers/transactiontypestatus.controller.js')
  const contactaddresstype = require('../controllers/contactaddresstype.controller.js')
  const taxgroup = require('../controllers/taxgroup.controller.js')
  const taxgrouptaxtypemapper = require('../controllers/taxgrouptaxtypemapper.controller.js')
  const mapprovider = require('../controllers/mapprovider.controller.js')
  const locationdetail = require('../controllers/locationdetail.controller.js')
  const mapproviderlocationmapper = require('../controllers/mapproviderlocationmapper.controller.js')
  const contactdetail = require('../controllers/contactdetail.controller.js')
  const roles = require('../config/roles.json')

  const keycloak = require('../config/keycloak-config.js').getKeycloak()

  router.use(async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    res.header(
      'Access-Control-Allow-Methods',
      'POST, PUT, PATCH, GET, DELETE, OPTIONS'
    )

    var authorizerval = require('../utils/authorizervalidator.js')
    var result = await authorizerval.authorization(req, res, next)

    if (!result) {
      return res.status(401).send()
    }

    return next()
  })

  // Tax Types Operations
  // router.get("/taxtypes", keycloak.protect(["user", "admin", "superadmin"]), taxtype.fetchAllTaxTypes);
  // router.get("/taxtypes", keycloak.protect(taxtypesRoles), taxtype.fetchAllTaxTypes);
  // router.get("/taxtypes", keycloak.protect(), taxtype.fetchAllTaxTypes);
  // router.get("/taxtype/:id", keycloak.protect(), taxtype.fetchTaxTypeById);
  router.get('/taxtypes', taxtype.fetchAllTaxTypes)
  router.get('/taxtype/:id', taxtype.fetchTaxTypeById)
  router.delete('/taxtypes/:id', taxtype.deleteTaxType)
  router.post('/taxtypes', taxtype.createTaxType)
  router.put('/taxtypes/:id', taxtype.updateTaxType)

  // UOM Operations
  router.get('/uoms', uom.fetchAllUOMs)
  router.get('/uom/:id', uom.fetchUOMById)
  router.post('/uom', uom.createUOM)
  router.delete('/uom/:id', uom.deleteUOM)
  router.put('/uom/:id', uom.updateUOM)

  //CategoryDetail Operations
  router.get('/cds', categorydetail.fetchAllCategoryDetails)
  router.get('/cd/:id', categorydetail.fetchCategoryDetailById)
  router.post('/cd', categorydetail.createCategoryDetail)
  router.delete('/cd/:id', categorydetail.deleteCategoryDetail)
  router.put('/cd/:id', categorydetail.updateCategoryDetail)

  // TransactionTypeConfig Operations
  router.get('/ttcs', transactiontypeconfig.fetchAll)
  router.get('/ttc/:id', transactiontypeconfig.fetchById)
  router.post('/ttc', transactiontypeconfig.create)
  router.delete('/ttc/:id', transactiontypeconfig.delete)
  router.put('/ttc/:id', transactiontypeconfig.update)

  // Organization Detail Operations
  router.get('/ods', organizationdetail.fetchAll)
  router.get('/od/:id', organizationdetail.fetchById)
  router.post('/od', organizationdetail.create)
  router.delete('/od/:id', organizationdetail.delete)
  router.put('/od/:id', organizationdetail.update)

  // UOMFactor Operations
  router.get('/uomfs', uomfactor.fetchAll)
  router.get('/uomf/:id', uomfactor.fetchById)
  router.post('/uomf', uomfactor.create)
  router.delete('/uomf/:id', uomfactor.delete)
  router.put('/uomf/:id', uomfactor.update)

  // Transaction Type Operations
  router.get('/transactiontypes', transactiontype.fetchAll)
  router.get('/transactiontype/:id', transactiontype.fetchById)
  router.post('/transactiontype', transactiontype.create)
  router.delete('/transactiontype/:id', transactiontype.delete)
  router.put('/transactiontype/:id', transactiontype.update)

  // Account Type Base Operations
  router.get('/atbs', accounttypebase.fetchAll)
  router.get('/atb/:id', accounttypebase.fetchById)
  router.post('/atb', accounttypebase.create)
  router.delete('/atb/:id', accounttypebase.delete)
  router.put('/atb/:id', accounttypebase.update)

  // Transaction Type Status Operations
  router.get('/ttss', transactiontypestatus.fetchAll)
  router.get('/tts/:id', transactiontypestatus.fetchById)
  router.post('/tts', transactiontypestatus.create)
  router.delete('/tts/:id', transactiontypestatus.delete)
  router.put('/tts/:id', transactiontypestatus.update)

  // Contact Address Type Operations
  router.get('/cats', contactaddresstype.fetchAll)
  router.get('/cat/:id', contactaddresstype.fetchById)
  router.post('/cat', contactaddresstype.create)
  router.delete('/cat/:id', contactaddresstype.delete)
  router.put('/cat/:id', contactaddresstype.update)

  // Tax Group Opertaions
  router.get('/taxgs', taxgroup.fetchAll)
  router.get('/taxg/:id', taxgroup.fetchById)
  router.post('/taxg', taxgroup.create)
  router.delete('/taxg/:id', taxgroup.delete)
  router.put('/taxg/:id', taxgroup.update)

  // Tax Group Tax Type Mapper Opertaions
  router.get('/tgtyms', taxgrouptaxtypemapper.fetchAll)
  router.get('/tgtym/search', taxgrouptaxtypemapper.search)
  router.get('/tgtym/:id', taxgrouptaxtypemapper.fetchById)
  router.post('/tgtym', taxgrouptaxtypemapper.create)
  router.delete('/tgtym/:id', taxgrouptaxtypemapper.delete)
  router.put('/tgtym/:id', taxgrouptaxtypemapper.update)

  // Map Provider Detail Operations
  router.get('/mapps', mapprovider.fetchAll)
  router.get('/mapp/:id', mapprovider.fetchById)
  router.post('/mapp', mapprovider.create)
  router.delete('/mapp/:id', mapprovider.delete)
  router.put('/mapp/:id', mapprovider.update)

  // Location Detail Operation
  router.get('/locds', locationdetail.fetchAll)
  router.get('/locd/:id', locationdetail.fetchById)
  router.post('/locd', locationdetail.create)
  router.delete('/locd/:id', locationdetail.delete)
  router.put('/locd/:id', locationdetail.update)

  // Map Provider Location Mapper Operations
  router.get('/mplms', mapproviderlocationmapper.fetchAll)
  router.get('/mplm/:id', mapproviderlocationmapper.fetchById)
  router.post('/mplm', mapproviderlocationmapper.create)
  router.delete('/mplm/:id', mapproviderlocationmapper.delete)
  router.put('/mplm/:id', mapproviderlocationmapper.update)

  // Contact Detail Operations
  router.get('/contactds', contactdetail.fetchAll)
  router.get('/contactd/search', contactdetail.search)
  router.get('/contactd/:id', contactdetail.fetchById)
  router.post('/contactd', contactdetail.create)
  router.delete('/contactd/:id', contactdetail.delete)
  router.put('/contactd/:id', contactdetail.update)

  // Address Detail Operations

  // Cost Info Operations
  // Batch Detail Operations
  // Item Operations
  // Branch Detail Operations

  // Transaction Type Base Conversion Opertions
  // Transaction Type Counter Operations -- Need to see for this usage
  // Transaction Detail log Operations
  // Transaction Item Detail Operations

  // Payment Received Type Operations
  // Payment Mode Operations
  // Payment Mode Transaction Detail Operations
  // Payment Detail Operations
  // Payment Breakup Operations
  // Account Type Base Profile Operations

  // // Create a new Tutorial
  // router.post("/", tutorials.create);

  // // Retrieve all Tutorials
  // router.get("/", tutorials.findAll);

  // // Retrieve all published Tutorials
  // router.get("/published", tutorials.findAllPublished);

  // // Retrieve a single Tutorial with id
  // router.get("/:id", tutorials.findOne);

  // // Update a Tutorial with id
  // router.put("/:id", tutorials.update);

  // // Delete a Tutorial with id
  // router.delete("/:id", tutorials.delete);

  // // Delete all Tutorials
  // router.delete("/", tutorials.deleteAll);

  app.use('/api', router)
}
