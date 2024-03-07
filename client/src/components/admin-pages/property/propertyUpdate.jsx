import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PropertyUpdate = ({
  propertyID,
  editData,
  closeDrawerO,
  refreshdata,
}) => {
  console.log(editData, "property");
  const [propertyDetail, setPropertyDetail] = useState(editData);
  const { token } = useSelector((state) => state?.auth);

  // const inputHandler = (e) => {
  //   setPropertyDetail({ ...propertyDetail, [e.target.name]: e.target.value });
  // };

  const inputHandler = (e) => {
    if (e.target.name === "category") {
      setPropertyDetail({
        ...propertyDetail,
        category: {
          ...propertyDetail.category,
          title: e.target.value,
        },
      });
    } else {
      setPropertyDetail({ ...propertyDetail, [e.target.name]: e.target.value });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/api/listing/property/${propertyID}`,
        propertyDetail,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        }
      );

      if (response.status === 200) {
        refreshdata();
        toast.success("Update successfully!");
        closeDrawerO();
      } else {
        console.log("Server error");
      }
    } catch (error) {
      console.log(error?.response?.data?.message || "Server error");
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center border border-[#f3f3f3] rounded-lg bg-white 2xl:px-5  2xl:h-[50px] 2xl:my-5 xl:px-4  xl:h-[40px] xl:my-4 lg:px-3  lg:h-[35px] lg:my-2 md:px-2  md:h-[30px] md:my-2 sm:px-1 sm:h-[25px] sm:my-2 px-1 h-[25px] my-2">
        <h2 className="custom_heading_text font-semibold">Property Update </h2>
      </div>
      <form
        onSubmit={handleUpdate}
        className="flex flex-wrap bg-white border rounded-lg 2xl:p-2 xl:p-2 lg:p-1 md:p-2 p-1 mx-auto"
      >
        {/* ------1.Property Name----- */}
        <div className="w-1/2">
          <label className="custom_input_label">Title</label>
          <input
            value={propertyDetail?.title || ""}
            maxLength={100}
            required
            type="text"
            name="title"
            className="custom_inputt"
            onChange={inputHandler}
          />
        </div>
        {/* ------2.  Category----- */}
        <div className="w-1/2">
          <label className="custom_input_label"> Category</label>
          <input
            value={propertyDetail?.category?.title || ""}
            type="text"
            name="category"
            className="custom_inputt"
            maxLength={200}
            onChange={inputHandler}
          />
        </div>
        {/* ------3. Property For----- */}
        <div className="w-1/2">
          <label className="custom_input_label"> For</label>
          <input
            value={propertyDetail?.listingType || ""}
            type="text"
            name="listingType"
            className="custom_inputt"
            required
            maxLength={64}
            onChange={inputHandler}
          />
        </div>
        {/* ------4.  City----- */}
        <div className="w-1/2">
          <label className="custom_input_label"> City</label>
          <input
            value={propertyDetail?.city || ""}
            type="text"
            name="city"
            className="custom_inputt"
            required
            onChange={inputHandler}
          />
        </div>
        {/* ------5.  Price----- */}
        <div className="w-1/2">
          <label className="custom_input_label"> Price</label>
          <input
            value={propertyDetail?.price || ""}
            type="number"
            name="price"
            className="custom_inputt"
            required
            onChange={inputHandler}
          />
        </div>
        <div className="w-1/2">
          <label className="custom_input_label"> BathRoom</label>
          <input
            value={propertyDetail?.BathRoom || ""}
            type="number"
            name="BathRoom"
            className="custom_inputt"
            required
            onChange={inputHandler}
          />
        </div>
        <div className="w-1/2">
          <label className="custom_input_label"> BedRoom</label>
          <input
            value={propertyDetail?.BedRoom || ""}
            type="number"
            name="BedRoom"
            className="custom_inputt"
            required
            onChange={inputHandler}
          />
        </div>
        <div className="w-1/2">
          <label className="custom_input_label"> Address</label>
          <input
            value={propertyDetail?.address || ""}
            type="text"
            name="address"
            className="custom_inputt"
            required
            onChange={inputHandler}
          />
        </div>
        <div className="w-1/2">
          <label className="custom_input_label"> Area</label>
          <input
            value={propertyDetail?.area || ""}
            type="text"
            name="area"
            className="custom_inputt"
            required
            onChange={inputHandler}
          />
        </div>
        <div className="w-1/2">
          <label className="custom_input_label"> Availability Date</label>
          <input
            value={propertyDetail?.availabilityDate || ""}
            type="text"
            name="availabilityDate"
            className="custom_inputt"
            required
            onChange={inputHandler}
          />
        </div>
        <div className="w-1/2">
          <label className="custom_input_label"> College Name</label>
          <input
            value={propertyDetail?.collegeName || ""}
            type="text"
            name="collegeName"
            className="custom_inputt"
            required
            onChange={inputHandler}
          />
        </div>
        <div className="w-1/2">
          <label className="custom_input_label">State</label>
          <input
            value={propertyDetail?.state || ""}
            type="text"
            name="state"
            className="custom_inputt"
            required
            onChange={inputHandler}
          />
        </div>
        <div className="w-1/2">
          <label className="custom_input_label"> Country</label>
          <input
            value={propertyDetail?.country || ""}
            type="text"
            name="country"
            className="custom_inputt"
            required
            onChange={inputHandler}
          />
        </div>
        <div className="w-1/2">
          <label className="custom_input_label"> Description</label>
          <input
            value={propertyDetail?.description || ""}
            type="text"
            name="description"
            className="custom_inputt"
            required
            onChange={inputHandler}
          />
        </div>
        <div className="w-1/2">
          <label className="custom_input_label"> Furnished Type</label>
          <input
            value={propertyDetail?.furnishedType || ""}
            type="text"
            name="furnishedType"
            className="custom_inputt"
            required
            onChange={inputHandler}
          />
        </div>
        {/* <div className="w-1/2">
          <label className="custom_input_label"> Location</label>
          <input
            value={propertyDetail?.location || ""}
            type="text"
            name="location"
            className="custom_inputt"
            required
            onChange={inputHandler}
          />
        </div> */}
        <div className="w-1/2">
          <label className="custom_input_label"> No Of Females</label>
          <input
            value={propertyDetail?.noOfFemales || ""}
            type="text"
            name="noOfFemales"
            className="custom_inputt"
            required
            onChange={inputHandler}
          />
        </div>
        <div className="w-1/2">
          <label className="custom_input_label"> No Of Males</label>
          <input
            value={propertyDetail?.noOfMales || ""}
            type="text"
            name="noOfMales"
            className="custom_inputt"
            required
            onChange={inputHandler}
          />
        </div>
        <div className="w-1/2">
          <label className="custom_input_label">City Pincode</label>
          <input
            value={propertyDetail?.pincode || ""}
            type="text"
            name="pincode"
            className="custom_inputt"
            required
            onChange={inputHandler}
          />
        </div>
        <div className="w-1/2">
          <label className="custom_input_label">Price Recur</label>
          <input
            value={propertyDetail?.priceRecur || ""}
            type="text"
            name="priceRecur"
            className="custom_inputt"
            required
            onChange={inputHandler}
          />
        </div>
        <div className="w-1/2">
          <label className="custom_input_label">Provinces</label>
          <input
            value={propertyDetail?.provinces || ""}
            type="text"
            name="provinces"
            className="custom_inputt"
            required
            onChange={inputHandler}
          />
        </div>
        <div className="w-full">
          <button type="submit" className="custom_btn">
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyUpdate;
