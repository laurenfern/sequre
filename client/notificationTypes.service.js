import axios from 'axios'

let baseUrl = process.env.REACT_APP_WEB_API_DOMAIN || '';
baseUrl += '/api/notificationTypes';

export function create(notificationTypeData) {
  const config = {
    method: "POST",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json"
    },
    data: notificationTypeData
    //data: JSON.stringify(notificationTypeData)
  };

  return axios(baseUrl, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
  }

export function readAll() {
  const config = {
    method: "GET",
    withCredentials: true
  };

  return axios(baseUrl, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

export function update(notificationTypeData) {
  const config = {
    method: "PUT",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json"
    },
    data: JSON.stringify(notificationTypeData)
  };

  return axios(`${baseUrl}/${notificationTypeData._id}`, config)
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
