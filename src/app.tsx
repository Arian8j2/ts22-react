import { useSelector } from 'react-redux';
import { type RootReducer } from './redux/reducers';

import Login from './login';
import Content from './content';

import 'animate.css';
import './index.scss';
import './fonts/fonts.scss';

export default function App() {
  const isLoggedIn = useSelector((state: RootReducer) => state.clientInfo.isLoggedIn);

  if (isLoggedIn)
    return <Content />
  else
    return <Login />
};