const uomfactor = require("../models/uomfactor.model");
const logger = require("../utils/loggerHelper");
const helper = require("../utils/helper");
const testData = require("../config/testdata-config");

exports.update = async (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    // Validate request
    if (!Object.keys(req.body).length) {
        logger.loggerHelper(tenantId, username, "UOMFactor_update", logger.logType.error, "Empty Content");
        res.status(400).send({
            message: "Content can not be empty!"
        });
    } else {
        let uomfFindById = await uomfactor.findById(req.params.id, tenantId, username, "UOMFactor_update");

        if (uomfFindById == "404") {
            logger.loggerHelper(tenantId, username, "UOMFactor_update", logger.logType.error, `Record not found for Id: ${req.params.id}`);
            return res.status(404).send({
                message: "UOMFactor not found."
            });
        }

        let updateuomf = {
            Id: uomfFindById[0].Id,
            PrimaryUOMId: helper.isEmpty(req.body.PrimaryUOMId) ? uomfFindById[0].PrimaryUOMId : req.body.PrimaryUOMId,
            SecondaryUOMId: helper.isEmpty(req.body.SecondaryUOMId) ? uomfFindById[0].SecondaryUOMId : req.body.SecondaryUOMId,
            Factor: helper.isEmpty(req.body.Factor) ? uomfFindById[0].Factor : req.body.Factor,
            Active: helper.isEmpty(req.body.Active) ? uomfFindById[0].Active : req.body.Active,
            TenantId: helper.isEmpty(req.body.TenantId) ? uomfFindById[0].TenantId : req.body.TenantId,
            UpdatedOn: new Date(),
            UpdatedBy: "from_token" // Get ths value from Bearer Token
        };

        await uomfactor.update(updateuomf, username).then(() => {
            logger.loggerHelper(tenantId, username, "UOMFactor_update", logger.logType.debug, `Record updated for Id: ${updateuomf.Id}`);
            res.status(200).send();
        }).catch((err) => {
            logger.loggerHelper(tenantId, username, "UOMFactor_update", logger.logType.error, `Error occurred for Id: ${updateuomf.Id}, Error: ${err}`);
            return res.status(500).send();
        });
    }
}

exports.delete = async (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    let uomfFindById = await uomfactor.findById(req.params.id, tenantId, username, "UOMFactor_delete");

    if (uomfFindById == "404") {
        logger.loggerHelper(tenantId, username, "UOMFactor_delete", logger.logType.debug, `Record not found for Id: ${req.params.id}`);
        return res.status(404).send({
            message: "UOMFactor not found."
        });
    }

    uomfactor.delete(req.params.id, tenantId, username).then(() => {
        logger.loggerHelper(tenantId.username, "UOMFactor_delete", logger.logType.debug, `Record deleted for Id: ${id}`);
        res.status(204).send();
    }).catch((err) => {
        logger.loggerHelper(tenantId, username, "UOMFactor_delete", logger.logType.error, `Error occurred for Id: ${id}, Error: ${err}`);
        res.sendStatus(500).send();
    })
}

exports.fetchAll = (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    uomfactor.getAll(tenantId, username).then((uomf) => {

        let uomfDetail = [];
        uomf.map((uf) => {

            let primaryuom = {
                PrimaryUOMId: uf.PrimaryUOMId,
                PrimaryUOMName: uf.PrimaryUnitName,
                PrimaryUOMActive: uf.PrimaryUnitNameActive
            }

            let secondaryuom = {
                SecondaryUOMId: uf.SecondaryUOMId,
                SecondaryUOMName: uf.SecondayUnitName,
                SecondaryUOMActive: uf.SecondayUnitActive
            }

            let uomf = {
                Id: uf.Id,
                Factor: uf.Factor,
                TenantId: uf.TenantId,
                Active: uf.Active,
                PrimaryUOM: primaryuom,
                SecondayUOM: secondaryuom
            }

            uomfDetail.push(uomf);
        })


        logger.loggerHelper(tenantId, username, "UOMFactor_fetchAll", logger.logType.debug, "Success");
        res.send(uomfDetail);
    }).catch((err) => {
        logger.loggerHelper(tenantId, username, "UOMFactor_fetchAll", logger.logType.error, `Error: ${err}`);
        res.sendStatus(500).send();
    });
}

exports.fetchById = (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    uomfactor.findById(req.params.id, tenantId, username, "UOMFactor_fetchById").then((uomf) => {

        if (uomf === 404) {
            logger.loggerHelper(tenantId, username, "UOMFactor_fetchById", logger.logType.debug, `Record not found for Id: ${req.params.id}`)
            return res.send(uomf);
        }

        let uomfDetail = [];
        uomf.map((uf) => {

            let primaryuom = {
                PrimaryUOMId: uf.PrimaryUOMId,
                PrimaryUOMName: uf.PrimaryUnitName,
                PrimaryUOMActive: uf.PrimaryUnitNameActive
            }

            let secondaryuom = {
                SecondaryUOMId: uf.SecondaryUOMId,
                SecondaryUOMName: uf.SecondayUnitName,
                SecondaryUOMActive: uf.SecondayUnitActive
            }

            let uomf = {
                Id: uf.Id,
                Factor: uf.Factor,
                TenantId: uf.TenantId,
                Active: uf.Active,
                PrimaryUOM: primaryuom,
                SecondayUOM: secondaryuom
            }

            uomfDetail.push(uomf);
        })

        logger.loggerHelper(tenantId, username, "UOMFactor_fetchById", logger.logType.debug, `Record found for Id: ${req.params.id}`);
        res.send(uomfDetail);
    }).catch((err) => {
        logger.loggerHelper(tenantId, username, "UOMFactor_fetchById", logger.logType.error, `Error occurred for Id: ${req.params.id}, Error: ${err}`);
        res.sendStatus(500).send();
    })
}


exports.create = (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    // Validate request
    if (!Object.keys(req.body).length) {
        logger.loggerHelper(tenantId, username, "UOMFactor_create", logger.logType.error, "Empty Content");
        res.status(400).send({
            message: "Content can not be empty!"
        });
    } else {

        // Create a UOM Factor
        let uomf = {
            PrimaryUOMId: req.body.PrimaryUOMId,
            SecondaryUOMId: req.body.SecondaryUOMId,
            Factor: req.body.Factor,
            Active: req.body.Active,
            TenantId: req.body.TenantId,
            CreatedOn: new Date(),
            CreatedBy: "from_token" // Get ths value from Bearer Token
        };

        uomfactor.create(uomf, username).then((uomfResp) => {
            logger.loggerHelper(tenantId, username, "UOMFactor_create", logger.logType.debug, `Record created with Id: ${uomfResp}`);
            res.send(uomfResp);
        }).catch((err) => {
            if (err.includes("Duplicate entry")) {
                logger.loggerHelper(tenantId, username, "UOMFactor_create", logger.logType.error, `Duplicate record for Factor: ${uomf.Factor}, Error: ${err}`);
                return res.sendStatus(409);
            }
            logger.loggerHelper(tenantId, username, "UOMFactor_create", logger.logType.error, `Error occurred for uomf Factor: ${uomf.Factor}, Error: ${err}`);
            res.sendStatus(500).send();
        });
    }
}