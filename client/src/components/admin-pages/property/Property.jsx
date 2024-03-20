import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Switch } from "@headlessui/react";
import DeleteModal from "./modal/DeleteModal";
import CloseIcon from "../Svg/CloseIcon";
import Pagination from "../../pagination/Pagination";
import Loader from "../../loader/Index";
import PreviewModal from "./modal/PreviewModal";
import Rating from "./Ratings";
import PropertyUpdate from "./propertyUpdate";
import { ToastContainer,toast } from "react-toastify";

export const headItems = [
  "S. No.",
  "title",
  "category",
  "For",
  "City",
  // "No. of Rooms",
  "price",
  "ratings",
  "block listing",
  "Action",
];

const Property = () => {
  const [isRefresh, setRefresh] = useState(false);
  const [allData, setAllData] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [Id, setId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [previewData, setPreviewData] = useState({});
  const visiblePageCount = 10;
  const { token } = useSelector((state) => state?.auth);
  const [editData, setEditData] = useState([]);
  const [propertyID, setPropertyID] = useState("");
  const [isDrawerOpenO, setIsDrawerOpenO] = useState(false);

  const closeDrawerO = () => {
    setIsDrawerOpenO(false);
  };
  // console.log(previewData);
  const refreshdata = () => {
    setRefresh(!isRefresh);
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
      method: "POST",
      url: `/api/listing/properties/all?search=${search_cate}`,
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

  // preview modal ----
  const handlePreview = async (prev_id) => {
    setIsLoader(true);
    try {
      const res = await axios.get(`/api/listing/property/${prev_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (res.data?.success) {
        setOpenPopup(true);
        setPreviewData(res.data?.property);
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
  const closePreviewModal = () => {
    setOpenPopup(false);
  };
  // get all data ----
  const getAllData = (pageNo) => {
    setIsLoader(true);
    const options = {
      method: "POST",
      url: `/api/listing/properties/all?page=${pageNo}&limit=${visiblePageCount}`,
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
          setAllData(res?.data);
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
  }, [isRefresh]);

  const handleToggleBlocked = async (userId, isBlocked) => {
    if (isBlocked === undefined) return;
    setIsLoader(true);
    try {
      const res = await axios.put(
        `/api/listing/property/${userId}`,
        { isBlocked: !isBlocked },
        {
          headers: { "Content-Type": "application/json", Authorization: token },
        }
      );

      if (res.data?.success) {
        refreshdata();
        return;
      } else {
        console.error("Toggle blocked request failed.");
      }
    } catch (error) {
      console.error("Toggle blocked request failed:", error);
    } finally {
      setIsLoader(false);
    }
  };

  const openModall = async (id) => {
    setIsLoader(true);
    try {
      const options = {
        method: "GET",
        url: `/api/listing/property/${id}`,
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      };
      const response = await axios.request(options);
      if (response.status === 200) {
        setEditData(response?.data?.property);
        setPropertyID(id);

        setIsDrawerOpenO(true);
        setIsLoader(false);
      } else {
        console.error("Error: Unexpected response status");
        setIsLoader(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoader(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        "/api/listing/propertyData",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Download Start");
        window.open(
          "http://3.21.216.227:4000/api/listing/propertyData",
          "_blank"
        );
      } else {
        toast.error("Download failed.");
      }
    } catch (error) {
      console.error("Download failed:", error);
    }
  };
  return (
    <>
      {isLoader && <Loader />}
      <ToastContainer autoClose={1000}/>
      <section className="">
        <div className=" mx-auto">
          <div className="rounded-[10px] bg-white py-[20px] flexBetween flex-col md:flex-row gap-3 px-[20px] mt-[20px] lg:mt-0">
            <p className=" text-[22px] font-semibold">Properties list</p>
            <div className="flexCenter gap-x-7 lg:gap-x-5 md:flex-auto flex-wrap gap-y-3 md:justify-end">
              <div className="border border-primary  bg-[#302f2f82]] flexCenter h-[32px] pl-[10px] md:w-auto w-full">
                <input
                  type="text"
                  className="input_search"
                  value={searchText}
                  onChange={handleSearchInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Search by name, contact, email."
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
          </div>
          <div className="flex justify-end mx-4 mt-3">
            <button target="_blank" onClick={handleDownload} className="bg-[#0F3554] px-2 py-1 text-white rounded-md">Download</button>
          </div>
          <div className="">
            <div className="outer_table ">
              <table className="w-full table-auto mt-[20px] overflow-x-scroll">
                <thead className="">
                  <tr className=" ">
                    {headItems.map((items, inx) => (
                      <th
                        className="table_head p-0 py-2 px-2 text-[13px] font-medium uppercase text-[#72727b]"
                        key={inx}
                      >
                        {items}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {Array.isArray(allData?.properties) &&
                    allData?.properties?.length > 0 &&
                    allData?.properties.map((items, index) => {
                      return (
                        <>
                          <tr className="text-[13px] font-medium uppercase ">
                            <td className="p-2">
                              {Number(index + 1) +
                                10 * Number(allData?.page - 1)}
                            </td>
                            <td className="p-2">{items.title}</td>
                            <td className="p-2">
                              {items?.category?.title
                                ? items?.category?.title
                                : "Not found"}{" "}
                            </td>
                            <td className="p-2">{items?.listingType}</td>
                            <td className="p-2">{items?.city?.name}</td>
                            {/* <td className="p-2">
                              {items?.numberOfRooms}
                            </td> */}
                            <td className="p-2 whitespace-nowrap">
                              $ {items?.price}
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <Rating rating="3.5" /> {items?.rating}
                            </td>
                            <td className="p-2">
                              <Switch
                                checked={items?.isBlocked}
                                onChange={() =>
                                  handleToggleBlocked(
                                    items?._id,
                                    items?.isBlocked
                                  )
                                }
                                className={`${
                                  items?.isBlocked
                                    ? "bg-primary"
                                    : "bg-gray-200"
                                } relative inline-flex h-6 w-11 items-center rounded-full`}
                              >
                                <span className="sr-only">
                                  Enable notifications
                                </span>
                                <span
                                  className={`${
                                    items?.isBlocked
                                      ? "translate-x-6"
                                      : "translate-x-1"
                                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                />
                              </Switch>
                            </td>

                            <td className="p-2">
                              <div className="table_btn_div">
                                <button
                                  className="secondary_btn"
                                  onClick={() => handlePreview(items?._id)}
                                >
                                  Preview
                                </button>
                                <button
                                  className=" blue_btn"
                                  onClick={() => openModall(items?._id)}
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
                        </>
                      );
                    })}
                </tbody>
              </table>
            </div>
            {Array.isArray(allData?.properties) &&
              allData?.properties?.length === 0 && (
                <div className="no_data">
                  <p className="text-[18px] fontsemibold">No data</p>
                </div>
              )}
          </div>

          {allData?.totalPages > 1 && (
            <Pagination
              currentpage={allData?.page}
              totalCount={allData?.totalPages}
              visiblePageCount={visiblePageCount}
              getAllData={getAllData}
            />
          )}
        </div>
      </section>

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
                <Dialog.Panel className="w-full max-w-[500px] transform overflow-hidden rounded-2xl bg-white 2xl:py-10  py-8 px-8 2xl:px-12 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="xl:text-[20px] text-[18px] font-medium leading-6 text-gray-900"
                  >
                    Delete user
                  </Dialog.Title>
                  <DeleteModal
                    closeModal={closeDeleteModal}
                    refreshdata={refreshdata}
                    deleteId={Id}
                    token={token}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/*---------- Preview popup---------- */}
      <Transition appear show={openPopup} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[11]"
          onClose={closePreviewModal}
        >
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
            <div className="flex min-h-full items-center justify-center md:p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full lg:max-w-[950px] md:max-w-[800px] sm:max-w-[600px] transform overflow-hidden rounded-2xl bg-white  2xl:py-10 px-4 py-4 sm:py-8 md:px-8 2xl:px-12  text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-end items-end ">
                    <button
                      className=" cursor-pointer"
                      onClick={closePreviewModal}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                  <PreviewModal
                    closeModal={closePreviewModal}
                    previewData={previewData}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isDrawerOpenO} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
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
                <Dialog.Panel className="w-2/3 sm:w-full sm:max-w-[700px]  transform overflow-hidden rounded-2xl bg-white p-4  sm:px-8 lg:px-8 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-end">
                    <button onClick={closeDrawerO}>
                      {/* <img
                        src="../../../../public/close-square.svg"
                        className="w-7 md:w-7 lg:w-8 xl:w-9 2xl:w-14"
                      /> */}
                      close
                    </button>
                  </div>
                  <PropertyUpdate
                    propertyID={propertyID}
                    closeDrawerO={closeDrawerO}
                    refreshdata={refreshdata}
                    editData={editData}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Property;
