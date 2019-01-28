import {Invoices} from "/imports/api/collections/both/invoices.js";

Meteor.methods({
	"invoicesInsert": function(data) {
		if(!Invoices.userCanInsert(this.userId, data)) {
			throw new Meteor.Error(403, "Forbidden.");
		}

		return Invoices.insert(data);
	},

	"invoicesUpdate": function(id, data) {
		var doc = Invoices.findOne({ _id: id });
		if(!Invoices.userCanUpdate(this.userId, doc)) {
			throw new Meteor.Error(403, "Forbidden.");
		}

		Invoices.update({ _id: id }, { $set: data });
	},

	"invoicesRemove": function(id) {
		var doc = Invoices.findOne({ _id: id });
		if(!Invoices.userCanRemove(this.userId, doc)) {
			throw new Meteor.Error(403, "Forbidden.");
		}

		Invoices.remove({ _id: id });
	}
});
