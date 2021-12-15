import { API_URL } from './constants'

import store from './redux/store'
import { addAlert as addAlertAction, removeAlert } from './redux/reducers'

function getCookie(name: string): string | null {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

interface BasicInfo {
  method: string,
  data?: Object
};

async function fetchWrapper(url: string, { method, data }: BasicInfo = { method: "GET" }): Promise<Response> {
  const reasons = {
    reload: "مشکلی پیش اومده لطفا صفحه رو رفرش کنید و در صورت تکرار شدن این مشکل، آن را به ما اطلاع دهید",
    connectionLost: "مشکل در برقراری ارتباط با سرور، لطفا دوباره سعی کنید"
  }

  let requestData: RequestInit = {
    credentials: "include",
    method: method,
    body: data ? JSON.stringify(data) : undefined
  };

  // only include csrftoken in post requests
  if(method === "POST"){
    let csrfCookie = getCookie("csrftoken");

    if(csrfCookie == null)
      return Promise.reject(reasons.reload);

    requestData.headers = {
      "X-CSRFToken": csrfCookie,
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }

  try {
    var response = await fetch(`${API_URL}/${url}`, requestData);
    if(!response.ok)
      throw new Error();
  
    return Promise.resolve(response);
  } catch(err) {
    return Promise.reject(reasons.connectionLost)
  }
}

function addAlert(alert: AlertInfo, durationSecond: number) {
  for(let al of store.getState().alerts)
    if(al.text === alert.text)
      return;

  store.dispatch(addAlertAction(alert));

  setTimeout(() => {
    store.dispatch(removeAlert(alert.text));
  }, durationSecond * 1000);
}

export { fetchWrapper, addAlert };