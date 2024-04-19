// import React, { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// const Chat = () => {
//   const [propertyId, setPropertyId] = useState("");
//   const [message, setMessage] = useState("");
//   const [token, setToken] = useState("");
// //   const socket = io("http://http://localhost:4000");
//   useEffect(() => {
//     // Establish the socket connection when the component mounts
//     const socket = io("http://localhost:4000");

//     // Log a message when the connection is established
//     socket.on("connect", () => {
//       console.log("Connected to server");
//     });

//     // Remember to return a cleanup function to close the socket connection when the component unmounts
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <>
//       <section>
//         <div className=" h-screen flex justify-center items-center">
//           <form className="border border-black rounded-md p-5 ">
//             <h1 className="text-[25px] font-semibold text-center mb-5">
//               Chat-Box
//             </h1>
//             <div className="flex  gap-5">
//               <div>
//                 <input
//                   type="text"
//                   className=" border border-black rounded-md p-1 outline-none"
//                   placeholder="property id"
//                   onChange={(e) => {
//                     setPropertyId(e.target.value);
//                   }}
//                 />
//               </div>
//               <div>
//                 <input
//                   type="text"
//                   className=" border border-black rounded-md p-1 outline-none"
//                   placeholder="token"
//                   onChange={(e) => {
//                     setToken(e.target.value);
//                   }}
//                 />
//               </div>
//             </div>
//             <div className="mt-5">
//               <textarea
//                 className="border border-black rounded-md p-1 outline-none w-full"
//                 onChange={(e) => {
//                   setMessage(e.target.value);
//                 }}
//               />
//             </div>
//           </form>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Chat;

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
const Chat = () => {
  const [propertyId, setPropertyId] = useState("");
  const [message, setMessages] = useState("");
  const [token, setToken] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [userId, setUserId] = useState("");
  //   const socket = io("http://http://localhost:4000");
  useEffect(() => {
    const socket = io("http://3.21.216.227:4000", {
      query: { userId, propertyId },
    });

    socket.on("newMessage", (newMessage) => {
      setMessages((msgs) => [...msgs, newMessage]);
      console.log(newMessage);
    });
    socket.on("sentMessage", (newMessage) => {
      setMessages((msgs) => [...msgs, newMessage]);
      console.log("sent",newMessage);
    });


    socket.on("getOnlineUsers", (users) => {
      console.log("Online Users:", users);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, propertyId]);

  const sendHandler = async (e) => {
    e.preventDefault();
    await axios
      .post(
        `http://localhost:4000/api/message/send-message/${receiverId}`,
        {
          propertyId,
          message,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <section>
        <div className=" h-screen flex justify-center items-center">
          <form
            className="border border-black rounded-md p-5 "
            onSubmit={sendHandler}
          >
            <h1 className="text-[25px] font-semibold text-center mb-5">
              Chat-Box
            </h1>
            <div>
              <input
                type="text"
                className=" border border-black rounded-md p-1 outline-none"
                placeholder="user id"
                onChange={(e) => {
                  setUserId(e.target.value);
                }}
              />
            </div>

            <div>
              <input
                type="text"
                className=" border border-black rounded-md p-1 outline-none"
                placeholder="reciever id"
                onChange={(e) => {
                  setReceiverId(e.target.value);
                }}
              />
            </div>
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
                  setMessages(e.target.value);
                }}
              />
            </div>
            <input type="submit" value={`submit`} />
          </form>
        </div>
      </section>
    </>
  );
};

export default Chat;
