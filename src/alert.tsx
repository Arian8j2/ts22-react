import { useSelector } from 'react-redux';
import FlipMove from 'react-flip-move';

export default function Alert() {
  const alerts = useSelector((state: RootReducer) => state.alerts);

  return (
    <div className="alert-container">
      <FlipMove className="alert" enterAnimation={{
        from: {
          opacity: ".2",
          transform: "scale(.2)",
        },
        to: {
          opacity: "1",
          transform: "scale(1)",
          transition: "all .8s"
        }
      }} leaveAnimation={{
        from: { },
        to: {
          opacity: ".2",
          transform: "scale(.5)",
        }
      }}>
        {alerts.map(alert => 
          <div key={alert.text} className={`alert-text alert-${alert.type} ${alert.extraClass || ""}`}>
            {alert.text}
          </div>          
        )}
      </FlipMove>
    </div>
  )
}