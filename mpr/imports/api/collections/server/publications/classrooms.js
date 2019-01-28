import {Meteor} from "meteor/meteor";
import {Classrooms} from "/imports/api/collections/both/classrooms.js";
import * as databaseUtils from "/imports/modules/both/database_utils.js";
import * as objectUtils from "/imports/modules/both/object_utils.js";

Meteor.publish("classroom_list", function() {
	return Classrooms.find({ownerId:this.userId}, {sort:{name:1}});
});

Meteor.publish("classrooms_empty", function() {
	return Classrooms.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("classroom_details", function(classroomId) {
	return Classrooms.find({_id:classroomId,ownerId:this.userId}, {});
});

Meteor.publish("classroom_list_paged", function(extraOptions) {
	extraOptions.doSkip = true;
	return Classrooms.find(databaseUtils.extendFilter({ownerId:this.userId}, extraOptions), databaseUtils.extendOptions({sort:{name:1}}, extraOptions));
});

Meteor.publish("classroom_list_paged_count", function(extraOptions) {
	Counts.publish(this, "classroom_list_paged_count", Classrooms.find(databaseUtils.extendFilter({ownerId:this.userId}, extraOptions), { fields: { _id: 1 } }));
});

Meteor.methods({
	"classroomListPagedExport": function(extraOptions, exportFields, fileType) {
		extraOptions.noPaging = true;
		var data = Classrooms.find(databaseUtils.extendFilter({ownerId:this.userId}, extraOptions), databaseUtils.extendOptions({sort:{name:1}}, extraOptions)).fetch();
		return objectUtils.exportArrayOfObjects(data, exportFields, fileType);
	}
});

