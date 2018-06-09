import React from "react";
import moment from "moment";

const EscrowMessagesList = props => {
  return props.escrowMessages.map(item => {
    return (
      <tr key={item._id}>
        <td className="text-left">{item.subject}</td>
        {/* <td className="text-left">{item.senderRoleCode}</td> */}
        <td className="text-left">{item.senderName}</td>
        <td className="text-left">{item.message}</td>
        <td className="text-left">{moment(item.modifiedDate).format("ll")}</td>
      </tr>
    );
  });
};
export default EscrowMessagesList;
