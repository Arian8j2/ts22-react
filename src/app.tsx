import { useSelector } from 'react-redux';

import Login from './login';
import Content from './content';

import 'animate.css';

function App(){
  const isLogin = useSelector((state) => (state as RootReducer).isLogin);

  if(isLogin)
    return <Content />
  else
    return <Login />
};

export default App;