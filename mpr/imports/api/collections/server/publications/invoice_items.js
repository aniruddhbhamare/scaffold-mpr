import {Meteor} from "meteor/meteor";
import {InvoiceItems} from "/imports/api/collections/both/invoice_items.js";
import * as databaseUtils from "/imports/modules/both/database_utils.js";
import * as objectUtils from "/imports/modules/both/object_utils.js";

Meteor.publish("invoice_items", function(invoiceId) {
	return InvoiceItems.find({invoiceId:invoiceId,ownerId:this.userId}, {});
});

Meteor.publish("invoice_items_empty", function() {
	return InvoiceItems.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("invoice_item", function(itemId) {
	return InvoiceItems.find({_id:itemId,ownerId:this.userId}, {});
});

Meteor.publish("invoice_items_paged", function(invoiceId, extraOptions) {
	extraOptions.doSkip = true;
	return InvoiceItems.find(databaseUtils.extendFilter({invoiceId:invoiceId,ownerId:this.userId}, extraOptions), databaseUtils.extendOptions({}, extraOptions));
});

Meteor.publish("invoice_items_paged_count", function(invoiceId, extraOptions) {
	Counts.publish(this, "invoice_items_paged_count", InvoiceItems.find(databaseUtils.extendFilter({invoiceId:invoiceId,ownerId:this.userId}, extraOptions), { fields: { _id: 1 } }));
});

Meteor.methods({
	"invoiceItemsPagedExport": function(invoiceId, extraOptions, exportFields, fileType) {
		extraOptions.noPaging = true;
		var data = InvoiceItems.find(databaseUtils.extendFilter({invoiceId:invoiceId,ownerId:this.userId}, extraOptions), databaseUtils.extendOptions({}, extraOptions)).fetch();
		return objectUtils.exportArrayOfObjects(data, exportFields, fileType);
	}
});

