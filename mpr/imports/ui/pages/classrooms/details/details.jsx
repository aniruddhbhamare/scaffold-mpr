import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTracker, createContainer } from "meteor/react-meteor-data";
import {pathFor, menuItemClass} from "/imports/modules/client/router_utils";
import {Loading} from "/imports/ui/pages/loading/loading.jsx";
import {mergeObjects} from "/imports/modules/both/object_utils";
import {Classrooms} from "/imports/api/collections/both/classrooms.js";
import * as formUtils from "/imports/modules/client/form_utils";
import * as objectUtils from "/imports/modules/both/object_utils";
import * as dateUtils from "/imports/modules/both/date_utils";
import * as stringUtils from "/imports/modules/both/string_utils";


export class ClassroomsDetailsPage extends Component {
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
						<ClassroomsDetailsPageDetailsForm data={this.props.data} routeParams={this.props.routeParams} />
					</div>
				</div>
			);
		}
	}
}

export const ClassroomsDetailsPageContainer = withTracker(function(props) {



	let isReady = function() {
		

		let subs = [
			Meteor.subscribe("classroom_details", props.routeParams.classroomId)
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

				classroom_details: Classrooms.findOne({_id:props.routeParams.classroomId}, {})
			};
		

		
	}
	return { data: data };

})(ClassroomsDetailsPage);

export class ClassroomsDetailsPageDetailsForm extends Component {
	constructor () {
		super();

		this.state = {
			classroomsDetailsPageDetailsFormErrorMessage: "",
			classroomsDetailsPageDetailsFormInfoMessage: ""
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
				{this.state.classroomsDetailsPageDetailsFormErrorMessage}
			</div>
		);
	}

	renderInfoMessage() {
		return(
			<div className="alert alert-success">
				{this.state.classroomsDetailsPageDetailsFormInfoMessage}
			</div>
		);
	}

	onSubmit(e) {
		e.preventDefault();
		this.setState({ classroomsDetailsPageDetailsFormInfoMessage: "" });
		this.setState({ classroomsDetailsPageDetailsFormErrorMessage: "" });

		var self = this;
		var $form = $(e.target);

		function submitAction(result, msg) {
			var classroomsDetailsPageDetailsFormMode = "read_only";
			if(!$("#classrooms-details-page-details-form").find("#form-cancel-button").length) {
				switch(classroomsDetailsPageDetailsFormMode) {
					case "insert": {
						$form[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						self.setState({ classroomsDetailsPageDetailsFormInfoMessage: message });
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			self.setState({ classroomsDetailsPageDetailsFormErrorMessage: message });
		}

		formUtils.validateForm(
			$form,
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				
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

		FlowRouter.go("classrooms", objectUtils.mergeObjects(FlowRouter.current().params, {}));
	}

	onBack(e) {
		e.preventDefault();
		self = this;

		FlowRouter.go("classrooms", objectUtils.mergeObjects(FlowRouter.current().params, {}));
	}

	

	

	render() {
		let self = this;
		return (
			<div id="classrooms-details-page-details-form" className="">
				<h2 id="component-title">
					<span id="form-back-button">
						<a href="#" className="btn btn-default" title="back" onClick={this.onBack}>
							<span className="fa fa-chevron-left">
							</span>
						</a>
						&nbsp;
					</span>
					<span id="component-title-icon" className="">
					</span>
					Details
				</h2>
				<form role="form" onSubmit={this.onSubmit}>
					{this.state.classroomsDetailsPageDetailsFormErrorMessage ? this.renderErrorMessage() : null}
					{this.state.classroomsDetailsPageDetailsFormInfoMessage ? this.renderInfoMessage() : null}
								<div className="form-group  field-name">
									<label htmlFor="name">
										Name
									</label>
									<div className="input-div">
										<p className="form-control-static  control-field-name">
											{this.props.data.classroom_details.name}
										</p>
									</div>
								</div>
										<div className="form-group  field-phone">
						<label htmlFor="phone">
							Phone
						</label>
						<div className="input-div">
							<p className="form-control-static  control-field-phone">
								{this.props.data.classroom_details.phone}
							</p>
						</div>
					</div>
					<div className="form-group  field-email">
						<label htmlFor="email">
							E-mail
						</label>
						<div className="input-div">
							<p className="form-control-static  control-field-email">
								{this.props.data.classroom_details.email}
							</p>
						</div>
					</div>
					<div className="form-group  field-note">
						<label htmlFor="note">
							Note
						</label>
						<div className="input-div">
							<p className="form-control-static  control-field-note">
								{this.props.data.classroom_details.note}
							</p>
						</div>
					</div>
					<div className="form-group  field-invoiced">
						<label htmlFor="invoiced">
							Invoiced
						</label>
						<div className="input-div">
							<p className="form-control-static  control-field-invoiced">
								{this.props.data.classroom_details.invoiced}
							</p>
						</div>
					</div>
					<div className="form-group">
						<div className="submit-div btn-toolbar">
							<a href="#" id="form-close-button" className="btn btn-primary" onClick={this.onClose}>
								OK
							</a>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

