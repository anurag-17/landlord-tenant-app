import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
const Chat = () => {
  const [propertyId, setPropertyId] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
//   const socket = io("http://http://localhost:4000");
  useEffect(() => {
    // Establish the socket connection when the component mounts
    const socket = io("http://localhost:4000");
  
    // Log a message when the connection is established
    socket.on("connect", () => {
      console.log("Connected to server");
    });
    
    // Remember to return a cleanup function to close the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);
  

  return (
    <>
      <section>
        <div className=" h-screen flex justify-center items-center">
          <form className="border border-black rounded-md p-5 ">
            <h1 className="text-[25px] font-semibold text-center mb-5">
              Chat-Box
            </h1>
            <div className="flex  gap-5">
              <div>
                <input
                  type="text"
                  className=" border border-black rounded-md p-1 outline-none"
                  placeholder="property id"
                  onChange={(e) => {
                    setPropertyId(e.target.value);
                  }}
                />
              </div>
              <div>
                <input
                  type="text"
                  className=" border border-black rounded-md p-1 outline-none"
                  placeholder="token"
                  onChange={(e) => {
                    setToken(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="mt-5">
              <textarea
                className="border border-black rounded-md p-1 outline-none w-full"
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Chat;
