import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTracker, createContainer } from "meteor/react-meteor-data";
import {pathFor, menuItemClass} from "/imports/modules/client/router_utils";
import {Loading} from "/imports/ui/pages/loading/loading.jsx";
import {mergeObjects} from "/imports/modules/both/object_utils";
import {Invoices} from "/imports/api/collections/both/invoices.js";
import * as formUtils from "/imports/modules/client/form_utils";
import * as objectUtils from "/imports/modules/both/object_utils";
import * as dateUtils from "/imports/modules/both/date_utils";
import * as stringUtils from "/imports/modules/both/string_utils";


export class InvoicesDetailsPage extends Component {
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
				<div className="page-container container">
					<div className="row">
						<div className="col-md-12" id="content">
							<div className="row" id="title_row">
								<div className="col-md-12">
								</div>
							</div>
							<InvoicesDetailsPageDetailsForm data={this.props.data} routeParams={this.props.routeParams} />
						</div>
					</div>
					<div className="row">
						<div className="col-md-12" id="menu">
						</div>
					</div>
					<div className="row">
						<div className="col-md-12" id="subcontent">
							{this.props.subcontent}
						</div>
					</div>
				</div>
			);
		}
	}
}

export const InvoicesDetailsPageContainer = withTracker(function(props) {



	let isReady = function() {
		

		let subs = [
			Meteor.subscribe("invoice_details", props.routeParams.invoiceId)
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

				invoice_details: Invoices.findOne({_id:props.routeParams.invoiceId}, {})
			};
		

		
	}
	return { data: data };

})(InvoicesDetailsPage);

export class InvoicesDetailsPageDetailsForm extends Component {
	constructor () {
		super();

		this.state = {
			invoicesDetailsPageDetailsFormErrorMessage: "",
			invoicesDetailsPageDetailsFormInfoMessage: ""
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
				{this.state.invoicesDetailsPageDetailsFormErrorMessage}
			</div>
		);
	}

	renderInfoMessage() {
		return(
			<div className="alert alert-success">
				{this.state.invoicesDetailsPageDetailsFormInfoMessage}
			</div>
		);
	}

	onSubmit(e) {
		e.preventDefault();
		this.setState({ invoicesDetailsPageDetailsFormInfoMessage: "" });
		this.setState({ invoicesDetailsPageDetailsFormErrorMessage: "" });

		var self = this;
		var $form = $(e.target);

		function submitAction(result, msg) {
			var invoicesDetailsPageDetailsFormMode = "read_only";
			if(!$("#invoices-details-page-details-form").find("#form-cancel-button").length) {
				switch(invoicesDetailsPageDetailsFormMode) {
					case "insert": {
						$form[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						self.setState({ invoicesDetailsPageDetailsFormInfoMessage: message });
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			self.setState({ invoicesDetailsPageDetailsFormErrorMessage: message });
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

		/*CLOSE_REDIRECT*/
	}

	onBack(e) {
		e.preventDefault();
		self = this;

		FlowRouter.go("invoices", objectUtils.mergeObjects(FlowRouter.current().params, {}));
	}

	

	

	render() {
		let self = this;
		return (
			<div id="invoices-details-page-details-form" className="">
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
					Invoice details
				</h2>
				<form role="form" onSubmit={this.onSubmit} className="form-horizontal">
					{this.state.invoicesDetailsPageDetailsFormErrorMessage ? this.renderErrorMessage() : null}
					{this.state.invoicesDetailsPageDetailsFormInfoMessage ? this.renderInfoMessage() : null}
								<div className="form-group  field-invoice-number">
									<label htmlFor="invoiceNumber" className="col-sm-3 control-label">
										Invoice number
									</label>
									<div className="input-div col-sm-9">
										<p className="form-control-static  control-field-invoice-number">
											{this.props.data.invoice_details.invoiceNumber}
										</p>
									</div>
								</div>
										<div className="form-group  field-date">
						<label htmlFor="date" className="col-sm-3 control-label">
							Invoice date
						</label>
						<div className="input-div col-sm-9">
							<p className="form-control-static  control-field-date">
								{dateUtils.formatDate(this.props.data.invoice_details.date, 'MM-DD-YYYY')}
							</p>
						</div>
					</div>
					<div className="form-group  field-classroom-name">
						<label htmlFor="classroom.name" className="col-sm-3 control-label">
							Classroom
						</label>
						<div className="input-div col-sm-9">
							<p className="form-control-static  control-field-classroom-name">
								{this.props.data.invoice_details.classroom.name}
							</p>
						</div>
					</div>
					<div className="form-group  field-total-amount">
						<label htmlFor="totalAmount" className="col-sm-3 control-label">
							Total
						</label>
						<div className="input-div col-sm-9">
							<p className="form-control-static  control-field-total-amount">
								{this.props.data.invoice_details.totalAmount}
							</p>
						</div>
					</div>
					<div className="form-group">
						<div className="submit-div btn-toolbar col-sm-9 col-sm-offset-3">
						</div>
					</div>
				</form>
			</div>
		);
	}
}

