const organizationdetail = require("../models/organizationdetail.model");
const logger = require("../utils/loggerHelper");
const helper = require("../utils/helper");
const testData = require("../config/testdata-config");

exports.update = async (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    // Validate request
    if (!Object.keys(req.body).length) {
        logger.loggerHelper(tenantId, username, "OrganizationDetail_update", logger.logType.error, "Empty Content");
        res.status(400).send({
            message: "Content can not be empty!"
        });
    } else {
        let odFindById = await organizationdetail.findById(req.params.id, tenantId, username, "OrganizationDetail_update");

        if (odFindById == "404") {
            logger.loggerHelper(tenantId, username, "OrganizationDetail_update", logger.logType.error, `Record not found for Id: ${req.params.id}`);
            return res.status(404).send({
                message: "OrganizationDetail not found."
            });
        }

        let updatedod = {
            Id: odFindById[0].Id,
            Name: helper.isEmpty(req.body.Name) ? odFindById[0].Name : req.body.Name,
            Active: helper.isEmpty(req.body.Active) ? odFindById[0].Active : req.body.Active,
            TenantId: helper.isEmpty(req.body.TenantId) ? odFindById[0].TenantId : req.body.TenantId,
            UpdatedOn: new Date(),
            UpdatedBy: "from_token" // Get ths value from Bearer Token
        };

        await organizationdetail.update(updatedod, username).then(() => {
            logger.loggerHelper(tenantId, username, "OrganizationDetail_update", logger.logType.debug, `Record updated for Id: ${req.params.id}`);
            return res.status(200).send();
        }).catch((err) => {
            logger.loggerHelper(tenantId, username, "OrganizationDetail_update", logger.logType.error, `Error Occurred for Id: ${req.params.id}, Error: ${err}`);
            return res.status(500).send();
        });
    }
}

exports.delete = async (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    let odFindById = await organizationdetail.findById(req.params.id, tenantId, username, "OrganizationDetail_delete");

    if (odFindById == "404") {
        logger.loggerHelper(tenantId, username, "OrganizationDetail_delete", logger.logType.error, `Record not found for Id: ${req.params.id}`);
        return res.status(404).send({
            message: "OrganizationDetail not found."
        });
    }

    organizationdetail.delete(req.params.id, tenantId, username).then(() => {
        logger.loggerHelper(tenantId, username, "OrganizationDetail_delete", logger.logType.debug, `Record deleted for Id: ${id}`);
        res.status(204).send();
    }).catch((err) => {
        logger.loggerHelper(tenantId, username, "OrganizationDetail_delete", logger.logType.error, `Error occurred for Id: ${id}`);
        res.sendStatus(500).send();
    })
}

exports.fetchAll = (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    organizationdetail.getAll(tenantId, username).then((od) => {
        logger.loggerHelper(tenantId, username, "OrganizationDetail_fetchAll", logger.logType.debug, "Success");
        res.send(od);
    }).catch((err) => {
        logger.loggerHelper(tenantId, username, "OrganizationDetail_fetchAll", logger.logType.error, `Error: ${err}`);
        res.sendStatus(500).send();
    });
}

exports.fetchById = (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    organizationdetail.findById(req.params.id, tenantId, username, OrganizationDetail_fetchById).then((od) => {
        logger.loggerHelper(tenantId, username, "OrganizationDetail_fetchById", logger.logType.debug, `Record found for Id: ${req.params.id}`);
        res.send(od);
    }).catch((err) => {
        logger.loggerHelper(tenantId, username, "OrganizationDetail_fetchById", logger.logType.error, `Error occured for Id: ${req.params.id}, Error: ${err}`);
        res.sendStatus(500).send();
    })
}


exports.create = (req, res) => {
    let tenantId = testData.tenantId; // Fetch Tenant Id from Bearer Token
    let username = testData.username; // Fetch Tenant Id from Bearer Token

    // Validate request
    if (!Object.keys(req.body).length) {
        logger.loggerHelper(tenantId, username, "OrganizationDetail_create", logger.logType.error, "Empty Content");
        res.status(400).send({
            message: "Content can not be empty!"
        });
    } else {

        // Create a Organization Detail
        let od = {
            Name: req.body.Name,
            Active: req.body.Active,
            TenantId: req.body.TenantId,
            CreatedOn: new Date(),
            CreatedBy: "from_token" // Get ths value from Bearer Token
        };

        organizationdetail.create(od, username).then((odResp) => {
            logger.loggerHelper(tenantId, username, "OrganizationDetail_create", logger.logType.debug, `Record Created for org name: ${od.Name} with Id: ${odResp.Id}`);
            res.send(odResp);
        }).catch((err) => {
            if (err.includes("Duplicate entry")) {
                logger.loggerHelper(tenantId, username, "OrganizationDetail_create", logger.logType.error, `Duplicate record for org name: ${od.Name}, Error: ${err}`);
                return res.sendStatus(409);
            }
            logger.loggerHelper(tenantId, username, "OrganizationDetail_create", logger.logType.error, `Error occurred for name: ${od.Name}, Error: ${err}`);
            res.sendStatus(500).send();
        });
    }


}