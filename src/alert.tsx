import { useSelector } from 'react-redux';
import { type RootReducer } from './redux/reducers';
import FlipMove from 'react-flip-move';

export default function Alert() {
  const alerts = useSelector((state: RootReducer) => state.alert);

  return (
    <div className="alert-container">
      <FlipMove className="alert" enterAnimation={{
        from: {
          opacity: "0.2",
          transform: "scale(0.2)",
        },
        to: {
          opacity: "1.0",
          transform: "scale(1.0)",
          transition: "all .8s"
        }
      }} leaveAnimation={{
        from: {
          opacity: "1.0",
          transform: "scale(1.0)"
        },
        to: {
          opacity: "0.2",
          transform: "scale(0.0)",
          transition: "all .5s"
        }
      }}>
        {alerts.map(alert => 
          <div key={alert.text} className={`alert-text alert-${alert.type} ${alert.extraClass || ""}`}>
            {alert.text}
          </div> 
        )}
      </FlipMove>
    </div>
  );
}