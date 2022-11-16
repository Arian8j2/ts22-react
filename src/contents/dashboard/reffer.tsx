import { useState, type ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootReducer, clientInfo } from '../../redux/reducers';
import { addAlert, fetchWrapper } from '../../utils';

export default function Reffer() {
  const { refid, cldbid } = useSelector((state: RootReducer) => state.clientInfo);
  const dispatch = useDispatch();

  const [refidInput, setRefidInput] = useState<string>();
  const hasRefid = refid.length > 0;

  async function onSubmitRefid() {
    if (!refidInput) {
      addAlert({
        text: "اگه کسی بهت سرور رو معرفی کرده می تونی کد دعوت شو ازش بگیری و اینجا وارد کنی تا بهش پوینت برسه",
        type: "info"
      }, 10);
      return;
    }

    const refid = parseInt(refidInput);
    if (refid == cldbid) {
      addAlert({
        text: "باو این کد خودته یعنی این کد رو باید دوستات بزنن تا به تو پوینت برسه، تو هم باید کد بقیه رو بزنی نه کد خودت 😐",
        type: "info"
      }, 10);
      return;
    }

    try {
      var response = await fetchWrapper("submit_refid", {
        method: "POST",
        data: { refid }
      });
    } catch (err: any) {
      addAlert({
        text: err,
        type: "danger"
      }, 15);
      return;
    }

    let data = await response.json();
    if (data["success"]) {
      let refName: string = data["name"];
      addAlert({
        text: `کد دعوت با موفقیت ثبت شد، همچنین به ${refName} هم بخاطر دعوتش پوینت رسید، خوشحال نشو به تو که چیزی نمی رسه، اون دعوتت کرده 😊 `,
        type: "success"
      }, 15);
      dispatch(clientInfo.actions.setRefid(refName));
    } else {
      const errors: Record<number, string> = {
        1: "کد کسی که وارد می کنید باید داخل سرور باشد",
        2: "به نظر هر دوتاتون یه نفر هستین، اگه اشتباهی شده با ادمین درمیون بزار",
        4: `${data["name"]} دیگه نمی تونه کسیو دعوت کنه، بسشه دیگه. کد یکی دیگه رو بزن`
      };
      let errorMsg = data["hint"] in errors ? errors[data["hint"]] : "مشکلی بوجود اومده لطفا صفحه را رفرش کنید!"; 

      addAlert({
        text: errorMsg,
        type: "danger"
      }, 10);
    }
  }

  return (
    <div id="refid" className="inner-box animate__animated animate__zoomIn animate__delay-2s">
      <div className="title">کد دعوت</div>
      <div id="refid-info" style={{flexGrow: 1}}>
      اگر کسی سرور رو بهت معرفی کرده می تونی کد دعوت اون رو وارد کنی، می تونی کد خودتم به بقیه بدی
      </div>
      <div style={{display: "flex", flexDirection: "column"}}>
        <div id="refid-cldbid">{cldbid}</div>
        <input onInput={(ev: ChangeEvent<HTMLInputElement>) => {
          let newRefid = ev.target.validity.valid ? ev.target.value : refidInput;
          setRefidInput(newRefid);
        }}
          pattern="[0-9]*" id="refid-refid" type="text" readOnly={hasRefid}
          value={hasRefid ? refid: refidInput} placeholder="کد دعوت را وارد کنید" />
        <button style={{marginTop: "20px"}} disabled={hasRefid} onClick={onSubmitRefid}>ثبت کد دعوت</button>
      </div>
    </div>
  );
}
