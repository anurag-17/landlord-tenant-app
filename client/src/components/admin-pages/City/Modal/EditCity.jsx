import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const EditCity = ({ EditId,preValue, closeModal, refreshdata,token,editData,states}) => {
    const [isLoading, setLoading] = useState(false);
    const [formdata, setFormData] = useState(editData);
  
    const [title, setTitle] = useState({
        id:EditId,title:preValue
    })

    const inputHandler = (e) => {
      console.log(e.target.value )
      setFormData({ ...formdata, [e.target.name]: e.target.value });
    };

    const handleEdit = (e) => {
    
        e.preventDefault();
        setLoading(true);
    
        const options = {
          method: "PUT",
          url: `/api/category/updateCategory`,
          data: title,
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        };
    
        axios
          .request(options)
          .then(function (res) {
            if (res.data?.success) {
              setLoading(false);
              toast.success("Updated successfully!");
              closeModal();
              refreshdata();
            } else {
              setLoading(false);
              toast.error("Failed. something went wrong!");
              return;
            }
          })
          .catch(function (error) {
            setLoading(false);
            console.error(error);
            toast.error("Server error!");
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
              name="cityName"
              placeholder="Add city name"
              required
              defaultValue={formdata.cityName}
              onChange={inputHandler}
              className="py-3 px-3 focus-visible:outline-none border border-[gray] my-3 rounded w-full"
            />
          </div>
          <div>
            {/* <label htmlFor="stateSelect">Select a state:</label> */}
            <select
              id="stateSelect"
              name="stateName"
              defaultValue={formdata.stateName}
              onChange={inputHandler}
              className="py-3 px-3 focus-visible:outline-none border border-[gray] my-3 rounded w-full bg:white"
            >
              <option value="" disabled>Select a state</option>
              {states.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

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
  )
}

export default EditCity
