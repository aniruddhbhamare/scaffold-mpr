import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTracker, createContainer } from "meteor/react-meteor-data";
import {pathFor, menuItemClass} from "/imports/modules/client/router_utils";
import {Loading} from "/imports/ui/pages/loading/loading.jsx";
import {mergeObjects} from "/imports/modules/both/object_utils";
import * as databaseUtils from "/imports/modules/both/database_utils";
import {InvoiceItems} from "/imports/api/collections/both/invoice_items.js";
import {Invoices} from "/imports/api/collections/both/invoices.js";
import * as objectUtils from "/imports/modules/both/object_utils";
import * as dateUtils from "/imports/modules/both/date_utils";
import * as httpUtils from "/imports/modules/client/http_utils";
import {Markdown} from "/imports/ui/components/markdown/markdown.jsx";
import {ConfirmationDialog} from "/imports/ui/components/confirmation_dialog/confirmation_dialog.jsx";


export class InvoicesDetailsItemsPage extends Component {
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
						<InvoicesDetailsItemsPageView data={this.props.data} routeParams={this.props.routeParams} />
					</div>
				</div>
			);
		}
	}
}

export const InvoicesDetailsItemsPageContainer = withTracker(function(props) {

	let invoiceItemsPagedExtraParams = {
		searchText: Session.get("InvoiceItemsPagedSearchString") || "",
		searchFields: Session.get("InvoiceItemsPagedSearchFields") || ["description", "quantity", "price", "amount"],
		sortBy: Session.get("InvoiceItemsPagedSortBy") || "",
		sortAscending: Session.get("InvoiceItemsPagedSortAscending"),
		pageNo: Session.get("InvoiceItemsPagedPageNo") || 0,
		pageSize: Session.get("InvoiceItemsPagedPageSize") || 20
	};


	let isReady = function() {
		

		let subs = [
			Meteor.subscribe("invoice_items_paged", props.routeParams.invoiceId, invoiceItemsPagedExtraParams),
			Meteor.subscribe("invoice_items_paged_count", props.routeParams.invoiceId, invoiceItemsPagedExtraParams),
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

				invoice_items_paged: InvoiceItems.find(databaseUtils.extendFilter({invoiceId:props.routeParams.invoiceId}, invoiceItemsPagedExtraParams), databaseUtils.extendOptions({}, invoiceItemsPagedExtraParams)).fetch(),
				invoice_items_paged_count: Counts.get("invoice_items_paged_count"),
				invoice_details: Invoices.findOne({_id:props.routeParams.invoiceId}, {})
			};
		

		
		data.invoice_items_paged_page_count = invoiceItemsPagedExtraParams && invoiceItemsPagedExtraParams.pageSize ? Math.ceil(data.invoice_items_paged_count / invoiceItemsPagedExtraParams.pageSize) : 1;
		if(invoiceItemsPagedExtraParams.pageNo >= data.invoice_items_paged_page_count) {
			Session.set("InvoiceItemsPagedPageNo", data.invoice_items_paged_page_count > 0 ? data.invoice_items_paged_page_count - 1 : 0);
		}

	}
	return { data: data };

})(InvoicesDetailsItemsPage);

export class InvoicesDetailsItemsPageView extends Component {
	constructor () {
		super();

		this.state = {
		};

		this.isNotEmpty = this.isNotEmpty.bind(this);
		this.isNotFound = this.isNotFound.bind(this);
		this.onInsert = this.onInsert.bind(this);
		this.onSearch = this.onSearch.bind(this);
		this.onSort = this.onSort.bind(this);
		this.exportData = this.exportData.bind(this);
		this.onExportCSV = this.onExportCSV.bind(this);
		this.onExportTSV = this.onExportTSV.bind(this);
		this.onExportJSON = this.onExportJSON.bind(this);

		this.onPrevPage = this.onPrevPage.bind(this);
		this.onNextPage = this.onNextPage.bind(this);

		this.renderTable = this.renderTable.bind(this);
		this.renderList = this.renderList.bind(this);
		this.renderBlog = this.renderBlog.bind(this);
		this.renderCards = this.renderCards.bind(this);
		this.renderPager = this.renderPager.bind(this);
		this.renderData = this.renderData.bind(this);

		
	}

	componentWillMount() {
		Session.set("InvoiceItemsPagedSearchFields", ["description", "quantity", "price", "amount"]);

		
	}

	componentWillUnmount() {
		
	}

	componentDidMount() {
		
	}

	isNotEmpty() {
		return this.props.data.invoice_items_paged && this.props.data.invoice_items_paged.length > 0;
	}

	isNotFound() {
		return this.props.data.invoice_items_paged && this.props.data.invoice_items_paged.length == 0 && Session.get("InvoiceItemsPagedSearchString");
	}

	noData() {
		return (!this.props.data.invoice_items_paged || this.props.data.invoice_items_paged.length == 0) && !Session.get("InvoiceItemsPagedSearchString");
	}

	onInsert(e) {
		FlowRouter.go("invoices.details.insert", objectUtils.mergeObjects(FlowRouter.current().params, {invoiceId: this.props.routeParams.invoiceId}));
	}

	onSearch(e) {
		e.preventDefault();
		let form = $(e.currentTarget).closest("form");
		let searchInput = form.find("#dataview-search-input");
		searchInput.focus();
		let searchString = searchInput.val();
		Session.set("InvoiceItemsPagedSearchString", searchString);
	}

	onSearchKeyDown(e) {
		if(e.which === 27)
		{
			e.preventDefault();
			let form = $(e.currentTarget).closest("form");
			let searchInput = form.find("#dataview-search-input");
			searchInput.val("");
			Session.set("InvoiceItemsPagedSearchString", "");
			return false;
		}
		return true;
	}

	onSort(e) {
		e.preventDefault();

		let oldSortBy = Session.get("InvoiceItemsPagedSortBy") || "";
		let newSortBy = $(e.currentTarget).attr("data-sort");
		Session.set("InvoiceItemsPagedSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			let sortAscending = Session.get("InvoiceItemsPagedSortAscending");
			if(typeof sortAscending == "undefined") {
				sortAscending = true;
			}
			Session.set("InvoiceItemsPagedSortAscending", !sortAscending);
		} else {
			Session.set("InvoiceItemsPagedSortAscending", true);
		}
	}

	exportData(fileType) {
		let extraParams = {
			searchText: Session.get("InvoiceItemsPagedSearchString") || "",
			searchFields: Session.get("InvoiceItemsPagedSearchFields") || ["description", "quantity", "price", "amount"],
			sortBy: Session.get("InvoiceItemsPagedSortBy") || ""
		};

		

		let exportFields = ["description", "quantity", "price", "amount"];

		Meteor.call("invoiceItemsPagedExport", this.props.routeParams.invoiceId, extraParams, exportFields, fileType, function(e, data) {
			if(e) {
				alert(e);
				return;
			}

			let filename = "export." + fileType;
			httpUtils.downloadLocalResource(data, filename, "application/octet-stream");
		});
	}

	onExportCSV(e) {
		this.exportData("csv");
	}

	onExportTSV(e) {
		this.exportData("tsv");
	}

	onExportJSON(e) {
		this.exportData("json");
	}

	onPrevPage(e) {
		e.preventDefault();
		let currentPage = Session.get("InvoiceItemsPagedPageNo") || 0;
		if(currentPage > 0) {
			Session.set("InvoiceItemsPagedPageNo", currentPage - 1);
		}
	}

	onNextPage(e) {
		e.preventDefault();
		let currentPage = Session.get("InvoiceItemsPagedPageNo") || 0;
		if(currentPage < this.props.data.invoice_items_paged_page_count - 1) {
			Session.set("InvoiceItemsPagedPageNo", currentPage + 1);
		}
	}

	renderTable() {
		var self = this;
		var parentData = {};

		return (
			<div key="table" id="dataview-data-table">
				<table id="dataview-table" className="table table-striped">
					<thead id="dataview-table-header">
						<tr id="dataview-table-header-row">
							<th className="th-sortable" data-sort="description" onClick={this.onSort}>
								Description
							</th>
							<th className="th-sortable" data-sort="quantity" onClick={this.onSort}>
								Quantity
							</th>
							<th className="th-sortable" data-sort="price" onClick={this.onSort}>
								Price
							</th>
							<th className="th-sortable" data-sort="amount" onClick={this.onSort}>
								Amount
							</th>
							<th>
								&nbsp;
							</th>
							<th>
								&nbsp;
							</th>
						</tr>
					</thead>
					<tbody id="dataview-table-items">
						{this.props.data.invoice_items_paged.map(function(item) {
			return(
							<InvoicesDetailsItemsPageViewTableItems key={item._id} data={item} routeParams={self.props.routeParams} onDelete={self.onDelete} parentData={parentData} />
									);
		})}
					</tbody>
				</table>
			</div>
		);
	}

	renderList() {
		var self = this;
		return (
			<div key="list" id="dataview-data-list">
			</div>
		);
	}

	renderBlog() {
		var self = this;
		return (
			<div key="blog" id="dataview-data-blog">
			</div>
		);
	}

	renderCards() {
		var self = this;
		return (
			<div key="cards" id="dataview-data-cards">
			</div>
		);
	}

	renderPager() {
		let currentPage = Session.get("InvoiceItemsPagedPageNo") || 0;
		return (
			<nav key="pager" aria-label="...">
				<ul className="pager">
					{currentPage > 0 ?
					<li>
						<a href="#" onClick={this.onPrevPage}>
							Previous page
						</a>
						&nbsp;
					</li>
					: null}
					{currentPage < this.props.data.invoice_items_paged_page_count - 1 ?
								<li>
									&nbsp;
									<a href="#" onClick={this.onNextPage}>
										Next page
									</a>
								</li>
										: null}
				</ul>
			</nav>
		);
	}

	renderData() {
		let viewStyle = Session.get("InvoicesDetailsItemsPageViewStyle") || "table";
		switch(viewStyle) {
			case "table": return this.renderTable(); break;
			case "blog": return this.renderBlog(); break;
			case "list" : return this.renderList(); break;
			case "cards": return this.renderCards(); break;
			default: return this.renderTable();
		}
	}



	insertButtonClass() {
		return InvoiceItems.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	}

	

	

	render() {
		return (
			<div id="invoices-details-items-page-view" className="">
				<h2 id="component-title">
					<span id="component-title-icon" className="">
					</span>
				</h2>
				<div id="controls-row" className="row">
					<div className="col-md-12">
						<form id="dataview-controls" className="form-inline">
							<div id="dataview-controls-insert" className={`form-group ${this.insertButtonClass()}`}>
								<button type="button" id="dataview-insert-button" className="btn btn-success" onClick={this.onInsert}>
									<span className="fa fa-plus">
									</span>
									&nbsp;Add item
								</button>
								&nbsp;
							</div>
							<div id="dataview-controls-search" className="form-group">
								{
			this.noData() ? null : (
									<div>
										<div id="dataview-controls-search-group" className="input-group">
											<input type="text" className="form-control" id="dataview-search-input" placeholder="Search" name="search" defaultValue={Session.get("InvoiceItemsPagedSearchString")} onKeyDown={this.onSearchKeyDown} autoFocus={true} />
											<span className="input-group-btn">
												<button type="submit" id="dataview-search-button" className="btn btn-primary" onClick={this.onSearch}>
													<span className="fa fa-search">
													</span>
												</button>
											</span>
										</div>
										&nbsp;
									</div>
											)
		}
							</div>
							<div id="dataview-controls-export" className="form-group">
								{
			this.isNotEmpty() ? (
									<div className="btn-group">
										<button type="button" className="btn btn-default" id="dataview-export-default" onClick={this.onExportCSV}>
											Download
										</button>
										<button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
											<span className="caret">
											</span>
										</button>
										<ul className="dropdown-menu" role="menu">
											<li onClick={this.onExportCSV}>
												<a href="#">
													Download as CSV
												</a>
											</li>
											<li onClick={this.onExportTSV}>
												<a href="#">
													Download as TSV
												</a>
											</li>
											<li onClick={this.onExportJSON}>
												<a href="#">
													Download as JSON
												</a>
											</li>
										</ul>
									</div>
											) : null
		}
							</div>
						</form>
					</div>
				</div>
				{this.isNotEmpty() ? [this.renderData(), this.renderPager()] : (this.isNotFound() ?
				<div className="alert alert-warning">
					{"\"" + Session.get("InvoiceItemsPagedSearchString") + "\" not found."}
				</div>
				:
				<div className="alert alert-info">
					No items
				</div>
				)}
			</div>
		);
	}
}
export class InvoicesDetailsItemsPageViewTableItems extends Component {
	constructor() {
		super();
		this.onToggle = this.onToggle.bind(this);
		this.onEdit = this.onEdit.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onSelect = this.onSelect.bind(this);
		
	}

	onToggle(e) {
		e.stopPropagation();
		let self = this;
		let itemId = this.props.data._id;
		let toggleField = $(e.currentTarget).attr("data-field");

		let data = {};
		data[toggleField] = !this.props.data[toggleField];

		Meteor.call("invoiceItemsUpdate", itemId, data, function(err, res) {
			if(err) {
				alert(err);
			}
		});
	}

	onEdit(e) {
		e.stopPropagation();
		let self = this;
		let itemId = this.props.data._id;
		FlowRouter.go("invoices.details.edit", objectUtils.mergeObjects(FlowRouter.current().params, {invoiceId: this.props.routeParams.invoiceId, itemId: this.props.data._id}));
	}

	onDelete(e) {
		e.stopPropagation();
		let self = this;
		let itemId = this.props.data._id;
		ConfirmationDialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			onYes: function(id) {
				Meteor.call("invoiceItemsRemove", id, function(err, res) {
					if(err) {
						alert(err);
					}
				});
			},
			onNo: null,
			onCancel: null,
			buttonYesTitle: "Yes",
			buttonNoTitle: "No",
			buttonCancelTitle: null,
			showCancelButton: false,
			payload: itemId
		});
	}

	onSelect(e) {
		e.stopPropagation();
		let self = this;
		let item = this.props.data;
		let itemId = item ? item._id : null;

		
		/**/
	}

	editButtonClass() {
		return InvoiceItems.userCanUpdate(Meteor.userId(), this.props.data) ? "" : "hidden";
	}

	deleteButtonClass() {
		return InvoiceItems.userCanRemove(Meteor.userId(), this.props.data) ? "" : "hidden";
	}

	

	

	

	

	render() {
		return(
			<tr id="dataview-table-items-row">
				<td onClick={this.onSelect}>
					{this.props.data.description}
				</td>
				<td onClick={this.onSelect}>
					{this.props.data.quantity}
				</td>
				<td onClick={this.onSelect}>
					{this.props.data.price}
				</td>
				<td onClick={this.onSelect}>
					{this.props.data.amount}
				</td>
				<td className="td-icon">
					<span id="edit-button" className={`fa fa-pencil ${this.editButtonClass()}`} title="Edit" onClick={this.onEdit}>
					</span>
				</td>
				<td className="td-icon">
					<span id="delete-button" className={`fa fa-trash-o ${this.deleteButtonClass()}`} title="Delete" onClick={this.onDelete}>
					</span>
				</td>
			</tr>
		);
	}
}

