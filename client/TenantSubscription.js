import React from "react";
import { Modal, FormGroup, Button } from "react-bootstrap";
import moment from "moment";

// Components
import AddCustomerModal from "./AddCustomerModal";

// Services
import { createCustomer } from "../services/payments.service";
import { getAllInvoices } from "../services/payments.service";

// Helpers
import Notifier from "../helpers/notifier";

class TenantSubscription extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTenant: this.props.match.params.tenantId,
      tenantInfo: this.props.tenantInfo,
      showAddModal: false,
      activeItem: {},
      showItemModal: false
    };

    this.onAddCustomer = this.onAddCustomer.bind(this);
    this.onShowModal = this.onShowModal.bind(this);
    this.onHideModal = this.onHideModal.bind(this);
    this.onShowItem = this.onShowItem.bind(this);
    this.onHideItem = this.onHideItem.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ tenantInfo: nextProps.tenantInfo });
  }

  componentDidMount() {
    getAllInvoices(this.state.tenantInfo.stripeId).then(res => {
      this.setState({ invoices: res.item.data });
    });
  }

  onAddCustomer(e, customer) {
    e.preventDefault();
    customer.tenantId = this.state.activeTenant;
    createCustomer(customer).then(response => {
      this.props.onAddStripeId(response.item.id);
      this.onHideModal();
      Notifier.success(
        `Stripe Id created for ${this.state.tenantInfo.tenantName}`
      );
      Notifier.success(
        `${this.state.tenantInfo.tenantName} subscribed to monthly plan`
      );
    });
  }

  onShowModal() {
    this.setState({ showAddModal: true });
  }

  onHideModal() {
    this.setState({ showAddModal: false });
  }

  onShowItem(item) {
    this.setState({
      activeItem: item,
      showItemModal: !this.state.showItemModal
    });
  }

  onHideItem() {
    this.setState({
      activeItem: {},
      showItemModal: !this.state.showItemModal
    });
  }

  render() {
    const invoiceList = this.state.invoices ? (
      this.state.invoices.map(item => {
        return (
          <tr
            key={item.id}
            style={{ cursor: "pointer" }}
            onClick={() => this.onShowItem(item)}
          >
            <td>{moment.unix(item.due_date).format("ll")}</td>
            <td>{item.amount_due}</td>
            <td>{item.paid === true ? <i class="fas fa-check" /> : "no"}</td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td>No invoices to display</td>
      </tr>
    );
    return (
      <React.Fragment>
        <fieldset>
          <section className="col col-6">
            {this.state.tenantInfo && this.state.tenantInfo.stripeId ? (
              <p>Stripe Id: {this.state.tenantInfo.stripeId}</p>
            ) : (
              <p>
                Stripe Id:{" "}
                <button
                  onClick={this.onShowModal}
                  className="btn btn-sm btn-primary"
                >
                  Create stripe Id
                </button>
              </p>
            )}
          </section>
        </fieldset>

        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover">
            <thead>
              <tr>
                <th>Due date</th>
                <th>Amount due</th>
                <th>Paid in Full</th>
              </tr>
            </thead>
            <tbody>{invoiceList}</tbody>
          </table>
        </div>

        {/* Create new stripe id modal */}
        {this.state.tenantInfo.stripeId ? null : (
          <Modal show={this.state.showAddModal} onHide={this.onHideModal}>
            <Modal.Header closeButton>
              <Modal.Title>Create Stripe Id</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddCustomerModal
                onHideModal={this.onHideModal}
                onAddCustomer={this.onAddCustomer}
              />
            </Modal.Body>
          </Modal>
        )}

        {/*Item Modal to display Invoice Details*/}
        {this.state.showItemModal ? (
          <Modal show={this.state.showItemModal} onHide={this.onHideItem}>
            <Modal.Header closeButton>
              <Modal.Title>
                <strong>Details on Invoice: </strong> {this.state.activeItem.id}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FormGroup controlId="formControlsSelect">
                <FormGroup />
                <p>
                  <strong>Billing Reason:</strong>{" "}
                  {this.state.activeItem.billing_reason}
                </p>
                <p>
                  <strong>Total Amount Due on Invoice: </strong>{" "}
                  {this.state.activeItem.amount_due}
                </p>
                <p>
                  <strong>Amount Paid: </strong>{" "}
                  {this.state.activeItem.amount_paid}
                </p>
                <p>
                  <strong>Amount Remaining: </strong>{" "}
                  {this.state.activeItem.amount_remaining}
                </p>
                <p>
                  <strong>Invoice Created On: </strong>{" "}
                  {moment.unix(this.state.activeItem.date).format("ll")}
                </p>
                <p>
                  <strong>Invoice Due On: </strong>{" "}
                  {moment.unix(this.state.activeItem.due_date).format("ll")}
                </p>
                <p>
                  <strong>Customer's Invoice Receipt: </strong>{" "}
                  {this.state.activeItem.number}
                </p>
              </FormGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.onHideItem}>Close</Button>
            </Modal.Footer>
          </Modal>
        ) : null}
      </React.Fragment>
    );
  }
}

export default TenantSubscription;
