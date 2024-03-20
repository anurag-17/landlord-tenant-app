import { useEffect } from "react";
import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { sideMenus } from "../config/data";
import { removeToken, setUserDetails } from "../redux/action/authAction";
import CloseIcon from "./admin-pages/Svg/CloseIcon";
import dash from '../assets/dashlogo.png';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [ComponentId, setComponentId] = useState(0);

  const [showDrawer, setShowDrawer] = useState(false);
  const { token } = useSelector((state) => state?.auth);
  const navigate = useNavigate();

  const handleClick = (id, url) => {
    setComponentId(id);
    setShowDrawer(false);
    navigate(url);
  };
  const handleSignout = async () => {
    try {
      const res = await axios.get(`/api/auth/logout`, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      console.log(res);
      if (res?.data?.success) {
        dispatch(removeToken());
        toast.success("Logout successfully !");
        navigate("/login");
      } else {
        // toast.error("Logout failed try again !");
        dispatch(removeToken());
        navigate("/login");
      }
    } catch (error) {
      // dispatch(removeToken());
      dispatch(removeToken());
      navigate("/login");
      console.error("Error occurred:", error);
      // toast.error(error?.response?.data?.message || "Invalid token !");
    }
  };

  return (
    <section className="max-h-[100vh] overflow-hidden">
      <div className="flex  relative lg:static">
        <div
          className="py-2 px-3  absolute top-4 left-2 flex flex-col gap-[5px] cursor-pointer lg:hidden"
          onClick={() => setShowDrawer(true)}
        >
          <div className="bg-black h-[2px] w-[20px]"></div>
          <div className="bg-black h-[2px] w-[20px]"></div>
          <div className="bg-black h-[2px] w-[20px]"></div>
        </div>

        <div
          className={` w-[300px] md:h-auto h-full z-[11] bg-theme-color text-white xl:py-[40px] xl:pt-[40px] xl:pb-[400px] px-[10px] py-[10px] transition-all duration-1000 delay-100 ease-linear
                 ${
                   showDrawer
                     ? "block  absolute top-0 left-0 min-h-screen is-show"
                     : "hidden lg:block"
                 }`}
        >
          <div
            className=" relative text-white  flex flex-col gap-[5px] cursor-pointer lg:hidden  text-right mr-3 mt-2"
            onClick={() => setShowDrawer(false)}
          >
            <div className="">
              {" "}
              <CloseIcon />{" "}
            </div>
          </div>
          <div className="">
            <div className="flex justify-center items-center">
             <img className="py-3 w-32 cursor-pointer"  src={dash} alt="dashboard logo"/>
            </div>
            <div className="bg-white h-[1px] w-[70%] mx-auto"></div>
            <div className="flex flex-col 2xl:gap-6 gap-5 pt-[60px]">
              {sideMenus.map((item, index) => (
                <div
                  key={index}
                  className={`justify-center py-3 mx-2 rounded-md  flex gap-x-3 items-center cursor-pointer  transition-colors medium-16 bg-[#0f2439] 
                                    ${
                                      item.id === ComponentId
                                        ? "bg-theme-secondary text-primary"
                                        : "hover:bg-theme-secondary hover:text-primary hover:rounded-md "
                                    }  `}
                  onClick={() => handleClick(item.id, item.url)}
                >
                  {/* {item?.icon} */}
                  <p className="j capitalize whitespace-nowrap ">{item.label}</p>
                </div>
              ))}
            </div>
          <div
            className={` py-3 mx-3  rounded justify-center text-center cursor-pointer my-5 flex items-center transition-colors dash-menu gap-x-3  medium-16 hover:bg-theme-secondary hover:text-primary hover:rounded-md  bg-[#0f2439] }`}
            onClick={handleSignout}
          >
            {/* <LogoutIcon /> */}
              <p className="">Sign Out</p>
            
          </div>
            {/* <div className="bg-white h-[1px] w-[70%] mx-auto mt-[100px]"></div> */}
          </div>

        </div>
        <div className="overflow-y-scroll h-[100vh] bg-[#f3f3f3] w-full">
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
