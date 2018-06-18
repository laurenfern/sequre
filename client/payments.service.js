import axios from "axios";

let baseUrl = process.env.REACT_APP_WEB_API_DOMAIN || "";
baseUrl += "/api/payments";

export function create(tokenObject) {
  const config = {
    method: "POST",
    data: tokenObject,
    withCredentials: true
  };

  return axios(baseUrl, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

export function createCustomer(email) {
  const config = {
    method: "PUT",
    data: email,
    withCredentials: true
  };

  return axios(`${baseUrl}/createCustomer`, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

export function createInvoice(invoice) {
  const config = {
    method: "POST",
    data: invoice,
    withCredentials: true
  };

  return axios(`${baseUrl}/invoice`, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

export const getAllInvoices = stripeId => {
  const url = baseUrl + "/invoice/" + stripeId;

  const config = {
    method: "GET",
    withCredentials: true
  };

  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
};

const responseSuccessHandler = response => {
  return response.data;
};

const responseErrorHandler = error => {
  console.log(error);
  return Promise.reject(error);
};
