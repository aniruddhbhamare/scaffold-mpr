import {Mongo} from "meteor/mongo";

export const Invoices = new Mongo.Collection("invoices");

Invoices.userCanInsert = function(userId, doc) {
	return true;
};

Invoices.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

Invoices.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
