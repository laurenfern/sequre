import React from "react";
import {
  Modal,
  Button,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";
import EscrowMessagesList from "./EscrowMessagesList";
import * as escrowMessageService from "../services/escrow.message.service";
import Select from "react-select";
import "react-select/dist/react-select.css";

//constants
import * as constants from "../constants";

class EscrowMessages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeEscrow: this.props.escrowNum,
      activeEscrowInfo: this.props.escrowInfo,
      escrowMessages: [],
      showCompose: false,
      formValue: {
        subject: "",
        message: ""
      },
      people: this.props.escrowInfo.people,
      selectedRecipients: [],
      userRole: this.props.escrowRole,
      userRoleCode: this.props.escrowRoleCode,
      loginStatus: this.props.loginStatus
    };

    this.handleShowCompose = this.handleShowCompose.bind(this);
    this.handleCloseCompose = this.handleCloseCompose.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onSend = this.onSend.bind(this);
  }

  componentDidMount() {
    escrowMessageService
      .readAll(this.state.activeEscrow)
      .then(response => {
        this.setState({ escrowMessages: response.items });
        console.log(response.items);
      })
      .catch(() => {
        console.log("Get messages by escrow id error", this.state.activeEscrow);
      });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      activeEscrowInfo: nextProps.escrowInfo
    });
  }
  handleShowCompose() {
    this.setState({ showCompose: true });
  }

  handleCloseCompose() {
    this.setState({ showCompose: false });
  }

  onSelectChange = selectedRecipients => {
    this.setState({ selectedRecipients: selectedRecipients });
  };

  onChange = e => {
    const value = e.target.value;
    const name = e.target.name;

    this.setState(prevState => {
      const formValue = { ...prevState.formValue };
      formValue[name] = value;
      return {
        formValue: formValue
      };
    });
  };

  onSend() {
    const messageObject = {
      subject: this.state.formValue.subject,
      message: this.state.formValue.message,
      selectedRecipients: this.state.selectedRecipients,
      escrowId: this.state.activeEscrowInfo._id
    };
    escrowMessageService
      .create(messageObject)
      .then(res => {
        this.setState(prevState => {
          messageObject.senderName = res.items.senderName;
          messageObject._id = res.items._id;
          const escrowMessages = prevState.escrowMessages.concat(messageObject);
          return { escrowMessages };
        }, this.handleCloseCompose());
      })
      .catch();
  }

  render() {
    const recipRoles = this.props.escrowRoleCode
      ? constants.canSendTo[this.props.escrowRoleCode]
      : [];
    console.log("recipRoles", recipRoles);

    const availableRecipients =
      this.state.activeEscrowInfo.people &&
      this.state.activeEscrowInfo.people
        .filter(item => item.person)
        .map(person => {
          return {
            value: person.securityRole._id + "|" + person.person._id,
            label:
              person.securityRole.code +
              "," +
              person.person.firstName +
              " " +
              person.person.lastName
          };
        });
    console.log("available Recipients", availableRecipients);

    function myAllowedRecip(a, b) {
      const matches = [];
      for (let i = 0; i < a.length; i++) {
        for (let e = 0; e < b.length; e++) {
          let string = b[e].value;
          if (string.startsWith(a[i])) {
            matches.push({ ...b[e] });
          }
        }
      }
      return matches;
    }

    const allowedRecipients = myAllowedRecip(recipRoles, availableRecipients);

    return this.props.escrowRoleCode ? (
      <React.Fragment>
        <button
          className="btn btn-primary pull-right mb-2"
          onClick={this.handleShowCompose}
        >
          {" "}
          Compose Message{" "}
        </button>
        <table
          id="dt_basic"
          className="table table-striped table-bordered table-hover"
          width="100%"
        >
          <thead>
            <tr>
              <th data-class="expand">
                <i className="fa fa-fw fa-envelope text-muted hidden-md hidden-sm hidden-xs" />{" "}
                Subject
              </th>
              <th data-class="expand">
                <i className="fa fa-fw fa-user text-muted hidden-md hidden-sm hidden-xs" />{" "}
                From
              </th>
              <th data-class="expand">
                <i className="fa fa-fw fa- text-muted hidden-md hidden-sm hidden-xs" />{" "}
                Body
              </th>
              <th data-class="expand">
                <i className="fa fa-fw fa-calendar text-muted hidden-md hidden-sm hidden-xs" />{" "}
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            <EscrowMessagesList escrowMessages={this.state.escrowMessages} />
          </tbody>
        </table>
        {/* This will show when the Compose Message button is clicked */}
        <Modal show={this.state.showCompose} onHide={this.handleCloseCompose}>
          <Modal.Header closeButton>
            <Modal.Title>Compose Message</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup
              id="formControlsText"
              type="text"
              label="Text"
              placeholder="Enter text"
            />
            <FormGroup controlId="formControlsSelect">
              <ControlLabel>To:</ControlLabel>
              <Select
                placeholder=""
                multi={true}
                simpleValue={true}
                name="recipients"
                id="recipients"
                value={this.state.selectedRecipients}
                onChange={this.onSelectChange}
                options={allowedRecipients}
              />

              <ControlLabel>Message Subject:</ControlLabel>
              <FormControl
                type="text"
                value={this.state.formValue.subject}
                placeholder="Enter Subject"
                onChange={this.onChange}
                name="subject"
              />
              <ControlLabel>Message Body:</ControlLabel>
              <FormControl
                componentClass="textarea"
                placeholder="Enter Message"
                value={this.state.formValue.message}
                onChange={this.onChange}
                name="message"
              />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleCloseCompose}>Close</Button>
            <Button onClick={this.onSend} bsStyle="success">
              Send Message
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    ) : (
      <div>Loading</div>
    );
  }
}

export default EscrowMessages;
