import React, { useState, useEffect } from "react";
import axios from "axios";

const PreviewModal = ({ previewData, token }) => {
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = (pageNo) => {
    // setIsLoader(true);
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
          // setIsLoader(false);
          setAllData(res?.data?.preferences);
        } else {
          // setIsLoader(false);
          return;
        }
      })
      .catch((error) => {
        // setIsLoader(false);
        console.error("Error:", error);
      });
  };

  console.log(allData);
  return (
    <div className="pb-[20px]">
      <div className="flex flex-col lg:flex-row xl:gap-14 gap-8">
        <div className="min-w-[35%]">
          {previewData?.profilePicture ? (
            <img
              src={previewData?.profilePicture}
              alt="No Image"
              className="max-w-[600]"
            />
          ) : (
            "No Image"
          )}
        </div>
        <div className=" w-full pb-2">
          <h4 className=" whitespace-nowrap capitalize 2xl:text-[30px] lg:text-[26px]  text-[24px] font-medium">
            {previewData?.fullname}
          </h4>
          <div className="pt-2">
            <div className="form_col">
              <label className="form_label_head ">Age</label>
              <div className="form_info ">{previewData?.age}</div>
            </div>
            <div className="form_col">
              <label className="form_label_head">Number </label>
              <div className="form_info ">{previewData?.mobile}</div>
            </div>
            <div className="form_col">
              <label className="form_label_head">Email</label>
              <div className="form_info ">{previewData?.email}</div>
            </div>
            <div className="form_col">
              <label className="form_label_head">Gender</label>
              <div className="form_info capitalize">{previewData?.gender}</div>
            </div>
            <div className="form_col">
              <label className="form_label_head">University </label>
              <div className="form_info">{previewData?.university}</div>
            </div>
          </div>
          <div className="form_col">
            <label className="form_label_head">Spoken Langauge </label>
            <div className="form_info">{previewData?.spokenLanguage}</div>
          </div>
          <div className="border border-b-0 border-[black]"></div>
          <div className="py-2">
            <h6 className="form_label_head py-2">Roomate Bio</h6>
            <div className="form_info">{previewData?.roomMateBio}</div>
          </div>
          <div className="py-2">
            <h6 className="form_label_head py-2"> Preference </h6>
            <div className="flex form_info gap-2">
              {Array.isArray(previewData?.preference) &&
                previewData?.preference &&
                previewData?.preference.map((items, index) => {
                  return allData
                    .filter((ited, inde) => {
                      return ited._id === items;
                    })
                    .map((iteww, ideww) => {
                      return (
                        <>
                          <div className="bg-[#234f68] text-[white] border rounded-[24px] py-3 px-8">
                            {iteww.preference}
                          </div>
                        </>
                      );
                    });
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
