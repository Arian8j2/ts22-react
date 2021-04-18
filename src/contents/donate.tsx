import { useDispatch } from 'react-redux';
import { addAlert } from '../redux/reducers';

function Donate(): JSX.Element{
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => {dispatch(addAlert({
        text: "کار شما با موفقیت انجام شد",
        durationSecond: 5,
        type: "success"
      }))}}>add new alert</button>
      <button onClick={() => {dispatch(addAlert({
        text: "ziadd",
        durationSecond: 10,
        type: "success"
      }))}}>add new ziadd</button>
    </div>
  )
}

export default Donate;