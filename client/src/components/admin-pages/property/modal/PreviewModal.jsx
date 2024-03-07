import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";

const PreviewModal = ({ previewData }) => {
  console.log(previewData);
  return (
    <div className="pb-[20px]">
      <div className="grid md:grid-cols-2 gap-5 lg:gap-8">
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
            {previewData?.title}
          </h4>
          <div className="py-2 border-b border-[#bebbbb] ">
            <div className="form_col">
              <label className="form_label_head">Category</label>
              <div className="form_info ">
                {previewData?.category?.title
                  ? previewData?.category?.title
                  : "Not Found"}
              </div>
            </div>
            <div className="form_col">
              <label className="form_label_head">Listing Type </label>
              <div className="form_info ">
                {Array.isArray(previewData?.listingType) &&
                  previewData?.listingType.length > 0 &&
                  previewData?.listingType.map((iter, inde) => {
                    return (
                      <>
                        <span className="mr-2">{iter}</span>
                      </>
                    );
                  })}
              </div>
            </div>

            <div className="form_col">
              <label className="form_label_head">Furnished Type </label>
              <div className="form_info ">{previewData?.furnishedType}</div>
            </div>
            <div className="form_col">
              <label className="form_label_head">price </label>
              <div className="form_info ">{previewData?.price}</div>
            </div>
            <div className="form_col">
              <label className="form_label_head">area </label>
              <div className="form_info ">{previewData?.area}</div>
            </div>
            <div className="form_col">
              <label className="form_label_head">feature </label>
              <ul className=" list-inside ">
                {previewData?.feature?.map((item, index) => (
                  <li className="font-medium" key={index}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="form_col">
              <label className="form_label_head">description </label>
              <div className="form_info ">{previewData?.description}</div>
            </div>
            <div className="form_col">
              <label className="form_label_head">Collage Name </label>
              <div className="form_info">{previewData?.collegeName}</div>
            </div>
          </div>
          <div className="">
            <h6 className="form_heading py-3"> Preference </h6>

            <div className="form_col">
              <label className="form_label_head">Preference</label>
              <div className="flex form_info gap-2 ">
                {previewData?.preference?.map((item, index) => (
                  <div className="bg-[#234f68] text-[white] border rounded-[24px] py-3 px-8">
                    {item.preference}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
