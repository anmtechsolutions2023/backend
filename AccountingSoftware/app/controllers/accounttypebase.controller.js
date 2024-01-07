const accounttypebase = require("../models/accounttypebase.model");
const logger = require("../utils/loggerHelper");
const helper = require("../utils/helper");
const testData = require("../config/testdata-config");
// const token = require("../utils/token");

exports.delete = async (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    let atbFindById = await accounttypebase.findById(req.params.id, tenantId, username, "AccountTypeBase_delete");

    if (atbFindById == "404") {
        logger.loggerHelper(tenantId, username, "AccountTypeBase_delete", logger.logType.error, `Record not found for Id: ${req.params.id}`);
        return res.status(404).send({
            message: "AccountTypeBase not found."
        });
    }

    accounttypebase.delete(req.params.id, tenantId, username).then(() => {
        logger.loggerHelper(tenantId, username, "AccountTypeBase_delete", logger.logType.debug, `Record deleted for Id: ${req.params.id}`);
        res.status(204).send();
    }).catch((err) => {
        logger.loggerHelper(tenantId, username, "AccountTypeBase_delete", logger.logType.error, `Error occurred for Id: ${req.params.id}, Error: ${err}`);
        res.sendStatus(500).send();
    })
}

exports.fetchAll = (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    accounttypebase.getAll(tenantId, username).then((atbResp) => {
        logger.loggerHelper(tenantId, username, "AccountTypeBase_getAll", logger.logType.debug, "Success");
        res.status(200).send(atbResp);
    }).catch((err) => {
        logger.loggerHelper(tenantId, username, "AccountTypeBase_getAll", logger.logType.error, `Error occurred, Error: ${err}`);
        res.sendStatus(500).send();
    });
}

exports.fetchById = (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    accounttypebase.findById(req.params.id, tenantId, username, "AccountTypeBase_fetchById").then((atbResp) => {
        logger.loggerHelper(tenantId, username, "AccountTypeBase_fetchById", logger.logType.debug, `Record found for Id: ${req.params.id}`);
        res.status(200).send(atbResp);
    }).catch((err) => {
        logger.loggerHelper(tenantId, username, "AccountTypeBase_fetchById", logger.logType.error, `Error occurred for Id: ${req.params.id}, Error: ${err}`);
        res.sendStatus(500).send();
    })
}

exports.update = async (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    // Validate request
    if (!Object.keys(req.body).length) {
        logger.loggerHelper(tenantId, username, "AccountTypeBase_update", logger.logType.error, "Empty Content");
        res.status(400).send({
            message: "Content can not be empty!"
        });
    } else {
        let atbFindById = await accounttypebase.findById(req.params.id, tenantId, username, "AccountTypeBase_update");

        if (atbFindById == "404") {
            logger.loggerHelper(tenantId, username, "AccountTypeBase_update", logger.logType.error, `Record not found for Id: ${req.params.id}`);
            return res.status(404).send({
                message: "AccountTypeBase not found."
            });
        }

        let atb = {
            Id: atbFindById[0].Id,
            Name: helper.isEmpty(req.body.Name) ? atbFindById[0].Name : req.body.Name,
            Active: helper.isEmpty(req.body.Active) ? atbFindById[0].Active : req.body.Active,
            TenantId: helper.isEmpty(req.body.TenantId) ? atbFindById[0].TenantId : req.body.TenantId,
            UpdatedOn: new Date(),
            UpdatedBy: "from_token" // Get ths value from Bearer Token
        };

        await accounttypebase.update(atb, username).then(() => {
            logger.loggerHelper(tenantId, username, "AccountTypeBase_update", logger.logType.debug, `Record updated of Id: ${atb.Id}`);
            res.status(200).send();
        }).catch((err) => {
            logger.loggerHelper(tenantId, username, "AccountTypeBase_update", logger.logType.error, `Error occurred of Id: ${atb.Id}, Error: ${err}`);
            return res.status(500).send();
        });

    }
}

exports.create = (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    // Validate request
    if (!Object.keys(req.body).length) {
        logger.loggerHelper(tenantId, username, "AccountTypeBase_create", logger.logType.error, "Empty Content");
        res.status(400).send({
            message: "Content can not be empty!"
        });
    } else {

        // Create a Account Type Base
        let atb = {
            Name: req.body.Name,
            Active: req.body.Active,
            TenantId: req.body.TenantId,
            CreatedOn: new Date(),
            CreatedBy: "from_token" // Get ths value from Bearer Token
        };

        accounttypebase.create(atb, username).then((atbResp) => {
            logger.loggerHelper("AccountTypeBase_create", "debug", atb.Name + " Success");
            res.send(atbResp);
        }).catch((err) => {
            if (err.includes("Duplicate entry")) {
                logger.loggerHelper("AccountTypeBase_create", "error", "Duplicate Entry," + err);
                return res.sendStatus(409);
            }
            logger.loggerHelper("AccountTypeBase_create", "error", err);
            res.sendStatus(500).send();
        })
    }
}