import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";

const PreviewModal = ({ previewData }) => {
  console.log(previewData);
  return (
    <div className="pb-[20px]">
      <div className="grid grid-cols-2 gap-5 lg:gap-8">
        <div className="">
          <Carousel
            infiniteLoop={true}
            showIndicators={false}
            showStatus={false}
            thumbWidth={60}
            className="productCarousel"
          >
            {previewData?.photos.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Image ${index}`}
                className=" max-h-[500px]  "
              />
            ))}
          </Carousel>
        </div>
        <div className=" w-full pb-2">
          <h4 className=" whitespace-nowrap capitalize 2xl:text-[30px] lg:text-[26px]  text-[24px] font-medium">
            {previewData?.category}
          </h4>
          <div className="py-2 border-b border-[#bebbbb] ">
            <div className="form_col">
              <label className="form_label_head">number Of Rooms :</label>
              <div className="form_info ">{previewData?.numberOfRooms}</div>
            </div>
            <div className="form_col">
              <label className="form_label_head">Listing Type :</label>
              <div className="form_info ">{previewData?.listingType}</div>
            </div>
            <div className="form_col">
              <label className="form_label_head">Furnished Type :</label>
              <div className="form_info ">{previewData?.furnishedType}</div>
            </div>
            <div className="form_col">
              <label className="form_label_head">price :</label>
              <div className="form_info ">{previewData?.price}</div>
            </div>
            <div className="form_col">
              <label className="form_label_head">area :</label>
              <div className="form_info ">{previewData?.area}</div>
            </div>
            <div className="form_col">
              <label className="form_label_head">feature :</label>
              <ul className="list-disc list-inside ">
                {previewData?.feature?.map((item, index) => (
                  <li className="form_info" key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="form_col">
              <label className="form_label_head">description :</label>
              <div className="form_info ">{previewData?.description}</div>
            </div>
            <div className="form_col">
              <label className="form_label_head">university :</label>
              <div className="form_info">{previewData?.university}</div>
            </div>
          </div>
          <div className="">
            <h6 className="form_heading py-3"> Preference </h6>
            <div className="form_col">
              <label className="form_label_head">Pet :</label>
              <div className="form_info capitalize">
                {previewData?.PetPrefer}
              </div>
            </div>
            <div className="form_col">
              <label className="form_label_head"> Eating preference:</label>
              <div className="form_info capitalize">
                {previewData?.eatPrefer}
              </div>
            </div>
            <div className="form_col">
              <label className="form_label_head">Smoke / Drink :</label>
              <div className="form_info capitalize">
                {previewData?.smoke_drinkPrefer}
              </div>
            </div>
            <div className="form_col">
              <label className="form_label_head">Gender preference :</label>
              <div className="form_info capitalize">{previewData?.gender}</div>
            </div>
            <div className="form_col">
              <label className="form_label_head">Age group :</label>
              <div className="form_info capitalize">
                {previewData?.ageGroup}
              </div>
            </div>
            <div className="form_col">
              <label className="form_label_head">Other preference:</label>
              <ul className="list-disc list-inside ">
                {previewData?.preference?.map((item, index) => (
                  <li className="form_info" key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
