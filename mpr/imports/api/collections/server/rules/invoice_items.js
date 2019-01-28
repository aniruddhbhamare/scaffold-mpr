import {InvoiceItems} from "/imports/api/collections/both/invoice_items.js";
import {Invoices} from "/imports/api/collections/both/invoices.js";

InvoiceItems.allow({
	insert: function (userId, doc) {
		return false;
	},

	update: function (userId, doc, fields, modifier) {
		return false;
	},

	remove: function (userId, doc) {
		return false;
	}
});

InvoiceItems.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
doc.amount = doc.quantity * doc.price;
});

InvoiceItems.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
if(!modifier.$set) return; var quantity = modifier.$set.quantity || doc.quantity; var price = modifier.$set.price || doc.price; modifier.$set.amount = quantity * price;
});

InvoiceItems.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

InvoiceItems.before.remove(function(userId, doc) {
	
});

InvoiceItems.after.insert(function(userId, doc) {
	
var sum = 0; InvoiceItems.find({ invoiceId: doc.invoiceId }).map(function(item) { sum += item.amount; }); Invoices.update({ _id: doc.invoiceId }, { $set: { totalAmount: sum }});
});

InvoiceItems.after.update(function(userId, doc, fieldNames, modifier, options) {
	
var sum = 0; InvoiceItems.find({ invoiceId: doc.invoiceId }).map(function(item) { sum += item.amount; }); Invoices.update({ _id: doc.invoiceId }, { $set: { totalAmount: sum }});
});

InvoiceItems.after.remove(function(userId, doc) {
	
var sum = 0; InvoiceItems.find({ invoiceId: doc.invoiceId }).map(function(item) { sum += item.amount; }); Invoices.update({ _id: doc.invoiceId }, { $set: { totalAmount: sum }});
});
