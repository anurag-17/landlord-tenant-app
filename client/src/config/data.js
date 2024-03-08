import Category from "../components/admin-pages/Category/Category";
import Dashboard from "../components/admin-pages/Dashboard";
import Prefernce from "../components/admin-pages/Preference/Prefernce";
import Property from "../components/admin-pages/property/Property";
import Report from "../components/admin-pages/report/Report";
import User from "../components/admin-pages/user/User";
// import HomeIcon from "../assets/home.svg"

export const sideMenus = [
  {
    id: 0,
    label: "Dashboard",
    component : <Dashboard />,
    url: "/",
   icon:'../assets/home.svg',
  },
  {
    id: 1,
    label: "User list",
    component : <User />,
    url: "/",
  },
  {
    id: 2,
    label: "Property list",
    component : <Property />,
  },
  {
    id: 4,
    label: "Property Category",
    component : <Category />,
  },
  {
    id: 5,
    label: "Preference",
    component : <Prefernce />,
  },
];
