import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const EditState = ({
  EditId,
  preValue,
  closeModal,
  refreshData,
  token,
  editData,
  states,
}) => {
  const [isLoading, setLoading] = useState(false);
  const [formdata, setFormData] = useState(editData);
  console.log(formdata);
  console.log(states);

  const [title, setTitle] = useState({
    id: EditId,
    title: preValue,
  });

  const inputHandler = (e) => {
    console.log(e.target.value);
    setFormData({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(formdata);

    axios
      .put(`/api/state/update/${formdata?._id}`, formdata, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      })
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
        });
      });
  };
  return (
    <>
      <div className="mt-1">
        <p className=" text-[16px] font-normal leading-[30px] text-gray-500 mt-4"></p>
      </div>

      <div className="mt-2">
        <form action="" onSubmit={handleEdit}>
          <div>
            <input
              type="text"
              name="name"
              placeholder="Add state name"
              required
              value={formdata?.name}
              onChange={inputHandler}
              className="py-3 px-3 focus-visible:outline-none border border-[gray] my-3 rounded w-full"
            />
          </div>
          {/* <div>
            <select
              id="stateSelect"
              name="stateId"
              value={formdata?.stateId}
              onChange={inputHandler}
              className="py-3 px-3 focus-visible:outline-none border border-[gray] my-3 rounded w-full bg:white"
            >
              <option value="" disabled>
                Select a state
              </option>
              {states.map((state, index) => (
                <option key={index} value={state?._id}>
                  {state?.name}
                </option>
              ))}
            </select>
          </div> */}

          <div className="flex md:flex-row flex-col gap-3 justify-between gap-x-5">
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

export default EditState;
