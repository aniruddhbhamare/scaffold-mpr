import {Classrooms} from "/imports/api/collections/both/classrooms.js";

Meteor.methods({
	"classroomsInsert": function(data) {
		if(!Classrooms.userCanInsert(this.userId, data)) {
			throw new Meteor.Error(403, "Forbidden.");
		}

		return Classrooms.insert(data);
	},

	"classroomsUpdate": function(id, data) {
		var doc = Classrooms.findOne({ _id: id });
		if(!Classrooms.userCanUpdate(this.userId, doc)) {
			throw new Meteor.Error(403, "Forbidden.");
		}

		Classrooms.update({ _id: id }, { $set: data });
	},

	"classroomsRemove": function(id) {
		var doc = Classrooms.findOne({ _id: id });
		if(!Classrooms.userCanRemove(this.userId, doc)) {
			throw new Meteor.Error(403, "Forbidden.");
		}

		Classrooms.remove({ _id: id });
	}
});
