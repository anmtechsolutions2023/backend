const contactaddresstype = require("../models/contactaddresstype.model");
const logger = require("../utils/loggerHelper");
const helper = require("../utils/helper");
const testData = require("../config/testdata-config");
// const token = require("../utils/token");

exports.delete = async (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    let catFindById = await contactaddresstype.findById(req.params.id, tenantId, username, "ContactAddressType_delete");

    if (catFindById == "404") {
        logger.loggerHelper(tenantId, username, "ContactAddressType_delete", logger.logType.error, `Record not found for Id: ${req.params.id}`);
        return res.status(404).send({
            message: "ContactAddressType not found."
        });
    }

    contactaddresstype.delete(req.params.id, tenantId, username).then(() => {
        logger.loggerHelper(tenantId, username, "ContactAddressType_delete", logger.logType.debug, `Record deleted for Id: ${req.params.id}`);
        res.status(204).send();
    }).catch((err) => {
        logger.loggerHelper(tenantId, username, "ContactAddressType_delete", logger.logType.error, `Error occurred for Id: ${req.params.id}, Error: ${err}`);
        res.sendStatus(500).send();
    })
}

exports.fetchAll = (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    contactaddresstype.getAll(tenantId, username).then((catResp) => {
        logger.loggerHelper(tenantId, username, "ContactAddressType_fetchAll", logger.logType.debug, "Success");
        res.status(200).send(catResp);
    }).catch((err) => {
        logger.loggerHelper(tenantId, username, "ContactAddressType_fetchAll", logger.logType.error, `Error occurred, Error: ${err}`);
        res.sendStatus(500).send();
    });
}

exports.fetchById = (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    contactaddresstype.findById(req.params.id, tenantId, username, "ContactAddressType_fetchById").then((catResp) => {
        logger.loggerHelper(tenantId, username, "ContactAddressType_fetchById", logger.logType.debug, `Record found for Id: ${req.params.id}`);
        res.status(200).send(catResp);
    }).catch((err) => {
        logger.loggerHelper(tenantId, username, "ContactAddressType_fetchById", logger.logType.error, `Record not found for Id: ${req.params.id}, Error: ${err}`);
        res.sendStatus(500).send();
    })
}

exports.update = async (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    // Validate request
    if (!Object.keys(req.body).length) {
        logger.loggerHelper(tenantId, username, "ContactAddressType_update", logger.logType.error, "Empty Content");
        res.status(400).send({
            message: "Content can not be empty!"
        });
    } else {
        let catFindById = await contactaddresstype.findById(req.params.id, tenantId, username, "ContactAddressType_update");

        if (catFindById == "404") {
            logger.loggerHelper(tenantId, username, "ContactAddressType_update", logger.logType.error, `Record not found for Id: ${req.params.id}`);
            return res.status(404).send({
                message: "TransactionTypeStatus not found."
            });
        }

        let cat = {
            Id: catFindById[0].Id,
            Name: helper.isEmpty(req.body.Name) ? catFindById[0].Name : req.body.Name,
            Active: helper.isEmpty(req.body.Active) ? catFindById[0].Active : req.body.Active,
            TenantId: helper.isEmpty(req.body.TenantId) ? catFindById[0].TenantId : req.body.TenantId,
            UpdatedOn: new Date(),
            UpdatedBy: "from_token" // Get ths value from Bearer Token
        };

        await contactaddresstype.update(cat, username).then(() => {
            logger.loggerHelper(tenantId, username, "ContactAddressType_update", logger.logType.debug, `Record updated for Id: ${cat.Id}`);
            res.status(200).send();
        }).catch((err) => {
            logger.loggerHelper(tenantId, username, "ContactAddressType_update", logger.logType.error, `Error occurred for Id: ${cat.Id}, Error: ${err}`);
            return res.status(500).send();
        });
    }
}

exports.create = (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    // Validate request
    if (!Object.keys(req.body).length) {
        logger.loggerHelper(tenantId, username, "ContactAddressType_create", logger.logType.error, "Empty Content");
        res.status(400).send({
            message: "Content can not be empty!"
        });
    } else {

        // Create a Contact Address Type
        let cat = {
            Name: req.body.Name,
            Active: req.body.Active,
            TenantId: req.body.TenantId,
            CreatedOn: new Date(),
            CreatedBy: "from_token" // Get ths value from Bearer Token
        };

        contactaddresstype.create(cat, username).then((catResp) => {
            logger.loggerHelper(tenantId, username, "ContactAddressType_create", logger.logType.debug, `Record created for cat Name: ${cat.Name} with Id: ${catResp}`);
            res.send(catResp);
        }).catch((err) => {
            if (err.includes("Duplicate entry")) {
                logger.loggerHelper(tenantId, username, "ContactAddressType_create", logger.logType.error, `Duplicate record found for cat Name: ${cat.Name}, Error: ${err}`);
                return res.sendStatus(409);
            }
            logger.loggerHelper(tenantId, username, "ContactAddressType_create", logger.logType.error, `Error occurred for cat Name: ${cat.Name}, Error: ${err}`);
            res.sendStatus(500).send();
        })
    }
}