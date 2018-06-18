import axios from "axios";

let baseUrl = process.env.REACT_APP_WEB_API_DOMAIN || "";
baseUrl += "/api/escrowMessages";

export function readAll(escrowId) {
  const config = {
    method: "GET",
    withCredentials: true,
    data: escrowId
  };
  const url = baseUrl + "/" + escrowId;
  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

export function create(messageData) {
  const config = {
    method: "POST",
    data: messageData,
    withCredentials: true
  };

  return axios(baseUrl, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

export function del(id) {
  const config = {
    method: "DELETE",
    withCredentials: true
  };

  return axios(`${baseUrl}/${id}`, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

const responseSuccessHandler = response => {
  return response.data;
};

const responseErrorHandler = error => {
  console.log(error);
  return Promise.reject(error);
};
