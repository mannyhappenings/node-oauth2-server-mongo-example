var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;

/**
 * Configuration.
 */

var clientModel = require('./mongo/model/client'),
	tokenModel = require('./mongo/model/token'),
	userModel = require('./mongo/model/user');

/**
 * Add example client and user to the database (for debug).
 */

var loadExampleData = function() {

	var client = new clientModel({
		clientId: 'application',
		clientSecret: 'secret'
	});

	var user = new userModel({
		id: '123',
		username: 'pedroetb',
		password: 'password'
	});

	client.save(function(err, client) {

		if (err) {
			return console.error(err);
		}
		console.log('Created client', client);
	});

	user.save(function(err, user) {

		if (err) {
			return console.error(err);
		}
		console.log('Created user', user);
	});
};
loadExampleData();

/**
 * Dump the database content (for debug).
 */

var dump = function() {

	clientModel.find(function(err, clients) {

		if (err) {
			return console.error(err);
		}
		console.log('clients', clients);
	});

	tokenModel.find(function(err, tokens) {

		if (err) {
			return console.error(err);
		}
		console.log('tokens', tokens);
	});

	userModel.find(function(err, users) {

		if (err) {
			return console.error(err);
		}
		console.log('users', users);
	});
};

/*
 * Get access token.
 */

var getAccessToken = function(bearerToken, callback) {

	tokenModel.findOne({
		accessToken: bearerToken
	}, callback);
};

/**
 * Get client.
 */

var getClient = function(clientId, clientSecret, callback) {
    console.log(clientId, clientSecret);
    var mongoclient = new MongoClient(new Server("localhost", 27017), {native_parser: true});
    MongoClient.connect('mongodb://localhost:27017/oauth', {native_parser:true}, function(err, db) {

            // Get the first db and do an update document on it
        db.collection('client').findOne({clientId: clientId, clientSecret: clientSecret}, function (err ,client) {
            console.log(err, client);
            callback(err, client);
            db.close();
        });
    })

    // clientModel.findOne({
	// 	clientId: clientId,
	// 	clientSecret: clientSecret
	// }, callback);
};

/**
 * Grant type allowed.
 */

var grantTypeAllowed = function(clientId, grantType, callback) {

	callback(false, grantType === "password");
};

/**
 * Save token.
 */

var saveAccessToken = function(accessToken, clientId, expires, user, callback) {

	var token = new tokenModel({
		accessToken: accessToken,
		expires: expires,
		clientId: clientId,
		user: user
	});

	token.save(callback);
};

/*
 * Get user.
 */

var getUser = function(username, password, callback) {
    console.log(username, password);
    var mongoclient = new MongoClient(new Server("localhost", 27017), {native_parser: true});
    MongoClient.connect('mongodb://localhost:27017/oauth', {native_parser:true}, function(err, db) {

            // Get the first db and do an update document on it
        db.collection('user').findOne({username: username, password: password}, function (err, user) {
            console.log(err, user);
            callback(err, user);
            db.close();
        });
    })

    // 	userModel.findOne({
    // 		username: username,
    // 		password: password
    // 	}, callback);
};

/**
 * Export model definition object.
 */

module.exports = {
	getAccessToken: getAccessToken,
	getClient: getClient,
	grantTypeAllowed: grantTypeAllowed,
	saveAccessToken: saveAccessToken,
	getUser: getUser
};
