import { NavLink } from 'react-router-dom';
import Pic from './images/profile.svg';

import Dashboard from './contents/dashboard';
import Rank from './contents/rank';
import Donate from './contents/donate';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faGamepad, faHeart, IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface NavInfo {
  url: string,
  name: string,
  icon: IconDefinition,
  component: () => JSX.Element,
  isDefault?: boolean
}

const navInfo: NavInfo[] = [
  {
    url: "/dashboard",
    name: "داشبورد",
    icon: faUser,
    component: Dashboard,
    isDefault: true
  },
  {
    url: "/rank",
    name: "رنک",
    icon: faGamepad,
    component: Rank
  },
  {
    url: "/donate",
    name: "حمایت",
    icon: faHeart,
    component: Donate
  }
];

function Sidebar(props: { isMobile: boolean }): JSX.Element {
  if(props.isMobile){
    return (
      <div id="bottom-navbar">
        {navInfo.map((val) => {
          return (
            <NavLink key={val.url} to={val.url} exact activeClassName="active" className="bottom-navbar-nav">
              <FontAwesomeIcon icon={val.icon} />
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
            return <NavLink key={val.url} to={val.url} exact activeClassName="active">{val.name}</NavLink>  
          })}
        </div>
      </div>
    );
}

export default Sidebar;
export { navInfo };