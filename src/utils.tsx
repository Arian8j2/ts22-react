import store from './redux/store';
import { alert as alertReducer, type Alert } from './redux/reducers';

import { API_URL } from './constants';

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
  if (method == "POST") {
    let csrfCookie = getCookie("csrftoken");
    if (csrfCookie == null)
      return Promise.reject(reasons.reload);

    requestData.headers = {
      "X-CSRFToken": csrfCookie,
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }

  try {
    var response = await fetch(`${API_URL}/${url}`, requestData);
    if (!response.ok)
      throw new Error();
  
    return Promise.resolve(response);
  } catch (err) {
    return Promise.reject(reasons.connectionLost)
  }
}

function addAlert(alert: Alert, durationSecond: number) {
  for (let el of store.getState().alert) {
    if (el.text === alert.text) {
      return;
    }
  }

  store.dispatch(alertReducer.actions.addAlert(alert));
  setTimeout(() => {
    store.dispatch(alertReducer.actions.removeAlert(alert.text));
  }, durationSecond * 1000);
}

function formatNetUsage(kilobytes: number): string {
  if (kilobytes == 0)
    return "صفر ";

  const signs = [ "KB", "MB", "GB" ];
  const index = Math.floor(Math.log(kilobytes) / Math.log(1024));

  let value = (kilobytes / Math.pow(1024, index)).toFixed(index < 2 ? 0: 2);
  return `${value} ${signs[index]}`;
}

function formatConnTime(minute: number): string {
  let metrics = [
    { value: 24, name: "روز"   },
    { value: 60, name: "ساعت" },
    { value:  1, name: "دقیقه" }
  ];

  if (minute == 0)
    return "صفر";

  let texts: string[] = [];
  for (let [index, metric] of metrics.slice().entries()) {
    let [divide, multiply] = metrics.slice(index, metrics.length).reduce(
      (prev, next) => [prev[0] / next.value, prev[1] * next.value],
      [1, 1],
    );

    let remain = Math.floor(minute * divide);
    if (remain) {
      texts.push(`${remain} ${metric.name}`);
      minute -= multiply * remain;
      metrics.pop();
    }
  }

  texts = texts.slice(0, 2);
  return texts.join(" و ");
}

function clamp(value: number, min: number, max: number): number {
  if (value > max)
    return max;
  else if (value < min)
    return min;

  return value;
}

function arrayIsEqual(x: number[], y: number[]): boolean {
  return JSON.stringify(x) == JSON.stringify(y);
}

// https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
var getTextWidthCanvas : HTMLCanvasElement | null = null;
function truncateTextBasedOnWidth(text: string, font: string, max_width: number): string {
  const canvas: HTMLCanvasElement = getTextWidthCanvas || (getTextWidthCanvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  if (!context)
    return text;

  context.font = font;
  let textArray = [...text];
  for (let i = 1; i < textArray.length; i++) {
    let textBuffer = textArray.slice(0, i).join("");
    let metrics = context.measureText(textBuffer);
    if (metrics.width > max_width)
      return textBuffer + "...";
  }

  return text;
}

export { fetchWrapper, addAlert, clamp, formatNetUsage, formatConnTime, arrayIsEqual, truncateTextBasedOnWidth };
