'use strict';

var aws = require('aws-sdk');
var cognitoIdentity = new aws.CognitoIdentity({ apiVersion: '2014-06-30' });

var pub = {};

pub.schema = {
    AllowUnauthenticatedIdentities: { type: 'boolean' }
};

pub.validate = function (event) {
    if (event.ResourceProperties.AllowUnauthenticatedIdentities === undefined) {
        throw new Error('Missing required property AllowUnauthenticatedIdentities');
    }
    if (!event.ResourceProperties.IdentityPoolName) {
        throw new Error('Missing required property IdentityPoolName');
    }
};

pub.create = function (event, _context, callback) {
    var params = event.ResourceProperties;
    delete params.ServiceToken;
    cognitoIdentity.createIdentityPool(params, function (error, response) {
        if (error) {
            return callback(error);
        }
        var data = {
            physicalResourceId: response.IdentityPoolId
        };
        callback(null, data);
    });
};

pub.update = function (event, _context, callback) {
    delete event.ResourceProperties.ServiceToken;
    var params = event.ResourceProperties;
    params.IdentityPoolId = event.PhysicalResourceId;
    cognitoIdentity.updateIdentityPool(params, function (error) {
        callback(error);
    });
};

pub.delete = function (event, _context, callback) {
    if (!/[\w-]+:[-0-9a-zA-Z]+/.test(event.PhysicalResourceId)) {
        return callback();
    }
    var params = {
        IdentityPoolId: event.PhysicalResourceId
    };
    cognitoIdentity.deleteIdentityPool(params, function (error) {
        if (error && error.code !== 'ResourceNotFoundException') {
            return callback(error);
        }
        return callback();
    });
};

module.exports = pub;
