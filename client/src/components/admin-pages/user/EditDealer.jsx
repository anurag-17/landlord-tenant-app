import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditDealer = ({ closeEditModal, refreshData, editData, token }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresh, setRefresh] = useState(false);
  const [allData, setAllData] = useState([]);
  const userId = editData._id;
  const [userDetail, setProductDetail] = useState(editData);
  //   console.log(editData, "aaa");

  const inputHandler = (e) => {
    // console.log(e.target.value);
    if (e.target.name === "preference") {
      const newArray = userDetail?.preference;
      newArray?.push(e.target.value)
      setProductDetail((prev) => ({ ...prev, preference: newArray }));
    } else {
      setProductDetail({ ...userDetail, [e.target.name]: e.target.value });
    }
  };
  //   const refreshData = () => {
  //     setRefresh(!isRefresh);
  //   };

  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = (pageNo) => {
    // setIsLoader(true);
    const options = {
      method: "GET",
      url: `/api/preference/getAllPreference`,
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    };
    axios
      .request(options)
      .then((res) => {
        console.log(res);
        if (res?.data?.preferences) {
          //   setIsLoader(false);
          //   console.log(res?.data);
          setAllData(res?.data?.preferences);
        } else {
          //   setIsLoader(false);
          return;
        }
      })
      .catch((error) => {
        // setIsLoader(false);
        console.error("Error:", error);
      });
  };

  const handleEditUser = async (e) => {
    e.preventDefault();

    const updatedUserDetail = {
      ...userDetail,
      _id: editData?._id,
    };

    try {
      const response = await axios.put(
        `/api/auth/edit-user/${userId}`,
        updatedUserDetail,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        }
      );

      if (response.status === 200) {
        refreshData();
        toast.success("Update successfully!");
        closeEditModal();
        getAllData();
      } else {
        console.log("Server error");
      }
    } catch (error) {
      console.log(error?.response?.data?.message || "Server error");
    }
  };
  const handleRemoveItem = (id) => {
    // setProductDetail((prevProductDetail) => {
    //   const updatedPreference = [...prevProductDetail.preference];
    //   updatedPreference.splice(index, 1);

    //   // Return a new object to trigger React state update
    //   return {
    //     ...prevProductDetail,
    //     preference: updatedPreference,
    //   };
    // });
    if (
      Array.isArray(userDetail.preference) &&
      userDetail.preference.length > 0
    ) {
      const newArray = userDetail.preference.filter((items, index) => {
        return items !== id;
      });
      setProductDetail((prev) => ({ ...prev, preference: newArray }));

      console.log(newArray);
    }
  };

  return (
    <>
      <ToastContainer autoClose={1000} />
      <div className="flex justify-center mb-2">
        <h2 className="custom_heading_text font-semibold text-[24px]">
          Edit User Details
        </h2>
      </div>
      <div>
        <form
          onSubmit={handleEditUser}
          className=" bg-white border  rounded-lg 2xl:p-2 xl:p-2  lg:p-1 md:p-2 p-1  mx-auto"
        >
          <div className="flex ">
            <div className="mt-2">
              <label className="custom_input_label">Name</label>
              <input
                defaultValue={
                  editData?.fullname ? editData?.fullname : userDetail?.fullname
                }
                onChange={inputHandler}
                type="text"
                name="fullname"
                className="custom_inputt capitalize"
                required
                maxLength={84}
              />
            </div>
            <div className="mt-2">
              <label className="custom_input_label">Email</label>
              <input
                defaultValue={
                  editData?.email ? editData?.email : userDetail?.email
                }
                onChange={inputHandler}
                type="text"
                name="email"
                className="custom_inputt capitalize"
                required
                maxLength={84}
              />
            </div>
          </div>

          <div className="flex ">
            <div className="mt-2">
              <label className="custom_input_label">Mobile No.</label>
              <input
                defaultValue={
                  editData?.mobile ? editData?.mobile : userDetail?.mobile
                }
                onChange={inputHandler}
                type="text"
                name="mobile"
                className="custom_inputt capitalize"
                required
                maxLength={84}
              />
            </div>
            <div className="mt-2">
              <label className="custom_input_label">college Name</label>
              <input
                defaultValue={
                  editData?.collegeName
                    ? editData?.collegeName
                    : userDetail?.collegeName
                }
                onChange={inputHandler}
                type="text"
                name="collegeName"
                className="custom_inputt capitalize"
                required
                maxLength={84}
              />
            </div>
          
          </div>
          <div className="flex ">
           
            <div className="mt-2">
              <label className="custom_input_label">Age</label>
              <input
                defaultValue={editData?.age ? editData?.age : userDetail?.age}
                onChange={inputHandler}
                type="text"
                name="age"
                className="custom_inputt capitalize"
                required
                maxLength={84}
              />
            </div>
            <div className="mt-2">
              <label className="custom_input_label">University</label>
              <input
                defaultValue={
                  editData?.university
                    ? editData?.university
                    : userDetail?.university
                }
                onChange={inputHandler}
                type="text"
                name="university"
                className="custom_inputt capitalize"
                required
                maxLength={84}
              />
            </div>
          
          </div>
      
          <div className="flex ">
         
            <div className="mt-2">
              <label className="custom_input_label">Country</label>
              <input
                defaultValue={
                  editData?.country ? editData?.country : userDetail?.country
                }
                onChange={inputHandler}
                type="text"
                name="country"
                className="custom_inputt capitalize"
                required
                maxLength={84}
              />
            </div>
            <div className="mt-2">
              <label className="custom_input_label">City</label>
              <input
                defaultValue={
                  editData?.city ? editData?.city : userDetail?.city
                }
                onChange={inputHandler}
                type="text"
                name="city"
                className="custom_inputt capitalize"
                required
                maxLength={84}
              />
            </div>
          </div>
          <div className="flex ">
         
            <div className="mt-2">
              <label className="custom_input_label">Spoken Language</label>
              <input
                defaultValue={
                  editData?.spokenLanguage
                    ? editData?.spokenLanguage
                    : userDetail?.spokenLanguage
                }
                onChange={inputHandler}
                type="text"
                name="spokenLanguage"
                className="custom_inputt capitalize"
                required
                maxLength={84}
              />
            </div>
            <div className="mt-2">
              <label className="custom_input_label">Gender</label>
              <input
                defaultValue={
                  editData?.gender ? editData?.gender : userDetail?.gender
                }
                onChange={inputHandler}
                type="text"
                name="gender"
                className="custom_inputt capitalize"
                required
                maxLength={84}
              />
            </div>
          </div>
          <div className="flex ">
       
            <div className="mt-2">
              <label className="custom_input_label">Preference</label>
              <select
                // value={selectedPreference}
                onChange={inputHandler}
                name="preference"
                className="custom_inputt capitalize"
                // required
              >
                <option value="">Select Preference</option>
                {allData?.map((pref, inde) => {
                  console.log(pref);
                  return (
                    <option key={pref._id} value={pref._id}>
                      {pref.preference}
                    </option>
                  );
                })}
              </select>
              {Array.isArray(userDetail?.preference) &&
                userDetail?.preference?.map((pref, index) => {
                  return allData.map((matchingPreference, indexr) => {
                    if (matchingPreference._id === pref) {
                      return (
                        <div className="ml-5" key={`${matchingPreference._id}-${index}`}>
                          {matchingPreference.preference}
                          <button className="ml-2"
                            onClick={() =>
                              handleRemoveItem(matchingPreference._id)
                            }
                            type="button"
                          >
                            X
                          </button>
                        </div>
                      );
                    }
                    return null;
                  });
                })}
            </div>
            {/* <div className="mt-2">
              <label className="custom_input_label">Spoken Language</label>
              <input
                defaultValue={
                  editData?.spokenLanguage ? editData?.spokenLanguage : userDetail?.spokenLanguage
                }
                onChange={inputHandler}
                type="text"
                name="spokenLanguage"
                className="custom_inputt capitalize"
                required
                maxLength={84}
              />
            </div> */}
          </div>

          <div className="flex justify-center">
            <button type="submit" disabled={isLoading} className="custom_btn">
              {isLoading ? "Loading." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditDealer;
