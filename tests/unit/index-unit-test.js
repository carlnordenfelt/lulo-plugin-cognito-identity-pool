'use strict';

var expect = require('chai').expect;
var mockery = require('mockery');
var sinon = require('sinon');

describe('Index unit tests', function () {
    var subject;
    var createIdentityPoolStub = sinon.stub();
    var updateIdentityPoolStub = sinon.stub();
    var deleteIdentityPoolStub = sinon.stub();
    var event;

    before(function () {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });

        var awsSdkStub = {
            CognitoIdentity: function () {
                this.createIdentityPool = createIdentityPoolStub;
                this.updateIdentityPool = updateIdentityPoolStub;
                this.deleteIdentityPool = deleteIdentityPoolStub;
            }
        };

        mockery.registerMock('aws-sdk', awsSdkStub);
        subject = require('../../src/index');
    });
    beforeEach(function () {
        createIdentityPoolStub.reset().resetBehavior();
        createIdentityPoolStub.yields(undefined, { IdentityPoolId: 'IdentityPoolId' });
        updateIdentityPoolStub.reset().resetBehavior();
        updateIdentityPoolStub.yields();
        deleteIdentityPoolStub.reset().resetBehavior();
        deleteIdentityPoolStub.yields();
        event = {
            ResourceProperties: {
                AllowUnauthenticatedIdentities: true,
                IdentityPoolName: 'IdentityPoolName'
            }
        };
    });
    after(function () {
        mockery.deregisterAll();
        mockery.disable();
    });

    describe('validate', function () {
        it('should succeed', function (done) {
            subject.validate(event);
            done();
        });
        it('should fail if AllowUnauthenticatedIdentities is not set', function (done) {
            delete event.ResourceProperties.AllowUnauthenticatedIdentities;
            function fn () {
                subject.validate(event);
            }
            expect(fn).to.throw(/Missing required property AllowUnauthenticatedIdentities/);
            done();
        });

        it('should fail if IdentityPoolName is not set', function (done) {
            delete event.ResourceProperties.IdentityPoolName;
            function fn () {
                subject.validate(event);
            }
            expect(fn).to.throw(/Missing required property IdentityPoolName/);
            done();
        });
    });

    describe('create', function () {
        it('should succeed', function (done) {
            subject.create(event, {}, function (error, response) {
                expect(error).to.equal(null);
                expect(createIdentityPoolStub.calledOnce).to.equal(true);
                expect(updateIdentityPoolStub.called).to.equal(false);
                expect(deleteIdentityPoolStub.called).to.equal(false);
                expect(response.physicalResourceId).to.equal('IdentityPoolId');
                done();
            });
        });
        it('should fail due to createIdentityPoolError error', function (done) {
            createIdentityPoolStub.yields('createIdentityPoolError');
            subject.create(event, {}, function (error, response) {
                expect(error).to.equal('createIdentityPoolError');
                expect(createIdentityPoolStub.calledOnce).to.equal(true);
                expect(updateIdentityPoolStub.called).to.equal(false);
                expect(deleteIdentityPoolStub.called).to.equal(false);
                expect(response).to.equal(undefined);
                done();
            });
        });
    });

    describe('update', function () {
        it('should succeed', function (done) {
            event.PhysicalResourceId = 'IdentityPoolId';
            subject.update(event, {}, function (error) {
                expect(error).to.equal(undefined);
                expect(updateIdentityPoolStub.calledOnce).to.equal(true);
                expect(createIdentityPoolStub.called).to.equal(false);
                expect(deleteIdentityPoolStub.called).to.equal(false);
                done();
            });
        });
        it('should fail due to updateIdentityPoolError error', function (done) {
            updateIdentityPoolStub.yields('updateIdentityPoolError');
            subject.update(event, {}, function (error) {
                expect(error).to.equal('updateIdentityPoolError');
                expect(updateIdentityPoolStub.calledOnce).to.equal(true);
                expect(createIdentityPoolStub.called).to.equal(false);
                expect(deleteIdentityPoolStub.called).to.equal(false);
                done();
            });
        });
    });

    describe('delete', function () {
        it('should succeed', function (done) {
            event.PhysicalResourceId = 'eu-west-1:bef2c0b3-f3ce-4de0-aec1-8765trfvbh';
            subject.delete(event, {}, function (error) {
                expect(error).to.equal(undefined);
                expect(deleteIdentityPoolStub.calledOnce).to.equal(true);
                expect(createIdentityPoolStub.called).to.equal(false);
                expect(updateIdentityPoolStub.called).to.equal(false);
                done();
            });
        });
        it('should succeed without calling delete with invalid id', function (done) {
            event.PhysicalResourceId = 'InvalidId';
            subject.delete(event, {}, function (error) {
                expect(error).to.equal(undefined);
                expect(deleteIdentityPoolStub.called).to.equal(false);
                expect(createIdentityPoolStub.called).to.equal(false);
                expect(updateIdentityPoolStub.called).to.equal(false);
                done();
            });
        });
        it('should fail due to deleteIdentityPoolError error', function (done) {
            event.PhysicalResourceId = 'eu-west-1:bef2c0b3-f3ce-4de0-aec1-8765trfvbh';
            deleteIdentityPoolStub.yields('deleteIdentityPoolError');
            subject.delete(event, {}, function (error) {
                expect(error).to.equal('deleteIdentityPoolError');
                expect(deleteIdentityPoolStub.calledOnce).to.equal(true);
                expect(createIdentityPoolStub.called).to.equal(false);
                expect(updateIdentityPoolStub.called).to.equal(false);
                done();
            });
        });
        it('should not fail due to ResourceNotFoundException', function (done) {
            event.PhysicalResourceId = 'eu-west-1:bef2c0b3-f3ce-4de0-aec1-8765trfvbh';
            deleteIdentityPoolStub.yields({ code: 'ResourceNotFoundException' });
            subject.delete(event, {}, function (error) {
                expect(error).to.equal(undefined);
                expect(deleteIdentityPoolStub.calledOnce).to.equal(true);
                expect(createIdentityPoolStub.called).to.equal(false);
                expect(updateIdentityPoolStub.called).to.equal(false);
                done();
            });
        });
    });
});
