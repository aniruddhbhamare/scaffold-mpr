import React, { Component } from "react";
import PropTypes from "prop-types";
import {mount, withOptions} from "react-mounter";
import {LayoutContainer} from "/imports/ui/layouts/layout.jsx";
import {NotFound} from "/imports/ui/pages/not_found/not_found.jsx";
import {toKebabCase} from "/imports/modules/both/case_utils.js"
import {HomePublicPageContainer} from "/imports/ui/pages/home_public/home_public.jsx";
import {LoginPageContainer} from "/imports/ui/pages/login/login.jsx";
import {RegisterPageContainer} from "/imports/ui/pages/register/register.jsx";
import {ForgotPasswordPageContainer} from "/imports/ui/pages/forgot_password/forgot_password.jsx";
import {ResetPasswordPageContainer} from "/imports/ui/pages/reset_password/reset_password.jsx";
import {HomePrivatePageContainer} from "/imports/ui/pages/home_private/home_private.jsx";
import {ClassroomsPageContainer} from "/imports/ui/pages/classrooms/classrooms.jsx";
import {ClassroomsInsertPageContainer} from "/imports/ui/pages/classrooms/insert/insert.jsx";
import {ClassroomsDetailsPageContainer} from "/imports/ui/pages/classrooms/details/details.jsx";
import {ClassroomsEditPageContainer} from "/imports/ui/pages/classrooms/edit/edit.jsx";
import {InvoicesPageContainer} from "/imports/ui/pages/invoices/invoices.jsx";
import {InvoicesInsertPageContainer} from "/imports/ui/pages/invoices/insert/insert.jsx";
import {InvoicesDetailsPageContainer} from "/imports/ui/pages/invoices/details/details.jsx";
import {InvoicesDetailsItemsPageContainer} from "/imports/ui/pages/invoices/details/items/items.jsx";
import {InvoicesDetailsInsertPageContainer} from "/imports/ui/pages/invoices/details/insert/insert.jsx";
import {InvoicesDetailsEditPageContainer} from "/imports/ui/pages/invoices/details/edit/edit.jsx";
import {InvoicesEditPageContainer} from "/imports/ui/pages/invoices/edit/edit.jsx";
import {UserSettingsPageContainer} from "/imports/ui/pages/user_settings/user_settings.jsx";
import {UserSettingsProfilePageContainer} from "/imports/ui/pages/user_settings/profile/profile.jsx";
import {UserSettingsChangePassPageContainer} from "/imports/ui/pages/user_settings/change_pass/change_pass.jsx";
import {LogoutPageContainer} from "/imports/ui/pages/logout/logout.jsx";
/*IMPORTS*/

const reactMount = withOptions({
	rootProps: {
		className: "react-root"
	}
}, mount);

// Wait user data to arrive
FlowRouter.wait();

// subscribe to user data
var userDataSubscription = Meteor.subscribe("current_user_data");

Tracker.autorun(function() {
	if(userDataSubscription.ready() && !FlowRouter._initialized) {
		// user data arrived, start router
		FlowRouter.initialize();
	}
});


Tracker.autorun(function() {
	var userId = Meteor.userId();
	var user = Meteor.user();
	if(userId && !user) {
		return;
	}

	var currentContext = FlowRouter.current();
	var route = currentContext.route;
	if(route) {
		if(user) {
			if(route.group.name == "public") {
				FlowRouter.reload();
			}
		} else {
			if(route.group.name == "private") {
				FlowRouter.reload();
			}
		}
	}
});

const publicRouteNames = [
	"home_public",
	"login",
	"register",
	"forgot_password",
	"reset_password"
];

const privateRouteNames = [
	"home_private",
	"classrooms",
	"classrooms.insert",
	"classrooms.details",
	"classrooms.edit",
	"invoices",
	"invoices.insert",
	"invoices.details",
	"invoices.details.items",
	"invoices.details.insert",
	"invoices.details.edit",
	"invoices.edit",
	"user_settings",
	"user_settings.profile",
	"user_settings.change_pass",
	"logout"
];

const freeRouteNames = [
	
];

const roleMap = [
	
];

const firstGrantedRoute = function(preferredRoute) {
	if(preferredRoute && routeGranted(preferredRoute)) return preferredRoute;

	var grantedRoute = "";

	_.every(privateRouteNames, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	_.every(publicRouteNames, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	_.every(freeRouteNames, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	if(!grantedRoute) {
		console.log("All routes are restricted for current user.");
		return "notFound";
	}

	return "";
};

// this function returns true if user is in role allowed to access given route
export const routeGranted = function(routeName) {
	if(!routeName) {
		// route without name - enable access (?)
		return true;
	}

	if(!roleMap || roleMap.length === 0) {
		// this app doesn't have role map - enable access
		return true;
	}

	var roleMapItem = _.find(roleMap, function(roleItem) { return roleItem.route == routeName; });
	if(!roleMapItem) {
		// page is not restricted
		return true;
	}

	// if user data not arrived yet, allow route - user will be redirected anyway after his data arrive
	if(Meteor.userId() && !Meteor.user()) {
		return true;
	}

	if(!Meteor.user() || !Meteor.user().roles) {
		// user is not logged in or doesn't have "role" member
		return false;
	}

	// this page is restricted to some role(s), check if user is in one of allowedRoles
	var allowedRoles = roleMapItem.roles;
	var granted = _.intersection(allowedRoles, Meteor.user().roles);
	if(!granted || granted.length === 0) {
		return false;
	}

	return true;
};


FlowRouter.triggers.enter(function(context) {
	if(context.route && context.route.name) {
		$("body").addClass("page-" + toKebabCase(context.route.name));
	}
});

FlowRouter.triggers.exit(function(context) {
	if(context.route && context.route.name) {
		$("body").removeClass("page-" + toKebabCase(context.route.name));
	}
});


FlowRouter.subscriptions = function() {
	this.register("current_user_data", Meteor.subscribe("current_user_data"));
};


const freeRoutes = FlowRouter.group({
	name: "free",
	triggersEnter: [
		function(context, redirect, stop) {
			if(!routeGranted(context.route.name)) {
				// user is not in allowedRoles - redirect to first granted route
				var redirectRoute = firstGrantedRoute("");
				redirect(redirectRoute);
			}
		}
	]
});

const publicRoutes = FlowRouter.group({
	name: "public",
	triggersEnter: [
		function(context, redirect, stop) {
			if(Meteor.user()) {
				var redirectRoute = firstGrantedRoute("home_private");
				redirect(redirectRoute);
			}
		}
	]
});

const privateRoutes = FlowRouter.group({
	name: "private",
	triggersEnter: [
		function(context, redirect, stop) {
			if(!Meteor.user()) {
				// user is not logged in - redirect to public home
				var redirectRoute = firstGrantedRoute("home_public");
				redirect(redirectRoute);
			} else {
				// user is logged in - check role
				if(!routeGranted(context.route.name)) {
					// user is not in allowedRoles - redirect to first granted route
					var redirectRoute = firstGrantedRoute("home_private");
					redirect(redirectRoute);
				}
			}
		}
	]
});

FlowRouter.notFound = {
	action () {
		reactMount(LayoutContainer, {
			content: (<NotFound />)
		});
	}
};

publicRoutes.route("/", {
    name: "home_public",

    title: "",

	triggersEnter: [
		function(context, redirect, stop) {
			
		}
	],
    action: function(routeParams, routeQuery) {
    	reactMount(LayoutContainer, {
			content: (
				<HomePublicPageContainer routeParams={routeParams} />
			)
		});

    },
	triggersExit: [
		function(context, redirect) {
			
		}
	]
});

publicRoutes.route("/login", {
    name: "login",

    title: "",

	triggersEnter: [
		function(context, redirect, stop) {
			
		}
	],
    action: function(routeParams, routeQuery) {
    	reactMount(LayoutContainer, {
			content: (
				<LoginPageContainer routeParams={routeParams} />
			)
		});

    },
	triggersExit: [
		function(context, redirect) {
			
		}
	]
});

publicRoutes.route("/register", {
    name: "register",

    title: "",

	triggersEnter: [
		function(context, redirect, stop) {
			
		}
	],
    action: function(routeParams, routeQuery) {
    	reactMount(LayoutContainer, {
			content: (
				<RegisterPageContainer routeParams={routeParams} />
			)
		});

    },
	triggersExit: [
		function(context, redirect) {
			
		}
	]
});

publicRoutes.route("/forgot_password", {
    name: "forgot_password",

    title: "",

	triggersEnter: [
		function(context, redirect, stop) {
			
		}
	],
    action: function(routeParams, routeQuery) {
    	reactMount(LayoutContainer, {
			content: (
				<ForgotPasswordPageContainer routeParams={routeParams} />
			)
		});

    },
	triggersExit: [
		function(context, redirect) {
			
		}
	]
});

publicRoutes.route("/reset_password/:resetPasswordToken", {
    name: "reset_password",

    title: "",

	triggersEnter: [
		function(context, redirect, stop) {
			
		}
	],
    action: function(routeParams, routeQuery) {
    	reactMount(LayoutContainer, {
			content: (
				<ResetPasswordPageContainer routeParams={routeParams} />
			)
		});

    },
	triggersExit: [
		function(context, redirect) {
			
		}
	]
});

privateRoutes.route("/home_private", {
    name: "home_private",

    title: "Welcome {{userFullName}}!",

	triggersEnter: [
		function(context, redirect, stop) {
			
		}
	],
    action: function(routeParams, routeQuery) {
    	reactMount(LayoutContainer, {
			content: (
				<HomePrivatePageContainer routeParams={routeParams} />
			)
		});

    },
	triggersExit: [
		function(context, redirect) {
			
		}
	]
});

privateRoutes.route("/classrooms", {
    name: "classrooms",

    title: "",

	triggersEnter: [
		function(context, redirect, stop) {
			
		}
	],
    action: function(routeParams, routeQuery) {
    	reactMount(LayoutContainer, {
			content: (
				<ClassroomsPageContainer routeParams={routeParams} />
			)
		});

    },
	triggersExit: [
		function(context, redirect) {
			
		}
	]
});

privateRoutes.route("/classrooms/insert", {
    name: "classrooms.insert",

    title: "",

	triggersEnter: [
		function(context, redirect, stop) {
			
		}
	],
    action: function(routeParams, routeQuery) {
    	reactMount(LayoutContainer, {
			content: (
				<ClassroomsInsertPageContainer routeParams={routeParams} />
			)
		});

    },
	triggersExit: [
		function(context, redirect) {
			
		}
	]
});

privateRoutes.route("/classrooms/details/:classroomId", {
    name: "classrooms.details",

    title: "",

	triggersEnter: [
		function(context, redirect, stop) {
			
		}
	],
    action: function(routeParams, routeQuery) {
    	reactMount(LayoutContainer, {
			content: (
				<ClassroomsDetailsPageContainer routeParams={routeParams} />
			)
		});

    },
	triggersExit: [
		function(context, redirect) {
			
		}
	]
});

privateRoutes.route("/classrooms/edit/:classroomId", {
    name: "classrooms.edit",

    title: "",

	triggersEnter: [
		function(context, redirect, stop) {
			
		}
	],
    action: function(routeParams, routeQuery) {
    	reactMount(LayoutContainer, {
			content: (
				<ClassroomsEditPageContainer routeParams={routeParams} />
			)
		});

    },
	triggersExit: [
		function(context, redirect) {
			
		}
	]
});

privateRoutes.route("/invoices", {
    name: "invoices",

    title: "",

	triggersEnter: [
		function(context, redirect, stop) {
			
		}
	],
    action: function(routeParams, routeQuery) {
    	reactMount(LayoutContainer, {
			content: (
				<InvoicesPageContainer routeParams={routeParams} />
			)
		});

    },
	triggersExit: [
		function(context, redirect) {
			
		}
	]
});

privateRoutes.route("/invoices/insert", {
    name: "invoices.insert",

    title: "",

	triggersEnter: [
		function(context, redirect, stop) {
			
		}
	],
    action: function(routeParams, routeQuery) {
    	reactMount(LayoutContainer, {
			content: (
				<InvoicesInsertPageContainer routeParams={routeParams} />
			)
		});

    },
	triggersExit: [
		function(context, redirect) {
			
		}
	]
});

privateRoutes.route("/invoices/details/:invoiceId", {
    name: "invoices.details",

    title: "",

	triggersEnter: [
		function(context, redirect, stop) {
			FlowRouter.withReplaceState(function() {
				redirect("invoices.details.items", context.params, context.queryParams);
			});

		}
	],
    action: function(routeParams, routeQuery) {
    	
    },
	triggersExit: [
		function(context, redirect) {
			
		}
	]
});

privateRoutes.route("/invoices/details/:invoiceId/items", {
    name: "invoices.details.items",

    title: "",

	triggersEnter: [
		function(context, redirect, stop) {
			
		}
	],
    action: function(routeParams, routeQuery) {
    	reactMount(LayoutContainer, {
			content: (
				<InvoicesDetailsPageContainer routeParams={routeParams} subcontent={
					<InvoicesDetailsItemsPageContainer routeParams={routeParams} />
				} />
			)
		});

    },
	triggersExit: [
		function(context, redirect) {
			
		}
	]
});

privateRoutes.route("/invoices/details/:invoiceId/insert", {
    name: "invoices.details.insert",

    title: "",

	triggersEnter: [
		function(context, redirect, stop) {
			
		}
	],
    action: function(routeParams, routeQuery) {
    	reactMount(LayoutContainer, {
			content: (
				<InvoicesDetailsPageContainer routeParams={routeParams} subcontent={
					<InvoicesDetailsInsertPageContainer routeParams={routeParams} />
				} />
			)
		});

    },
	triggersExit: [
		function(context, redirect) {
			
		}
	]
});

privateRoutes.route("/invoices/details/:invoiceId/edit/:itemId", {
    name: "invoices.details.edit",

    title: "",

	triggersEnter: [
		function(context, redirect, stop) {
			
		}
	],
    action: function(routeParams, routeQuery) {
    	reactMount(LayoutContainer, {
			content: (
				<InvoicesDetailsPageContainer routeParams={routeParams} subcontent={
					<InvoicesDetailsEditPageContainer routeParams={routeParams} />
				} />
			)
		});

    },
	triggersExit: [
		function(context, redirect) {
			
		}
	]
});

privateRoutes.route("/invoices/edit/:invoiceId", {
    name: "invoices.edit",

    title: "",

	triggersEnter: [
		function(context, redirect, stop) {
			
		}
	],
    action: function(routeParams, routeQuery) {
    	reactMount(LayoutContainer, {
			content: (
				<InvoicesEditPageContainer routeParams={routeParams} />
			)
		});

    },
	triggersExit: [
		function(context, redirect) {
			
		}
	]
});

privateRoutes.route("/user_settings", {
    name: "user_settings",

    title: "",

	triggersEnter: [
		function(context, redirect, stop) {
			FlowRouter.withReplaceState(function() {
				redirect("user_settings.profile", context.params, context.queryParams);
			});

		}
	],
    action: function(routeParams, routeQuery) {
    	
    },
	triggersExit: [
		function(context, redirect) {
			
		}
	]
});

privateRoutes.route("/user_settings/profile", {
    name: "user_settings.profile",

    title: "",

	triggersEnter: [
		function(context, redirect, stop) {
			
		}
	],
    action: function(routeParams, routeQuery) {
    	reactMount(LayoutContainer, {
			content: (
				<UserSettingsPageContainer routeParams={routeParams} subcontent={
					<UserSettingsProfilePageContainer routeParams={routeParams} />
				} />
			)
		});

    },
	triggersExit: [
		function(context, redirect) {
			
		}
	]
});

privateRoutes.route("/user_settings/change_pass", {
    name: "user_settings.change_pass",

    title: "",

	triggersEnter: [
		function(context, redirect, stop) {
			
		}
	],
    action: function(routeParams, routeQuery) {
    	reactMount(LayoutContainer, {
			content: (
				<UserSettingsPageContainer routeParams={routeParams} subcontent={
					<UserSettingsChangePassPageContainer routeParams={routeParams} />
				} />
			)
		});

    },
	triggersExit: [
		function(context, redirect) {
			
		}
	]
});

privateRoutes.route("/logout", {
    name: "logout",

    title: "",

	triggersEnter: [
		function(context, redirect, stop) {
			
		}
	],
    action: function(routeParams, routeQuery) {
    	reactMount(LayoutContainer, {
			content: (
				<LogoutPageContainer routeParams={routeParams} />
			)
		});

    },
	triggersExit: [
		function(context, redirect) {
			
		}
	]
});
