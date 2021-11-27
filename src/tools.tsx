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

async function fetchWrapper(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const reasons = {
    reload: "مشکلی پیش اومده لطفا صفحه رو رفرش کنید و در صورت تکرار شدن این مشکل، آن را به ما اطلاع دهید",
    connectionLost: "مشکل در برقراری ارتباط با سرور، لطفا دوباره سعی کنید"
  }

  if(init === undefined)
    init = {}

  init.credentials = "include";

  if(init?.method === "POST"){
    let csrfCookie = getCookie("csrftoken");

    if(csrfCookie == null)
      return Promise.reject(reasons.reload);

    Object.assign(init, {
      headers: {
        "X-CSRFToken": csrfCookie,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  try {
    var response = await fetch(input, init);
    if(!response.ok)
      throw new Error();
  
    return Promise.resolve(response);
  } catch(err) {
    return Promise.reject(reasons.connectionLost)
  }
}

export { fetchWrapper };