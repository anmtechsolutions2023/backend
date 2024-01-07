const transactiontype = require("../models/transactiontype.model");
const logger = require("../utils/loggerHelper");
const helper = require("../utils/helper");
const testData = require("../config/testdata-config");

exports.update = async (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    // Validate request
    if (!Object.keys(req.body).length) {
        logger.loggerHelper(tenantId, username, "TransactionType_update", logger.logType.error, "Empty Content");
        res.status(400).send({
            message: "Content can not be empty!"
        });
    } else {
        let ttFindById = await transactiontype.findById(req.params.id, tenantId, username, "TransactionType_update");

        if (ttFindById == "404") {
            logger.loggerHelper(tenantId, username, "TransactionType_update", logger.logType.error, `Record not found for Id: ${req.params.id}`);
            return res.status(404).send({
                message: "Transaction Type not found."
            });
        }

        let updatedtt = {
            Id: ttFindById[0].Id,
            Name: helper.isEmpty(req.body.Name) ? ttFindById[0].Name : req.body.Name,
            TransactionTypeConfigId: helper.isEmpty(req.body.TransactionTypeConfigId) ? ttFindById[0].TransactionTypeConfigId : req.body.TransactionTypeConfigId,
            Active: helper.isEmpty(req.body.Active) ? ttFindById[0].Active : req.body.Active,
            TenantId: helper.isEmpty(req.body.TenantId) ? ttFindById[0].TenantId : req.body.TenantId,
            UpdatedOn: new Date(),
            UpdatedBy: "from_token" // Get ths value from Bearer Token
        };

        await transactiontype.update(updatedtt, username).then(() => {
            logger.loggerHelper(tenantId, username, "TransactionType_update", logger.logType.debug, `Record updated for Id: ${updatedtt.Id}`);
            res.status(200).send();
        }).catch((err) => {
            logger.loggerHelper(tenantId, username, "TransactionType_update", logger.logType.debug, `Error occurred for Id: ${updatedtt.Id}, Error: ${err}`);
            return res.status(500).send();
        });
    }
}

exports.delete = async (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    let ttFindById = await transactiontype.findById(req.params.id, tenantId, username, "TransactionType_delete");

    if (ttFindById == "404") {
        logger.loggerHelper("TransactionType_delete", "error", "TransactionType not found:" + req.params.id);
        return res.status(404).send({
            message: "TransactionType not found."
        });
    }

    transactiontype.delete(req.params.id, tenantId, username).then(() => {
        logger.loggerHelper(tenantId, username, "TransactionType_delete", logger.logType.debug, `Record deleted for Id: ${req.params.id}`);
        res.status(204).send();
    }).catch((err) => {
        logger.loggerHelper(tenantId, username, "TransactionType_delete", logger.logType.error, `Error occurrd for Id: ${id}, Error: ${err}`);
        res.sendStatus(500).send();
    })
}

exports.fetchAll = (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    transactiontype.getAll(tenantId, username).then((tt) => {

        let ttDetail = [];
        tt.map((t) => {

            let ttc = {
                TTCId: t.TTCId,
                TTCStartCounterNo: t.TTCStartCounterNo,
                TTCPrefix: t.TTCPrefix,
                TTCFormat: t.TTCFormat,
                TTCActive: t.TTCActive,
                TTCTenantId: t.TTCTenantId
            }

            let transactiontype = {
                Id: t.Id,
                Name: t.Name,
                TransactionTypeConfigId: t.TransactionTypeConfigId,
                Active: t.Active,
                TenantId: t.TenantId,
                TransactionTypeConfig: ttc
            }

            ttDetail.push(transactiontype);
        })

        logger.loggerHelper(tenantId, username, "TransactionType_fetchAll", logger.logType.debug, "Success");
        res.send(ttDetail);
    }).catch((err) => {
        logger.loggerHelper(tenantId, username, "TransactionType_fetchAll", logger.logType.error, `Error occurred, Error: ${err}`);
        res.sendStatus(500).send();
    });
}

exports.fetchById = (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    transactiontype.findById(req.params.id, tenantId, username, "TransactionType_fetchById").then((ttResp) => {

        if (ttResp === 404) {
            logger.loggerHelper(tenantId, username, "TransactionType_fetchById", logger.logType.error, `Record not found for Id: ${req.params.id}`);
            return res.send(ttResp);
        }

        let ttDetail = [];
        ttResp.map((t) => {

            let ttc = {
                TTCId: t.TTCId,
                TTCStartCounterNo: t.TTCStartCounterNo,
                TTCPrefix: t.TTCPrefix,
                TTCFormat: t.TTCFormat,
                TTCActive: t.TTCActive,
                TTCTenantId: t.TTCTenantId
            }

            let transactiontype = {
                Id: t.Id,
                Name: t.Name,
                TransactionTypeConfigId: t.TransactionTypeConfigId,
                Active: t.Active,
                TenantId: t.TenantId,
                TransactionTypeConfig: ttc
            }

            ttDetail.push(transactiontype);
        })

        logger.loggerHelper(tenantId, username, "TransactionType_fetchById", logger.logType.debug, `Record found for Id: ${req.params.id}`);
        res.send(ttDetail);
    }).catch((err) => {
        logger.loggerHelper(tenantId, username, "TransactionType_fetchById", logger.logType.error, `Error occurred for Id: ${req.params.id}, Error: ${err}`);
        res.sendStatus(500).send();
    })
}


exports.create = (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    // Validate request
    if (!Object.keys(req.body).length) {
        logger.loggerHelper(tenantId, username, "TransactionType_create", logger.logType.error, "Empty Content");
        res.status(400).send({
            message: "Content can not be empty!"
        });
    } else {

        // Create a Transaction Type
        let ttDetail = {
            Name: req.body.Name,
            TransactionTypeConfigId: req.body.TransactionTypeConfigId,
            Active: req.body.Active,
            TenantId: req.body.TenantId,
            CreatedOn: new Date(),
            CreatedBy: "from_token" // Get ths value from Bearer Token
        };

        transactiontype.create(ttDetail, username).then((ttResp) => {
            logger.loggerHelper(tenantId, username, "TransactionType", logger.logType.debug, `Record created for tt name: ${ttDetail.Name} with Id: ${ttResp}`);
            res.send(ttResp);
        }).catch((err) => {
            if (err.includes("Duplicate entry")) {
                logger.loggerHelper(tenantId, username, "TransactionType", logger.logType.error, `Duplicate record for tt name: ${ttDetail.Name}, Error: ${err}`);
                return res.sendStatus(409);
            }
            logger.loggerHelper(tenantId, username, "TransactionType", logger.logType.error, `Error occurred for tt Name: ${ttDetail.Name}, Error: ${err}`);
            res.sendStatus(500).send();
        });
    }
}