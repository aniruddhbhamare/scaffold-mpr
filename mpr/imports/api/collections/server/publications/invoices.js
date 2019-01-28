import {Meteor} from "meteor/meteor";
import {Invoices} from "/imports/api/collections/both/invoices.js";
import * as databaseUtils from "/imports/modules/both/database_utils.js";
import * as objectUtils from "/imports/modules/both/object_utils.js";

Meteor.publish("invoice_list", function() {
	return Invoices.publishJoinedCursors(Invoices.find({ownerId:this.userId}, {sort:{invoiceNumber:-1}}));
});

Meteor.publish("invoices_empty", function() {
	return Invoices.publishJoinedCursors(Invoices.find({_id:null,ownerId:this.userId}, {}));
});

Meteor.publish("invoice_details", function(invoiceId) {
	return Invoices.publishJoinedCursors(Invoices.find({_id:invoiceId,ownerId:this.userId}, {}));
});

Meteor.publish("invoice_list_paged", function(extraOptions) {
	extraOptions.doSkip = true;
	return Invoices.publishJoinedCursors(Invoices.find(databaseUtils.extendFilter({ownerId:this.userId}, extraOptions), databaseUtils.extendOptions({sort:{invoiceNumber:-1}}, extraOptions)));
});

Meteor.publish("invoice_list_paged_count", function(extraOptions) {
	Counts.publish(this, "invoice_list_paged_count", Invoices.find(databaseUtils.extendFilter({ownerId:this.userId}, extraOptions), { fields: { _id: 1 } }));
});

Meteor.methods({
	"invoiceListPagedExport": function(extraOptions, exportFields, fileType) {
		extraOptions.noPaging = true;
		var data = Invoices.find(databaseUtils.extendFilter({ownerId:this.userId}, extraOptions), databaseUtils.extendOptions({sort:{invoiceNumber:-1}}, extraOptions)).fetch();
		return objectUtils.exportArrayOfObjects(data, exportFields, fileType);
	}
});

