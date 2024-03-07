import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../../loader/Index";
import Pagination from "../../pagination/Pagination";
import { Dialog, Transition } from "@headlessui/react";
import AddPreference from "./Modal/AddPreference";
import DeletePreference from "./Modal/DeletePreference";
import EditPreference from "./Modal/EditPreference";

const Prefernce = () => {
  const [isRefresh, setRefresh] = useState(false);
  const [allData, setAllData] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [Id, setId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const { token } = useSelector((state) => state?.auth);
  const visiblePageCount = 10;
  const headItems = ["S. No.", "title", "Action"];
  const [isAddDialog, setIsAddDialog] = useState(false);
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [isEditDialog, setIsEditDialog] = useState(false);
  const refreshdata = () => {
    setRefresh(!isRefresh);
  };
  useEffect(() => {
    getAllData();
  }, [isRefresh]);
  const getAllData = (pageNo) => {
    setIsLoader(true);
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
  const AddDialog_handler = (e) => {
    setIsAddDialog(!isAddDialog);
  };
  const deleteDialog_handler = (e) => {
    setIsDeleteDialog(!isDeleteDialog);
    setId(null);
  };
  const editDialog_handler = (e) => {
    setIsEditDialog(!isEditDialog);
    setId(null);
  };
  return (
    <>
      {isLoader && <Loader />}
      <section className="">
        <div className=" mx-auto">
          <div className="rounded-[10px] bg-white py-[20px] flexBetween flex-col md:flex-row gap-3 px-[20px] mt-[20px] lg:mt-0">
            <p className=" text-[22px] font-semibold">Preference list</p>
            <div className="flexCenter gap-x-7 lg:gap-x-5 md:flex-auto flex-wrap gap-y-3 md:justify-end">
              {/* <div className="border border-primary  bg-[#302f2f82]] flexCenter h-[32px] pl-[10px] md:w-auto w-full">
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
              </div> */}
              <button className="secondary_btn" onClick={AddDialog_handler}>
                Add New
              </button>
            </div>
          </div>
          <div className="">
            <div className="outer_table ">
              <table className="w-full table-auto mt-[20px] ">
                <thead className="">
                  <tr className=" ">
                    {headItems.map((items, inx) => (
                      <th className="table_head whitespace-nowrap" key={inx}>
                        <p className="block text-[13px] font-medium uppercase text-[#72727b]">
                          {items}
                        </p>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {Array.isArray(allData?.preferences) &&
                    allData?.preferences?.length > 0 &&
                    allData?.preferences?.map((items, index) => (
                      <tr key={index}>
                        <td className="table_data">{index + 1}</td>
                        <td className="table_data capitalize">
                          {items?.preference}
                        </td>

                        <td className="table_data">
                          <div className="table_btn_div">
                            <button
                              className="secondary_btn"
                              //   onClick={() => handlePreview(items?._id)}
                              onClick={() => {
                                editDialog_handler();
                                setId(items?._id);
                                setEditTitle(items?.preference);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="delete_btn"
                              onClick={() => {
                                deleteDialog_handler();
                                setId(items?._id);
                              }}
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
            {Array.isArray(allData?.preferences) &&
              allData?.preferences?.length === 0 && (
                <div className="no_data">
                  <p className="text-[18px] fontsemibold">No data</p>
                </div>
              )}
          </div>
        </div>

        {/* ///add category */}

        <Transition appear show={isAddDialog} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-[11]"
            onClose={AddDialog_handler}
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
                      Add Preference
                    </Dialog.Title>
                    <AddPreference
                      closeModal={AddDialog_handler}
                      refreshdata={refreshdata}
                      token={token}
                    />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        <Transition appear show={isDeleteDialog} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-[11]"
            onClose={deleteDialog_handler}
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
                      Delete Category
                    </Dialog.Title>
                    <DeletePreference
                      closeModal={deleteDialog_handler}
                      refreshdata={refreshdata}
                      token={token}
                      deleteId={Id}
                    />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        <Transition appear show={isEditDialog} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-[11]"
            onClose={editDialog_handler}
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
                      Edit Category
                    </Dialog.Title>
                    <EditPreference
                      closeModal={editDialog_handler}
                      refreshdata={refreshdata}
                      token={token}
                      EditId={Id}
                      preValue={editTitle}
                    />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </section>
    </>
  );
};

export default Prefernce;
