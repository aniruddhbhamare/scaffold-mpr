import {Mongo} from "meteor/mongo";

export const Classrooms = new Mongo.Collection("classrooms");

Classrooms.userCanInsert = function(userId, doc) {
	return true;
};

Classrooms.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

Classrooms.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
