import axios from "axios";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

const Template = () => {
  const [email, setEmail] = useState("");

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `/api/auth/deleteUser_by_email/${email}`
      );
      if (response.status >= 200 && response.status < 300) {
        alert("success");
      } else {
        alert("failed");
      }
    } catch (error) {
      alert(error?.response?.data?.message || "server error");
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div>
      <div className="container flex justify-center items-center h-screen">
        <form id="deleteUserForm" className=" w-1/3  h-[250px] border p-5 rounded-xl">
       <div className="flex justify-center font-semibold text-[25px]">
       <h1>Delete User</h1>
       </div>
        <div className="my-3">
        <label htmlFor="email">Email:</label>
          <br />
          <input
            type="email"
            id="email"
            name="email"
            required=""
            className="border p-2 rounded-lg"
            value={email}
            onChange={handleChange}
          />
        </div>
        
        <div  className=" flex justify-center my-10 ">
        <button
            onClick={handleDelete}
            type="button"
            className="border text-[15px] p-1 text-white bg-black  rounded-md"
          >
            {" "}
            Delete User
          </button>
        </div>
        </form>
        <div id="response" />
      </div>
    </div>
  );
};

export default Template;
