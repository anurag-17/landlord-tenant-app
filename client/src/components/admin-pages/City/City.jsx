import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Switch } from "@headlessui/react";

// import DeleteUser from "./DeleteUser";
import CloseIcon from "../Svg/CloseIcon";
import Pagination from "../../pagination/Pagination";
import Loader from "../../loader/Index";
import { ToastContainer, toast } from "react-toastify";
import AddCity from "./Modal/AddCity";
import EditCity from "./Modal/EditCity";

export const headItems = [
  "S. No.",
  "Name",
  //   " Contact No",
  //   "Email",
  //   "Block user",
  "Action",
];

const City = () => {
  const [isRefresh, setRefresh] = useState(false);
  const [allData, setAllData] = useState([]);
  const [states, setStates] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [Id, setId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState([]);
  const [isDrawerOpenO, setIsDrawerOpenO] = useState(false);
  const visiblePageCount = 10;
  const { token } = useSelector((state) => state?.auth);

  // console.log(previewData);
  const refreshdata = () => {
    setRefresh(!isRefresh);
  };

  const closeAddModal = () => {
    setOpenAdd(false);
  };

  // delete func ----
  const handleDelete = (del_id) => {
    setId(del_id);
    setOpenDelete(true);
  };

  const closeDeleteModal = () => {
    setOpenDelete(false);
  };

  // handle search ----
  const handleSearchInput = (e) => {
    setSearchText(e.target.value);
    searchDataFunc(e.target.value);
  };

  const handleSearch = () => {
    if (searchText) {
      searchDataFunc(searchText.trim());
    }
  };
  const handleKeyDown = (e) => {
    console.log("Pressed key:", e.key);
    if (e.key === "Backspace") {
      // e.preventDefault(); // Prevent the default action
      searchDataFunc(searchText);
    }
  };
  const handleClearSearch = () => {
    refreshdata();
    setSearchText("");
  };
  const searchDataFunc = (search_cate) => {
    const options = {
      method: "GET",
      url: `/api/city/getAll?search=${search_cate}`,
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response?.data);
        if (response.status === 200) {
          setAllData(response?.data);
        } else {
          return;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // edit modal ----
  const handleEdit = async (prev_id) => {
    setEditData(allData);
    setEditOpen(true);
    return;
    setIsLoader(true);
    try {
      const res = await axios.get(`/api/city/getCityById/${prev_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (res.data?.success) {
        // console.log(res.data.user);
        setEditData(res.data?.city);
        setEditOpen(true);
        setIsLoader(false);
      } else {
        setIsLoader(false);
        return;
      }
    } catch (error) {
      setIsLoader(false);
      console.error(error);
    }
  };

  const closeEditModal = () => {
    setEditOpen(false);
  };

  // get all data ----
  const getAllData = (pageNo) => {
    setIsLoader(true);
    const options = {
      method: "GET",
      url: `/api/city/getAll?page=${pageNo}&limit=${visiblePageCount}`,
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    };
    axios
      .request(options)
      .then((res) => {
        console.log(res);
        if (res?.data?.success) {
          setIsLoader(false);
          setAllData(res?.data?.data);
        } else {
          setIsLoader(false);
          return;
        }
      })
      .catch((error) => {
        setIsLoader(false);
        console.error("Error:", error);
      });
  };

  // get all data ----
  const getAllStates = (pageNo) => {
    setIsLoader(true);
    const options = {
      method: "GET",
      url: `/api/state/getAll`,
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    };
    axios
      .request(options)
      .then((res) => {
        console.log("state", res);
        // return;
        if (res?.data?.success) {
          setIsLoader(false);
          setStates(res?.data?.states);
        } else {
          setIsLoader(false);
          return;
        }
      })
      .catch((error) => {
        setIsLoader(false);
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    getAllData(1);
    getAllStates();
  }, [isRefresh]);

  return (
    <>
      <ToastContainer />
      {isLoader && <Loader />}
      <section className="w-full">
        <div className=" mx-auto">
          <div className="rounded-[10px] bg-white py-[20px] flexBetween flex-col md:flex-row gap-3 px-[20px] mt-[20px] lg:mt-0">
            <p className=" text-[22px] font-semibold">City list</p>
            <div className="flexCenter gap-x-7 lg:gap-x-5 md:flex-auto flex-wrap gap-y-3">
              <div className="border border-primary  bg-[#302f2f82]] flexCenter h-[32px] pl-[10px] md:w-auto w-full">
                <input
                  type="text"
                  className="input_search"
                  value={searchText}
                  onChange={handleSearchInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Search by city name."
                />
                {searchText !== "" ? (
                  <button
                    className="clear_search_btn"
                    onClick={handleClearSearch}
                  >
                    <CloseIcon />
                  </button>
                ) : (
                  ""
                )}
                <button className="search_btn" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
            <div className="flex justify-end mx-4 mt-3">
              <button onClick={() => setOpenAdd(true)} className="primary_btn">
                {" "}
                Add new city{" "}
              </button>
            </div>
          </div>

          <div className="">
            <div className="outer_table">
              <table className="w-full min-w-[640px] table-auto mt-[20px] ">
                <thead className="">
                  <tr className=" ">
                    {headItems.map((items, inx) => (
                      <th className="table_head " key={inx}>
                        <p className="block justify-center text-[13px] font-medium uppercase whitespace-nowrap text-[#72727b]">
                          {items}
                        </p>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {Array.isArray(allData) &&
                    allData?.length > 0 &&
                    allData?.map((items, index) => (
                      <tr key={index}>
                        <td className="table_data">{index + 1}</td>
                        <td className="table_data capitalize">
                          {items?.name}
                        </td>

                        <td className="table_data">
                          <div className="table_btn_div">
                            <button
                              className="secondary_btn"
                              onClick={() => handleEdit(items?._id)}
                            >
                              Edit
                            </button>
                            <button
                              className="delete_btn"
                              onClick={() => handleDelete(items?._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {Array.isArray(allData?.cities) &&
              allData?.cities?.length === 0 && (
                <div className="no_data">
                  <p className="text-[18px] fontsemibold">No data</p>
                </div>
              )}
          </div>

          {allData?.totalPages > 1 && (
            <Pagination
              currentpage={allData?.currentPage}
              totalCount={allData?.totalPages}
              visiblePageCount={visiblePageCount}
              getAllData={getAllData}
            />
          )}
        </div>
      </section>

      {/* ---------Add Popup--------------- */}
      <Transition appear show={openAdd} as={Fragment}>
        <Dialog as="div" className="z-10 fixed" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className=" w-full max-w-[540px] xl:max-w-[700px] transform overflow-hidden rounded-2xl bg-white 2xl:py-10 2xl:px-12 lg:px-10 px-8 py-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="flex justify-end lg:text-[20px] text-[16px] font-semibold leading-6 text-gray-900"
                  >
                    {" "}
                    <button className=" cursor-pointer" onClick={closeAddModal}>
                      <CloseIcon />
                    </button>
                  </Dialog.Title>

                  <AddCity
                    token={token}
                    closeModal={closeAddModal}
                    states={states}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* ---------Edit Popup--------------- */}
      <Transition appear show={editOpen} as={Fragment}>
        <Dialog as="div" className="z-10 fixed" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className=" w-full max-w-[540px] xl:max-w-[700px] 2xl:max-w-[800px] transform overflow-hidden rounded-2xl bg-white p-5 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="flex justify-end lg:text-[20px] text-[16px] font-semibold leading-6 text-gray-900"
                  >
                    {" "}
                    <button
                      className=" cursor-pointer"
                      onClick={closeEditModal}
                    >
                      <CloseIcon />
                    </button>
                  </Dialog.Title>
                  <EditCity
                    closeModal={closeEditModal}
                    refreshData={refreshdata}
                    editData={editData}
                    states={states}
                    token={token}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/*---------- Delete popup---------- */}
      <Transition appear show={openDelete} as={Fragment}>
        <Dialog as="div" className="relative z-[11]" onClose={closeDeleteModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-[500px] transform overflow-hidden rounded-2xl bg-white 2xl:py-10 2xl:px-12 px-8 py-8  text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="xl:text-[20px] text-[18px] font-medium leading-6 text-gray-900"
                  >
                    Delete user
                  </Dialog.Title>
                  {/* <DeleteUser
                    closeModal={closeDeleteModal}
                    refreshdata={refreshdata}
                    deleteId={Id}
                    token={token}
                  /> */}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default City;
