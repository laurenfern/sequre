import React from "react";
import deepmerge from "deepmerge";
import PropTypes from "prop-types";
import * as notificationTypesService from "../services/notificationTypes.service";
import {
  FormField,
  FormFieldConfig,
  validate as formFieldValidate
} from "../helpers/form.helper";
import FormPanel from "../components/FormPanel";

class NotificationTypeForm extends React.Component {
  static propTypes = {
    formData: PropTypes.shape({
      name: PropTypes.string,
      code: PropTypes.string,
      documentType: PropTypes.string,
      displayOrder: PropTypes.number,
      isObsolete: PropTypes.bool
    }),
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onDelete: PropTypes.func
  };

  static defaultProps = {
    formData: {
      // in DogForm below "_id" is shown as "id"
      _id: "",
      name: "",
      code: "",
      documentType: "",
      displayOrder: "",
      isObsolete: false
    }
  };

  static formDataConfig = {
    _id: new FormFieldConfig("Id"),
    name: new FormFieldConfig("Name", {
      required: { value: true, message: "Notification Type name is required" },
      maxLength: { value: 50 }
    }),

    code: new FormFieldConfig("Code", {
      required: {
        value: true,
        message: "Code is required and must be less than 10 characters"
      },
      maxLength: { value: 10 }
    }),

    documentType: new FormFieldConfig("Document Type", {
      required: { value: false },
      maxLength: { value: 50 }
    }),

    displayOrder: new FormFieldConfig("Display Order", {
      required: { value: true },
      maxLength: { value: 10 }
    }),

    isObsolete: new FormFieldConfig("Obsolete")
  };

  constructor(props) {
    super(props);
    const formFields = this.convertPropsToFormFields(props);

    this.state = {
      formFields: formFields,
      formValid: this.validateForm(formFields)
    };

    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  validateForm(formFields) {
    return Object.values(formFields).reduce((valid, formField) => {
      return valid && formField.valid;
    }, true);
  }

  convertPropsToFormFields(props) {
    let nType = deepmerge(
      NotificationTypeForm.defaultProps.formData,
      props.formData
    );

    const formFields = {
      _id: new FormField(nType._id),
      name: new FormField(nType.name),
      code: new FormField(nType.code),
      documentType: new FormField(nType.documentType),
      displayOrder: new FormField(nType.displayOrder),
      isObsolete: new FormField(nType.isObsolete)
    };

    for (let fieldName in formFields) {
      let field = formFields[fieldName];
      let config = NotificationTypeForm.formDataConfig[fieldName];
      formFieldValidate(field, config);
    }

    return formFields;
  }

  componentWillReceiveProps(nextProps) {
    const formFields = this.convertPropsToFormFields(nextProps);
    this.setState({
      formFields: formFields,
      formValid: this.validateForm(formFields)
    });
  }
  /* Purpose of the onChange is to update the state.  onChange is called in each input of the
Form. onChange is called each time a character is typed into the input. 
Each time onChange is called, it updates the state.formField (which holds the value of the input)
and the state.formValid (which says whether or not the input passes clientside validation).
These updated states will be passed to the onSave when the Save button is clicked. 
*/
  onChange(event) {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    const name = event.target.name;
    const config = NotificationTypeForm.formDataConfig[name];

    this.setState(prevState => {
      const field = { ...prevState.formFields[name] };
      field.value = value;
      field.touched = true;
      formFieldValidate(field, config);
      const formFields = { ...prevState.formFields, [name]: field };
      let formValid = this.validateForm(formFields);
      return { formFields: formFields, formValid: formValid };
    });
  }

  onSave(event) {
    if (!this.state.formValid) {
      // Mark all fields as touched to display validation errors for all fields
      const formFields = JSON.parse(JSON.stringify(this.state.formFields));
      for (let fieldIdentifier in formFields) {
        formFields[fieldIdentifier].touched = false;
      }
      this.setState({ formFields: formFields });
      return;
    }
    const item = {
      name: this.state.formFields.name.value,
      code: this.state.formFields.code.value,
      displayOrder: this.state.formFields.displayOrder.value,
      documentType: this.state.formFields.documentType.value,
      isObsolete: this.state.formFields.isObsolete.value
    };
    console.log(item);
    if (this.state.formFields._id.value) {
      item._id = this.state.formFields._id.value;
      notificationTypesService
        .update(item)
        .then(data => {
          console.log("Saved changes" + item);
          this.props.onSave(item);
        })
        .catch(error => {
          console.log("Save changes failed: ", error);
        });
    } else {
      notificationTypesService
        .create(item)
        .then(data => {
          console.log("Saved new notification type", data);

          this.setState(prevState => {
            const field = { ...prevState.formFields._id, value: data.item };
            //note that above, property name "value" fixed the bug in POST function
            //where Notification Type Id wasn't showing in the DOM.
            const formFields = { ...prevState.formFields, _id: field };
            return { ...prevState, formFields: formFields };
          });
          console.log(
            "This is the this.state.formFields",
            this.state.formFields
          );
          this.props.onSave({ ...item, _id: data.item });
          //note that above, property name "_id" fixed the bug in POST function
          //where Notification Type Id wasn't showing in the DOM.
        })
        .catch(error => {
          console.log("Saved new notification type failed: ", error);
        });
    }
  }

  onCancel(event) {
    this.props.onCancel();
  }

  onDelete(event) {
    notificationTypesService
      .del(this.state.formFields._id.value)
      .then(() => {
        // If delete worked, parent control will hide form
        this.props.onDelete(this.state.formFields._id.value);
      })
      .catch(err => {
        console.log("Delete failed: ", err);
      });
  }

  renderErrorMsgs(field) {
    return !field.valid && field.touched
      ? field.brokenRules.map(br => {
          return (
            <div key={br.rule} className="note note-error">
              {br.msg}
            </div>
          );
        })
      : null;
  }

  inputClassName(field) {
    return !field.valid && field.touched ? "input state-error" : "input";
  }

  render() {
    const title = (
      <span>
        <i className="fa fa-fw fa-paper-plane" /> Create / Edit Notification
        Type
      </span>
    );

    return (
      <FormPanel title={title}>
        <form className="smart-form">
          <fieldset>
            <section>
              <label htmlFor="name">
                {NotificationTypeForm.formDataConfig.name.displayName}
              </label>
              <label
                className={this.inputClassName(this.state.formFields.name)}
              >
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="form-control"
                  value={this.state.formFields.name.value}
                  onChange={this.onChange}
                />
              </label>
              {this.renderErrorMsgs(this.state.formFields.name)}
            </section>
            <section>
              <label
                className={this.inputClassName(this.state.formFields.code)}
                htmlFor="breed"
              >
                Code
              </label>
              <label className="input">
                <input
                  type="text"
                  name="code"
                  id="code"
                  className="form-control"
                  value={this.state.formFields.code.value}
                  onChange={this.onChange}
                />
              </label>
              {this.renderErrorMsgs(this.state.formFields.code)}
            </section>
            <section>
              <label htmlFor="documentType">Document Type (optional)</label>
              <label
                className={this.inputClassName(
                  this.state.formFields.documentType
                )}
              >
                <input
                  type="string"
                  name="documentType"
                  id="documentType"
                  className="form-control"
                  value={this.state.formFields.documentType.value}
                  onChange={this.onChange}
                />
              </label>
              {this.renderErrorMsgs(this.state.formFields.documentType)}
            </section>
            <section>
              <label
                className={this.inputClassName(
                  this.state.formFields.displayOrder
                )}
                htmlFor="displayOrder"
              >
                Display Order
              </label>
              <label className="input">
                <input
                  type="text"
                  name="displayOrder"
                  id="displayOrder"
                  className="form-control"
                  value={this.state.formFields.displayOrder.value}
                  onChange={this.onChange}
                />
              </label>
              {this.renderErrorMsgs(this.state.formFields.displayOrder)}
            </section>
            <section>
              <div className="checkbox">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="isObsolete"
                    checked={this.state.formFields.isObsolete.value}
                    value={true}
                    onChange={this.onChange}
                  />
                  <i />Obsolete
                </label>
              </div>
            </section>
          </fieldset>

          <fieldset className="hidden">
            <section>
              <div className="form-group">
                <label htmlFor="itemId">Notification Type Id:</label>
                <label className="input">
                  <input
                    type="text"
                    name="id"
                    id="itemId"
                    className="form-control"
                    disabled
                    value={this.state.formFields._id.value}
                    onChange={this.onChange}
                  />
                </label>
              </div>
            </section>
          </fieldset>
          <div className="btn-group pull-right" role="group">
            <button
              type="button"
              onClick={this.onSave}
              className="btn btn-primary btn-xs"
              disabled={!this.state.formValid}
            >
              {this.state.formFields._id.value ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={this.onCancel}
              className="btn btn-warning btn-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => this.onDelete(this.state.formFields)}
              className="btn btn-danger btn-xs"
            >
              Delete
            </button>
          </div>
        </form>
      </FormPanel>
    );
  }
}

export default NotificationTypeForm;
