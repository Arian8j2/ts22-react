import { useSelector } from 'react-redux';

import Login from './login';
import Content from './content';

import 'animate.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

function App(){
  const isLogin = useSelector((state) => (state as RootReducer).isLogin);

  if(isLogin)
    return <Content />
  else
    return <Login />
};

export default App;