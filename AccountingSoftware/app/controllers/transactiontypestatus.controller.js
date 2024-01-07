const transactiontypestatus = require("../models/transactiontypestatus.model");
const logger = require("../utils/loggerHelper");
const helper = require("../utils/helper");
const testData = require("../config/testdata-config");
const { log } = require("winston");
// const token = require("../utils/token");

exports.delete = async (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    let ttsFindById = await transactiontypestatus.findById(req.params.id, tenantId, username, "TransactionTypeStatus_delete");

    if (ttsFindById == "404") {
        logger.loggerHelper(tenantId, username, "TransactionTypeStatus_delete", logger.logType.error, `Record not found for Id: ${req.params.id}`);
        return res.status(404).send({
            message: "TransactionTypeStatus not found."
        });
    }

    transactiontypestatus.delete(req.params.id, tenantId, username).then(() => {
        logger.loggerHelper(tenantId, username, "TransactionTypeStatus_delete", logger.logType.debug, `Record deleted for Id: ${req.params.id}`);
        res.status(204).send();
    }).catch((err) => {
        logger.loggerHelper(tenantId, username, "TransactionTypeStatus_delete", logger.logType.error, `Error occurred for Id: ${req.params.id}, Error: ${err}`);
        res.sendStatus(500).send();
    })
}

exports.fetchAll = (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    transactiontypestatus.getAll(tenantId, username).then((atbResp) => {
        logger.loggerHelper(tenantId, username, "TransactionTypeStatus_fetchAll", logger.logType.debug, `Record received`);
        res.status(200).send(atbResp);
    }).catch((err) => {
        logger.loggerHelper(tenantId, username, "TransactionTypeStatus_fetchAll", logger.logType.error, `Error occurred`);
        res.sendStatus(500).send();
    });
}

exports.fetchById = (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    transactiontypestatus.findById(req.params.id, tenantId, username, "TransactionTypeStatus_fetchById").then((ttsResp) => {
        logger.loggerHelper(tenantId, username, "TransactionTypeStatus_fetchById", logger.logType.debug, `Record Received for Id: ${req.params.id}`);
        res.status(200).send(ttsResp);
    }).catch((err) => {
        logger.loggerHelper(tenantId, username, "TransactionTypeStatus_fetchById", logger.logType.error, `Error occurred for Id: ${req.params.id}, Error: ${err}`);
        res.sendStatus(500).send();
    })
}

exports.update = async (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    // Validate request
    if (!Object.keys(req.body).length) {
        logger.loggerHelper(tenantId, username, "TransactionTypeStatus_update", logger.logType.error, "Empty Content");
        res.status(400).send({
            message: "Content can not be empty!"
        });
    } else {
        let ttsFindById = await transactiontypestatus.findById(req.params.id, tenantId, username, "TransactionTypeStatus_update");

        if (ttsFindById == "404") {
            logger.loggerHelper(tenantId, username, "TransactionTypeStatus_update", logger.logType.error, `Record not found for Id: ${req.params.id}`);
            return res.status(404).send({
                message: "TransactionTypeStatus not found."
            });
        }

        let tts = {
            Id: ttsFindById[0].Id,
            Name: helper.isEmpty(req.body.Name) ? ttsFindById[0].Name : req.body.Name,
            Active: helper.isEmpty(req.body.Active) ? ttsFindById[0].Active : req.body.Active,
            TenantId: helper.isEmpty(req.body.TenantId) ? ttsFindById[0].TenantId : req.body.TenantId,
            UpdatedOn: new Date(),
            UpdatedBy: "from_token" // Get ths value from Bearer Token
        };

        await transactiontypestatus.update(tts, username).catch((err) => {
            logger.loggerHelper("TransactionTypeStatus_update", "error", "Tax Type: " + tts.Id + ", error:" + err);
            return res.status(500).send();
        });

        res.status(200).send();
    }
}

exports.create = (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    // Validate request
    if (!Object.keys(req.body).length) {
        logger.loggerHelper(tenantId, username, "TransactionTypeStatus_create", logger.logType.error, "Empty Content");
        res.status(400).send({
            message: "Content can not be empty!"
        });
    } else {

        // Create a Transaction Type Status
        let tts = {
            Name: req.body.Name,
            Active: req.body.Active,
            TenantId: req.body.TenantId,
            CreatedOn: new Date(),
            CreatedBy: "from_token" // Get ths value from Bearer Token
        };

        transactiontypestatus.create(tts, username).then((ttsResp) => {
            logger.loggerHelper(tenantId, username, "TransactionTypeStatus_create", logger.logType.debug, `Record created for tts Name: ${tts.Name}`);
            res.send(ttsResp);
        }).catch((err) => {
            if (err.includes("Duplicate entry")) {
                logger.loggerHelper(tenantId, username, "TransactionTypeStatus_create", logger.logType.error, `Duplicate record for tts Name: ${tts.Name}, Error: ${err}`);
                return res.sendStatus(409);
            }
            logger.loggerHelper(tenantId, username, "TransactionTypeStatus_create", logger.logType.error, `Error occurred for tts Name: ${tts.Name}, Error: ${err}`);
            res.sendStatus(500).send();
        })
    }
}