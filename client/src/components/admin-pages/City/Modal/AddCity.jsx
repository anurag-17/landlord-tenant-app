import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const AddCity = ({ closeModal, refreshData, token,states }) => {
  console.log(states)
  const [formdata, setFormData] = useState({
    name: "",
    stateId: "",
  });
// const states = ["MP","UP","HP"]
  const [isLoading, setLoading] = useState(false);

  const inputHandler = (e) => {
    // console.log(e.target.value )
    setFormData({ ...formdata, [e.target.name]: e.target.value });
  };

  const addHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(
        "/api/city/add",
        formdata,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data?.success) {
          setLoading(false);
          toast.success("Added successfully!");
          closeModal();
          refreshData();
        } else {
          setLoading(false);
          toast.error("Failed. something went wrong!");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        toast.error("Server error!");
        setFormData({
          cityName: "",
          stateName: "",
        })
      });
  };
  return (
    <>
      <div className="mt-1">
        <p className=" xl:text-[20px] text-[18px] font-medium leading-6 text-gray-900">
          Add new city
        </p>
      </div>

      <div className="my-2">
        <form action="" onSubmit={addHandler}>
          <div>
            <input
              type="text"
              name="name"
              placeholder="Add city name"
              required
              onChange={inputHandler}
              value={formdata?.name}
              className="py-3 px-3 focus-visible:outline-none border border-[gray] my-3 rounded w-full"
            />
          </div>
          <div>
            {/* <label htmlFor="stateSelect">Select a state:</label> */}
            <select
              id="stateSelect"
              name="stateId"
              value={formdata?.stateId}
              required
              onChange={inputHandler}
              className="py-3 px-3 focus-visible:outline-none border border-[gray] my-3 rounded w-full bg:white"
            >
              <option value="" >Select a state</option>
              {states.map((state, index) => (
                <option key={index} value={state?._id}>
                  {state?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex md:flex-row flex-col gap-3 mt-4 mb-2 justify-between gap-x-5">
            <button
              type="button"
              className="w-full secondary_btn"
              onClick={() => closeModal()}
            >
              Cancel
            </button>

            <button
              className={`w-full  delete_btn
              ${isLoading ? "text-[gray]" : "text-[red] hover:bg-[#efb3b38a]"}`}
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "Loading..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCity;
