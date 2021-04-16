import { NavLink  } from 'react-router-dom';
import Pic from './images/profile.svg';

// import { useState } from 'react';
// import BottomNavigation from '@material-ui/core/BottomNavigation';
// import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
// import RestoreIcon from '@material-ui/icons/Restore';
// import FavoriteIcon from '@material-ui/icons/Favorite';
// import LocationOnIcon from '@material-ui/icons/LocationOn';

// const [value, setValue] = useState(0);
// return (
//   <BottomNavigation
//     value={value}
//     onChange={(event, newValue) => {
//       setValue(newValue);
//     }}
//     showLabels
//     style={{
//       position: "absolute",
//       bottom: 0,
//       width: "100%",
//       zIndex: 1
//     }}
//   >
//     <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
//     <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
//     <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
//   </BottomNavigation>
// )

function Sidebar(): JSX.Element {
  return (
    <div id="sidebar">
      <div id="sidebar-img-wrapper">
        <img id="sidebar-img" src={Pic} alt="profile" />
      </div>

      <div id="sidebar-content">
        <NavLink to="/dashboard" exact activeClassName="active">داشبورد</NavLink>
        <NavLink to="/rank" exact activeClassName="active">رنک</NavLink>
        <NavLink to="/donate" exact activeClassName="active">حمایت</NavLink>
      </div>
    </div>
  )
}

export default Sidebar;