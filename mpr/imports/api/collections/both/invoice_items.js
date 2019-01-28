import {Mongo} from "meteor/mongo";

export const InvoiceItems = new Mongo.Collection("invoice_items");

InvoiceItems.userCanInsert = function(userId, doc) {
	return true;
};

InvoiceItems.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

InvoiceItems.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
