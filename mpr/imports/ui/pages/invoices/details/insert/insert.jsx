import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTracker, createContainer } from "meteor/react-meteor-data";
import {pathFor, menuItemClass} from "/imports/modules/client/router_utils";
import {Loading} from "/imports/ui/pages/loading/loading.jsx";
import {mergeObjects} from "/imports/modules/both/object_utils";
import {InvoiceItems} from "/imports/api/collections/both/invoice_items.js";
import {Invoices} from "/imports/api/collections/both/invoices.js";
import * as formUtils from "/imports/modules/client/form_utils";
import * as objectUtils from "/imports/modules/both/object_utils";
import * as dateUtils from "/imports/modules/both/date_utils";
import * as stringUtils from "/imports/modules/both/string_utils";


export class InvoicesDetailsInsertPage extends Component {
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
						<InvoicesDetailsInsertPageInsertForm data={this.props.data} routeParams={this.props.routeParams} />
					</div>
				</div>
			);
		}
	}
}

export const InvoicesDetailsInsertPageContainer = withTracker(function(props) {



	let isReady = function() {
		

		let subs = [
			Meteor.subscribe("invoice_items_empty"),
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

				invoice_items_empty: InvoiceItems.findOne({_id:null}, {}),
				invoice_details: Invoices.findOne({_id:props.routeParams.invoiceId}, {})
			};
		

		
	}
	return { data: data };

})(InvoicesDetailsInsertPage);

export class InvoicesDetailsInsertPageInsertForm extends Component {
	constructor () {
		super();

		this.state = {
			invoicesDetailsInsertPageInsertFormErrorMessage: "",
			invoicesDetailsInsertPageInsertFormInfoMessage: ""
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
				{this.state.invoicesDetailsInsertPageInsertFormErrorMessage}
			</div>
		);
	}

	renderInfoMessage() {
		return(
			<div className="alert alert-success">
				{this.state.invoicesDetailsInsertPageInsertFormInfoMessage}
			</div>
		);
	}

	onSubmit(e) {
		e.preventDefault();
		this.setState({ invoicesDetailsInsertPageInsertFormInfoMessage: "" });
		this.setState({ invoicesDetailsInsertPageInsertFormErrorMessage: "" });

		var self = this;
		var $form = $(e.target);

		function submitAction(result, msg) {
			var invoicesDetailsInsertPageInsertFormMode = "insert";
			if(!$("#invoices-details-insert-page-insert-form").find("#form-cancel-button").length) {
				switch(invoicesDetailsInsertPageInsertFormMode) {
					case "insert": {
						$form[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						self.setState({ invoicesDetailsInsertPageInsertFormInfoMessage: message });
					}; break;
				}
			}

			FlowRouter.go("invoices.details", objectUtils.mergeObjects(FlowRouter.current().params, {invoiceId: self.props.routeParams.invoiceId}));
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			self.setState({ invoicesDetailsInsertPageInsertFormErrorMessage: message });
		}

		formUtils.validateForm(
			$form,
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				values.invoiceId = self.props.routeParams.invoiceId;

				Meteor.call("invoiceItemsInsert", values, function(e, r) { if(e) errorAction(e); else submitAction(r); });
			}
		);

		return false;
	}

	onCancel(e) {
		e.preventDefault();
		self = this;
		

		FlowRouter.go("invoices.details", objectUtils.mergeObjects(FlowRouter.current().params, {invoiceId: self.props.routeParams.invoiceId}));
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
			<div id="invoices-details-insert-page-insert-form" className="">
				<h2 id="component-title">
					<span id="component-title-icon" className="">
					</span>
					Add item
				</h2>
				<form role="form" onSubmit={this.onSubmit}>
					{this.state.invoicesDetailsInsertPageInsertFormErrorMessage ? this.renderErrorMessage() : null}
					{this.state.invoicesDetailsInsertPageInsertFormInfoMessage ? this.renderInfoMessage() : null}
								<div className="form-group  field-description">
									<label htmlFor="description">
										Description
									</label>
									<div className="input-div">
										<input type="text" name="description" defaultValue="" className="form-control " autoFocus="autoFocus" required="required" />
										<span id="help-text" className="help-block" />
										<span id="error-text" className="help-block" />
									</div>
								</div>
										<div className="form-group  field-quantity">
						<label htmlFor="quantity">
							Quantity
						</label>
						<div className="input-div">
							<input type="text" name="quantity" defaultValue="1" className="form-control " required="required" data-type="float" />
							<span id="help-text" className="help-block" />
							<span id="error-text" className="help-block" />
						</div>
					</div>
					<div className="form-group  field-price">
						<label htmlFor="price">
							Price
						</label>
						<div className="input-div">
							<input type="text" name="price" defaultValue="0" className="form-control " required="required" data-type="float" />
							<span id="help-text" className="help-block" />
							<span id="error-text" className="help-block" />
						</div>
					</div>
					<div className="form-group">
						<div className="submit-div btn-toolbar">
							<a href="#" id="form-cancel-button" className="btn btn-default" onClick={this.onCancel}>
								Cancel
							</a>
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

