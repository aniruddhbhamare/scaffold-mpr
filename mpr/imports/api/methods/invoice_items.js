import {InvoiceItems} from "/imports/api/collections/both/invoice_items.js";

Meteor.methods({
	"invoiceItemsInsert": function(data) {
		if(!InvoiceItems.userCanInsert(this.userId, data)) {
			throw new Meteor.Error(403, "Forbidden.");
		}

		return InvoiceItems.insert(data);
	},

	"invoiceItemsUpdate": function(id, data) {
		var doc = InvoiceItems.findOne({ _id: id });
		if(!InvoiceItems.userCanUpdate(this.userId, doc)) {
			throw new Meteor.Error(403, "Forbidden.");
		}

		InvoiceItems.update({ _id: id }, { $set: data });
	},

	"invoiceItemsRemove": function(id) {
		var doc = InvoiceItems.findOne({ _id: id });
		if(!InvoiceItems.userCanRemove(this.userId, doc)) {
			throw new Meteor.Error(403, "Forbidden.");
		}

		InvoiceItems.remove({ _id: id });
	}
});
