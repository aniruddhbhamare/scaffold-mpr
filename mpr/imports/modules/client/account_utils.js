import {Meteor} from "meteor/meteor";

export const userEmail = function() {
	let user = Meteor.user();
	if(!user) {
		return "";
	}

	if(user.emails && user.emails.length) {
		return user.emails[0].address || "";
	}

	if(user.private && user.private.email) {
		return user.private.email;
	}

	return "";
};

export const userFullName = function() {
	let user = Meteor.user();
	if(!user || !user.profile) {
		return "";
	}

	if(user.profile.firstName || user.profile.lastName) {
		return (user.profile.firstName || "") + (user.profile.lastName ? (" " + (user.profile.lastName || "")) : "");
	}
	return user.profile.name || "";
};
