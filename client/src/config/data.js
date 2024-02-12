import Dashboard from "../components/admin-pages/Dashboard";
import User from "../components/admin-pages/user/User";

export const sideMenus = [
  {
    id: 0,
    label: "Dashboard",
    component : <Dashboard />,
    url: "/",
    // icon: <DashboardIcon />,
  },
  {
    id: 1,
    label: "User list",
    component : <User />,
    url: "/",
    // // icon: <UserIcon />,
  },
  {
    id: 2,
    label: "Property list",
    url: "/",
    // // icon: <CategoryIcon />,
  },
  // {
  //   id: 3,
  //   label: "Feedback",
  //   url: "/",
  //   icon: <Feedbackicon />,
  // },
];
