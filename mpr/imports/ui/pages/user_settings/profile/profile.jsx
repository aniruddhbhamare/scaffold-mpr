import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTracker, createContainer } from "meteor/react-meteor-data";
import {pathFor, menuItemClass} from "/imports/modules/client/router_utils";
import {Loading} from "/imports/ui/pages/loading/loading.jsx";
import {mergeObjects} from "/imports/modules/both/object_utils";
import {Users} from "meteor-user-roles";
import * as formUtils from "/imports/modules/client/form_utils";
import * as objectUtils from "/imports/modules/both/object_utils";
import * as dateUtils from "/imports/modules/both/date_utils";
import * as stringUtils from "/imports/modules/both/string_utils";


export class UserSettingsProfilePage extends Component {
	constructor () {
		super();
		
	}

	componentWillMount() {
		
	}

	componentWillUnmount() {
		
	}

	componentDidMount() {
		

		Meteor.defer(function() {
			globalOnRendered();
		});
	}

	

	

	render() {
		if(this.props.data.dataLoading) {
			return (
				<Loading />
			);
		} else {
			return (
				<div>
					<div className="page-container container" id="content">
						<div className="row" id="title_row">
							<div className="col-md-12">
							</div>
						</div>
						<UserSettingsProfilePageEditForm data={this.props.data} routeParams={this.props.routeParams} />
					</div>
				</div>
			);
		}
	}
}

export const UserSettingsProfilePageContainer = withTracker(function(props) {



	let isReady = function() {
		

		let subs = [
			Meteor.subscribe("current_user_data")
		];
		let ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	};

	let data = { dataLoading: true };

	if(isReady()) {
		

		data = {

				current_user_data: Users.findOne({_id:Meteor.userId()}, {})
			};
		

		
	}
	return { data: data };

})(UserSettingsProfilePage);

export class UserSettingsProfilePageEditForm extends Component {
	constructor () {
		super();

		this.state = {
			userSettingsProfilePageEditFormErrorMessage: "",
			userSettingsProfilePageEditFormInfoMessage: ""
		};

		this.renderErrorMessage = this.renderErrorMessage.bind(this);
		this.renderInfoMessage = this.renderInfoMessage.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onClose = this.onClose.bind(this);
		this.onBack = this.onBack.bind(this);
		
	}

	componentWillMount() {
		
	}

	componentWillUnmount() {
		
	}

	componentDidMount() {
		

		$("select[data-role='tagsinput']").tagsinput();
		$(".bootstrap-tagsinput").addClass("form-control");
		$("input[type='file']").fileinput();
	}

	renderErrorMessage() {
		return(
			<div className="alert alert-warning">
				{this.state.userSettingsProfilePageEditFormErrorMessage}
			</div>
		);
	}

	renderInfoMessage() {
		return(
			<div className="alert alert-success">
				{this.state.userSettingsProfilePageEditFormInfoMessage}
			</div>
		);
	}

	onSubmit(e) {
		e.preventDefault();
		this.setState({ userSettingsProfilePageEditFormInfoMessage: "" });
		this.setState({ userSettingsProfilePageEditFormErrorMessage: "" });

		var self = this;
		var $form = $(e.target);

		function submitAction(result, msg) {
			var userSettingsProfilePageEditFormMode = "update";
			if(!$("#user-settings-profile-page-edit-form").find("#form-cancel-button").length) {
				switch(userSettingsProfilePageEditFormMode) {
					case "insert": {
						$form[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						self.setState({ userSettingsProfilePageEditFormInfoMessage: message });
					}; break;
				}
			}

			FlowRouter.go("user_settings.profile", objectUtils.mergeObjects(FlowRouter.current().params, {}));
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			self.setState({ userSettingsProfilePageEditFormErrorMessage: message });
		}

		formUtils.validateForm(
			$form,
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Meteor.call("updateUserAccount", self.props.data.current_user_data._id, values, function(e, r) { if(e) errorAction(e); else submitAction(r); });
			}
		);

		return false;
	}

	onCancel(e) {
		e.preventDefault();
		self = this;
		

		/*CANCEL_REDIRECT*/
	}

	onClose(e) {
		e.preventDefault();
		self = this;

		/*CLOSE_REDIRECT*/
	}

	onBack(e) {
		e.preventDefault();
		self = this;

		/*BACK_REDIRECT*/
	}

	

	

	render() {
		let self = this;
		return (
			<div id="user-settings-profile-page-edit-form" className="">
				<h2 id="component-title">
					<span id="component-title-icon" className="">
					</span>
					Edit your profile
				</h2>
				<form role="form" onSubmit={this.onSubmit}>
					{this.state.userSettingsProfilePageEditFormErrorMessage ? this.renderErrorMessage() : null}
					{this.state.userSettingsProfilePageEditFormInfoMessage ? this.renderInfoMessage() : null}
								<div className="form-group  field-profile-name">
									<label htmlFor="profile.name">
										Name
									</label>
									<div className="input-div">
										<input type="text" name="profile.name" defaultValue={this.props.data.current_user_data.profile.name} className="form-control " autoFocus="autoFocus" required="required" />
										<span id="help-text" className="help-block" />
										<span id="error-text" className="help-block" />
									</div>
								</div>
										<div className="form-group  field-profile-facebook">
						<label htmlFor="profile.facebook">
							Facebook URL
						</label>
						<div className="input-div">
							<input type="text" name="profile.facebook" defaultValue={this.props.data.current_user_data.profile.facebook} className="form-control " />
							<span id="help-text" className="help-block" />
							<span id="error-text" className="help-block" />
						</div>
					</div>
					<div className="form-group  field-profile-google">
						<label htmlFor="profile.google">
							Google+ URL
						</label>
						<div className="input-div">
							<input type="text" name="profile.google" defaultValue={this.props.data.current_user_data.profile.google} className="form-control " />
							<span id="help-text" className="help-block" />
							<span id="error-text" className="help-block" />
						</div>
					</div>
					<div className="form-group  field-profile-twitter">
						<label htmlFor="profile.twitter">
							Twitter ID
						</label>
						<div className="input-div">
							<input type="text" name="profile.twitter" defaultValue={this.props.data.current_user_data.profile.twitter} className="form-control " />
							<span id="help-text" className="help-block" />
							<span id="error-text" className="help-block" />
						</div>
					</div>
					<div className="form-group  field-profile-website">
						<label htmlFor="profile.website">
							Website URL
						</label>
						<div className="input-div">
							<input type="text" name="profile.website" defaultValue={this.props.data.current_user_data.profile.website} className="form-control " />
							<span id="help-text" className="help-block" />
							<span id="error-text" className="help-block" />
						</div>
					</div>
					<div className="form-group">
						<div className="submit-div btn-toolbar">
							<button id="form-submit-button" className="btn btn-success" type="submit">
								Save
							</button>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

