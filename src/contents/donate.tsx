import { useDispatch } from 'react-redux';
import { addAlert } from '../redux/reducers';

function Donate(): JSX.Element{
  const dispatch = useDispatch();

  return (
    <div id="donate">
      <div id="donate-donate" className="inner-box">
        a
      </div>
      <div id="donate-price" className="inner-box">
        b
      </div>
      <div id="donate-donators" className="inner-box">
        c
      </div>
    </div>
  )
}

export default Donate;