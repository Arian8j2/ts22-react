import { useSelector } from "react-redux";
import { type RootReducer } from "../../redux/reducers";
import { formatNetUsage, formatConnTime } from "../../utils";

export default function Summary() {
  const { netUsage, connTime } = useSelector((state: RootReducer) => state.clientInfo);

  const [netUsageValue, netUsageSign] = formatNetUsage(netUsage).split(" ");
  const formatedConnTime = formatConnTime(connTime);

  return (
    <div id="info" className="inner-box animate__animated animate__zoomIn animate__delay-1s">
      <div className="title">اطلاعات این ماه</div>
      <div id="info-content">
        <div className="info-sec">
          <div className="inf">اینترنت مصرف شده</div>
          <div className="val">
            <span style={{marginRight: netUsageSign.length ? "3px": "0px"}}>
              {netUsageValue}
            </span>
            <span className="sign">{netUsageSign}</span>
          </div>
        </div>
        <div className="info-sec">
          <div className="inf">تایم آنلاینی</div>
          <div className="val">{formatedConnTime}</div>
        </div>
      </div>
    </div>
  );
}