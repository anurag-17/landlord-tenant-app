import React, { useState } from "react";

const PreviewModal = ({ previewData}) => {
  return (
    <div className="pb-[20px]">
      <div className="flex flex-col lg:flex-row xl:gap-14 gap-8">
        <div className="min-w-[35%]">
          {previewData?.profilePicture ? (
            <img src={previewData?.profilePicture} alt="No Image" className="max-w-[600]" />
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
              <label className="form_label_head">Age :</label>
              <div className="form_info ">{previewData?.age}</div>
            </div>
            <div className="form_col">
              <label className="form_label_head">Number :</label>
              <div className="form_info ">{previewData?.mobile}</div>
            </div>
            <div className="form_col">
              <label className="form_label_head">Email:</label>
              <div className="form_info ">{previewData?.email}</div>
            </div>
            <div className="form_col">
              <label className="form_label_head">Gender:</label>
              <div className="form_info capitalize">{previewData?.gender}</div>
            </div>
            <div className="form_col">
              <label className="form_label_head">university :</label>
              <div className="form_info">{previewData?.university}</div>
            </div>
          </div>
          <div className="">
            <h6 className="form_heading py-2"> Preference </h6>
            <div className="form_col">
              <label className="form_label_head">Pet :</label>
              <div className="form_info capitalize" >{previewData?.PetPrefer}</div>
            </div>
            <div className="form_col">
              <label className="form_label_head"> Eating preference:</label>
              <div className="form_info capitalize">{previewData?.eatPrefer}</div>
            </div>
            <div className="form_col">
              <label className="form_label_head">Smoke / Drink :</label>
              <div className="form_info capitalize">{previewData?.smoke_drinkPrefer}</div>
            </div>
            <div className="form_col">
              <label className="form_label_head">Gender preference :</label>
              <div className="form_info capitalize">{previewData?.genderPrefer}</div>
            </div>
            <div className="form_col">
              <label className="form_label_head">Age group :</label>
              <div className="form_info capitalize">{previewData?.ageGroup}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
