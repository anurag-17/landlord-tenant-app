import { useEffect } from "react";
import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { sideMenus } from "../config/data";

const AdminDashboard = () => {
  const [ComponentId, setComponentId] = useState(0);

  const [showDrawer, setShowDrawer] = useState(false);
  const navigate = useNavigate();

  const handleClick = (id, url) => {
    setComponentId(id);
    setShowDrawer(false);
    navigate(url);
  };
  const handleSignout = () => {
    sessionStorage.removeItem("sessionToken");
    navigate("/");
  };

  // const verify = async () => {
  //   try {
  //     const res = await axios.get(`/api/auth/verifyToken/${token}`);
  //     //   console.log(res);
  //     if (res.status === 200) {
  //       return; // Do whatever you need after successful verification
  //     } else {
  //       navigate("/");
  //     }
  //   } catch (error) {
  //     console.error("Error occurred:", error);
  //     toast.error("Something went wrong.");
  //     navigate("/");
  //     // Handle the error, maybe navigate somewhere or show an error message
  //   }
  // };
  
  useEffect(() => {
    // if (token) {
    //     verify()
    // }
    // else {
    //     navigate("/")
    // }
  }, []);
  
  return (
    <section className="">
      <div className="flex min-h-screen relative lg:static">
        <div
          className="py-2 px-3  absolute top-4 left-2 flex flex-col gap-[5px] cursor-pointer lg:hidden"
          onClick={() => setShowDrawer(true)}
        >
          <div className="bg-black h-[2px] w-[20px]"></div>
          <div className="bg-black h-[2px] w-[20px]"></div>
          <div className="bg-black h-[2px] w-[20px]"></div>
        </div>

        <div
          className={`w-[300px] bg-theme-color text-white lg:py-[40px] lg:px-[40px] px-[10px] py-[10px] drawer
                 ${
                   showDrawer
                     ? "block  absolute top-0 left-0 min-h-screen is-show"
                     : "hidden lg:block"
                 }`}
        >
          <div
            className="relative text-white  flex flex-col gap-[5px] cursor-pointer lg:hidden  text-right mr-3 mt-2"
            onClick={() => setShowDrawer(false)}
          >
            {/* <div className=""> <CloseIcon /> </div> */}
          </div>
          <div className="">
            <div className="flex justify-center items-center whitespace-pre-wrap py-[20px]">
              <h1 className="bold-32 text-center whitespace-nowrap">
                Admin Dashboard
              </h1>
            </div>
            <div className="bg-white h-[1px] w-[70%] mx-auto"></div>
            <div className="flex flex-col 2xl:gap-6 gap-3 pt-[60px]">
              {sideMenus.map((item, index) => (
                <div
                  key={index}
                  className={`pl-6 py-3 mx-5 rounded-md  flex gap-x-3 items-center cursor-pointer  transition-colors medium-16 
                                    ${
                                      item.id === ComponentId
                                        ? "bg-theme-secondary text-primary"
                                        : "hover:bg-theme-secondary hover:text-primary hover:rounded-md"
                                    }  `}
                  onClick={() => handleClick(item.id, item.url)}
                >
                  {item?.icon}
                  <p className=" capitalize whitespace-nowrap ">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-white h-[1px] w-[70%] mx-auto mt-[100px]"></div>
          </div>

          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer my-3 flex items-center transition-colors dash-menu gap-x-3  medium-16 hover:bg-theme-secondary hover:text-primary hover:rounded-md }`}
            onClick={handleSignout}
          >
            {/* <LogoutIcon /> */}
            <div>
              <p>Sign Out</p>
            </div>
          </div>
        </div>
        <div className=" bg-[#f3f3f3] w-full  ">
          {sideMenus.map((item, index) => (
            <Fragment key={index}>
              {ComponentId === item.id && item.component}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
