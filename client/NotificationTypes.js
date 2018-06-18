import React from "react";
import Ribbon from "../components/Ribbon";
import PageHeader from "../components/PageHeader";
import * as notificationTypesService from "../services/notificationTypes.service";
import NotificationTypeForm from "./NotificationTypeForm";

class NotificationTypes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationTypes: []
    };

    this.onAdd = this.onAdd.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  componentDidMount() {
    notificationTypesService
      .readAll()
      .then(data => {
        this.setState({
          notificationTypes: data.items.sort((a, b) => {
            return a.displayOrder - b.displayOrder;
          })
        });
      })
      .catch(error => {
        console.log("component did not mount" + error);
      });
  }

  onAdd() {
    this.setState({
      formData: {}
    });
  }

  onCancel() {
    this.setState({ formData: null });
  }

  onDelete(id) {
    this.setState(prevState => {
      const updatedItems = prevState.notificationTypes.filter(
        notificationType => {
          return notificationType._id !== id;
        }
      );
      return { notificationTypes: updatedItems, formData: null };
    });
  }

  onSave(updatedFormData) {
    this.setState(prevState => {
      const existingItem = prevState.notificationTypes.filter(item => {
        return item._id === updatedFormData._id;
      });
      let updatedItems = [];
      if (existingItem && existingItem.length > 0) {
        updatedItems = prevState.notificationTypes.map(item => {
          return item._id === updatedFormData._id ? updatedFormData : item;
        });
      } else {
        updatedItems = prevState.notificationTypes.concat(updatedFormData);
      }
      return {
        notificationTypes: updatedItems,
        formData: null,
        errorMessage: null
      };
    });
  }

  onSelect(item, event) {
    event.preventDefault();
    this.setState({
      formData: item
    });
  }

  render() {
    // const notificationTypes = this.state.notificationTypes ? (
    //   this.state.notificationTypes.map(notificationType => {
    //     return (
    //       <li key={notificationType._id}>
    //         <a href="/" onClick={e => this.onSelect(notificationType, e)}>
    //           {notificationType.name}
    //         </a>
    //       </li>
    //     )
    //   })
    // ) : (
    //     <div>Loading...</div>
    //   );

    const notificationTypes = this.state.notificationTypes ? (
      this.state.notificationTypes.map(notificationType => {
        return (
          <tr style={{ cursor: "pointer" }} key={notificationType._id}>
            <td onClick={e => this.onSelect(notificationType, e)}>
              {notificationType.name}
            </td>
            {/* <td><button type="button" className="btn btn-primary btn-xs" onClick={e => this.onSelect(notificationType, e)}><i className="fa fa-pencil"></i></button></td> */}
          </tr>
        );
      })
    ) : (
      <div>Loading...</div>
    );

    return (
      <React.Fragment>
        <Ribbon breadcrumbArray={["Notification Types"]} />
        <PageHeader
          title="Notification Types"
          subTitle="View, Create and Edit"
        />
        <div className="container">
          <div className="row">
            <div className="col-sm-6">
              <div className="panel panel-info">
                <div className="panel-heading">
                  <i className="fa fa-fw fa-paper-plane" /> View / Edit
                  <button
                    type="button"
                    className="btn btn-primary btn-xs pull-right"
                    onClick={this.onAdd}
                  >
                    Add New
                  </button>
                </div>

                {/* <div className="panel-body status">
                {
                  this.state.notificationTypes &&
                  <ul className='comments'>
                    {notificationTypes}
                  </ul>
                }
              </div> */}

                <div className="widget-body">
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped table-hover">
                      {/* <thead>
                        <tr>
                          <th>Notification Name</th>
                          <th>Edit</th>
                        </tr>
                      </thead> */}
                      <tbody>{notificationTypes}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {this.state.formData && (
              <div className="col col-sm-5">
                <NotificationTypeForm
                  formData={this.state.formData}
                  onDelete={this.onDelete}
                  onCancel={this.onCancel}
                  onSave={this.onSave}
                />
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default NotificationTypes;
