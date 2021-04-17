import { useMediaQuery } from 'react-responsive';
import { NavLink } from 'react-router-dom';
import Pic from './images/profile.svg';

const navInfo: {url: string, name: string, icon: JSX.Element}[] = [
  {
    url: "/dashboard",
    name: "داشبورد",
    icon: (<i className="fas fa-user"></i>)
  },
  {
    url: "/rank",
    name: "رنک",
    icon: (<i className="fas fa-user"></i>)
  },
  {
    url: "/donate",
    name: "حمایت",
    icon: (<i className="fas fa-user"></i>)
  }
];

function Sidebar(): JSX.Element {
  const isMobile = useMediaQuery({query: "(max-width: 600px)"});
  
  if(isMobile){
    return (
      <div id="bottom-navbar">
        {navInfo.map((val) => {
          return (
            <NavLink to={val.url} exact activeClassName="active" className="bottom-navbar-nav">
              {val.icon}
              <span className="bottom-navbar-text">{val.name}</span>
            </NavLink>
          )
        })}
      </div>
    );
  } else
    return (
      <div id="sidebar">
        <div id="sidebar-img-wrapper">
          <img id="sidebar-img" src={Pic} alt="profile" />
        </div>

        <div id="sidebar-content">
          {navInfo.map((val) => {
            return <NavLink to={val.url} exact activeClassName="active">{val.name}</NavLink>  
          })}
        </div>
      </div>
    );
}

export default Sidebar;