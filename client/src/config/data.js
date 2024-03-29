import Category from "../components/admin-pages/Category/Category";
import City from "../components/admin-pages/City/City";
import College from "../components/admin-pages/College/College";
import Dashboard from "../components/admin-pages/Dashboard";
import Prefernce from "../components/admin-pages/Preference/Prefernce";
import State from "../components/admin-pages/State/State";
import Property from "../components/admin-pages/property/Property";
import Report from "../components/admin-pages/report/Report";
import User from "../components/admin-pages/user/User";
// import HomeIcon from "../assets/home.svg"

export const sideMenus = [
  {
    id: 0,
    label: "Dashboard",
    component: <Dashboard />,
    url: "/",
    icon: "../assets/home.svg",
  },
  {
    id: 1,
    label: "User list",
    component: <User />,
    url: "/",
  },
  {
    id: 2,
    label: "Property list",
    component: <Property />,
  },
  {
    id: 4,
    label: "Property Category",
    component: <Category />,
  },
  {
    id: 5,
    label: "Preference",
    component: <Prefernce />,
  },
  {
    id: 6,
    label: "State",
    component: <State />,
  },
  {
    id: 7,
    label: "City",
    component: <City />,
  },
  {
    id: 8,
    label: "College",
    component: <College />,
  },
];
