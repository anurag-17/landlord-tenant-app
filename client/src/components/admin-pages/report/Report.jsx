import React, { Fragment, useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import html2pdf from "html2pdf.js";

import Loader from "../../loader/Index";
export const headItems = [
  "Daily Users",
  "Monthly Users",
  "Seven Day Availablity",
  "Thirty Day Inactive Users",
  "New Daily Signup",
];

const Report = () => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];
  const COLORS_SET2 = ["#4CAF50", "#FFC107", "#E91E63", "#673AB7", "#9C27B0"];
  const COLORS_SET3 = ["#F44336", "#2196F3", "#FF5722", "#795548", "#607D8B"];
  const [isRefresh, setRefresh] = useState(false);
  const [allData, setAllData] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [prefData, setPrefData] = useState([]);
  const [pieGender, setPieGender] = useState([]);
  const [pieCity, setPieCity] = useState([]);

  const [Id, setId] = useState(null);

  const [fullData, setFullData] = useState([]);
  const { token } = useSelector((state) => state?.auth);
  const [isDate, setIsDate] = useState(true)
  const reportRef = useRef();
  // console.log(previewData);
  const refreshdata = () => {
    setRefresh(!isRefresh);
  };
  // delete func ----

  // get all data ----
  const getAllData = (date) => {
    setIsLoader(true);
    const options = {
      method: "GET",
      url: `/api/auth/graphData?${date}`,
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    };
    axios
      .request(options)
      .then((res) => {
        // console.log(res);
        setIsLoader(false);

        setAllData([
          {
            name: "Tenant",
            value: res?.data?.usersWithoutProperty,
          },
          { name: "All Property", value: res?.data?.totalProperties },
        ]);
        const transformedPrefData = res?.data?.preferenceCounts?.map(
          ({ _id, count }) => ({
            name: _id?.preference,
            value: count,
          })
        );

        setPrefData(transformedPrefData);
        const transformedGenderData = res?.data?.genderCounts?.map(
          ({ _id, count }) => ({
            name: _id,
            value: count,
          })
        );
        setPieGender(transformedGenderData);

        const transformedCityData = res?.data?.cityCounts?.map(
          ({ _id, count }) => ({
            name: _id ? _id : "Others",
            value: count,
          })
        );
        setPieCity(transformedCityData);
        setFullData(res?.data);
        console.log(res?.data, "graph");
        // if (res?.data?.success) {
        // } else {
        //   setIsLoader(false);
        //   return;
        // }
      })
      .catch((error) => {
        setIsLoader(false);
        console.error("Error:", error);
      });
  };
  useEffect(() => {
    getAllData();
  }, [isRefresh]);
  console.log(allData);

  const generatePDF = async () => {
    setIsDate(false)
    const element = document.getElementById("html-element");
    const pageBreakElements = element.getElementsByClassName("page-break");
    const pageBreakCount = pageBreakElements.length;
    for (let i = 0; i < pageBreakCount; i++) {
      const pageBreakElement = pageBreakElements[i];
      pageBreakElement.style.pageBreakAfter = "always";
    }

    const opt = {
      margin: [5, 5, 5, 5],
      filename: `report.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
    //    // Generate the PDF and convert it to base64
    // const pdfData = await html2pdf().set(opt).from(element).outputPdf();

    // // Convert the PDF data to base64
    // const base64PDF = btoa(pdfData);

    // // Now you have the base64 encoded PDF
    // console.log(base64PDF);
    setTimeout(() => {
      setIsDate(true) 
    });
  };
  return (
    <>
      {isLoader && <Loader />}
      <section className="mt-[20px] lg:mt-0 px-20 md:px-0 bg-[#F3F3F3] pb-10">
        <div className="flex justify-end mt-5 mx-[57px]">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={generatePDF}
          >
            Download PDF
          </button>
        </div>
        <div className=" mx-auto" id="html-element">
          <div className="mt-10 ">
            <div className="flex justify-around items-center">
              <div className="bg-white border p-4 rounded-lg">
                <BarChart width={300} height={300} data={allData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  {/* <Legend /> */}
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
                <p className="flex justify-center pt-3">
                  Tanent Without Property VS Total Property
                </p>
              </div>
              <div className="bg-white border p-4 rounded-lg">
                <PieChart width={370} height={300}>
                  <Legend />
                  <Pie
                    dataKey="value"
                    isAnimationActive={true}
                    data={prefData}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    fill="#8884d8"
                    label
                  >
                    {prefData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
                <p className="flex justify-center pt-3">
                  Distribution of attributes
                </p>
              </div>
            </div>
            <hr className="my-4 border border-gray-300" />
            <div className="flex justify-around">
              <div className="bg-white border p-4 rounded-lg">
                <PieChart className="" width={400} height={230}>
                  <Pie
                    dataKey="value"
                    isAnimationActive={true}
                    data={pieGender}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    fill="#8884d8"
                    label
                  >
                    {prefData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS_SET2[index % COLORS_SET2.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
                <p className="flex justify-center pt-3">Gender Makeup</p>
              </div>
              <div className="bg-white border p-4 rounded-lg">
                <PieChart width={400} height={230}>
                  <Pie
                    dataKey="value"
                    isAnimationActive={true}
                    data={pieCity}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    fill="#8884d8"
                    label
                  >
                    {prefData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS_SET3[index % COLORS_SET3.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
                <p className="flex justify-center pt-3">
                  City specific attribute makeup
                </p>
              </div>
            </div>

            <div className="m-3 mt-7 border p-3 bg-white mb-20">
            <div className="flex justify-end mx-10">
           
            <div className="border rounded p-1 ">
               {
                isDate? <div>
                  <input
                  className="text-gray-400"
                    type="date"
                    name=""
                    id=""
                    onChange={(e) => {
                      getAllData(e.target.value);
                    }}
                  />
                </div>:""
               }
               </div>
               </div>
              <div className=" flex justify-center">
                <table className="table-auto mt-[20px] border-collapse  border">
                  <thead className="border">
                    <tr className="">
                      {headItems.map((items, inx) => (
                        <th
                          className="table_head border border-gray-300 "
                          key={inx}
                        >
                          <p className="block text-[13px] font-medium uppercase  text-[#72727b]">
                            {items}
                          </p>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {fullData && (
                      <tr className="">
                        <td className="table_data border border-gray-300">
                          <div className="flex justify-center ">
                            {fullData.currentDateLoginUsers}
                          </div>
                        </td>
                        <td className="table_data border border-gray-300">
                          <div className="flex justify-center">
                            {fullData.currentMonthLoginUsers}
                          </div>
                        </td>
                        <td className="table_data border border-gray-300">
                          <div className="flex justify-center">
                            {fullData.sevenDaysInactiveUsers}
                          </div>
                        </td>
                        <td className="table_data border border-gray-300">
                          <div className="flex justify-center">
                            {fullData.thirtyDaysInactiveUsers}
                          </div>
                        </td>
                        <td className="table_data border border-gray-300">
                          <div className="flex justify-center">
                            {fullData.newUsersToday}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Report;
