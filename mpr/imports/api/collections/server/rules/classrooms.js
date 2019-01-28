import {Classrooms} from "/imports/api/collections/both/classrooms.js";

Classrooms.allow({
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

Classrooms.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
if(!doc.invoiced) doc.invoiced = 0;
});

Classrooms.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Classrooms.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

Classrooms.before.remove(function(userId, doc) {
	
});

Classrooms.after.insert(function(userId, doc) {
	
});

Classrooms.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Classrooms.after.remove(function(userId, doc) {
	
});
