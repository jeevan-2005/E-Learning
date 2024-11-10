import React, { FC } from "react";
import UserAnalytics from "./analytics/UserAnalytics";
import { BiBorderLeft } from "react-icons/bi";
import { PiUsersFourLight } from "react-icons/pi";
import { Box, CircularProgress } from "@mui/material";
import OrderAnalytics from "./analytics/OrderAnalytics";
import AllInvoices from "./orderInvoices/AllInvoices.tsx";

type Props = {
  open?: boolean;
  value?: number;
};

const CircularProgressWithLabel: FC<Props> = ({ value, open }) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={45}
        color={value && value > 99 ? "info" : "error"}
        style={{ zIndex: open ? -1 : 1 }}
        thickness={4}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></Box>
    </Box>
  );
};

const DashboardWidgets: FC<Props> = ({ open }) => {
  return (
    <div className="mt-[20px] min-h-screen mb-[30px]">
      <div className="grid grid-cols-[75%,25%]">
        <div className="pr-8">
          <UserAnalytics isDashboard={true} />
        </div>

        <div className="pt-[80px] pr-8">
          <div className="w-full rounded-sm shadow-md dark:bg-[#111C43]">
            <div className="flex items-center flex-row-reverse justify-around p-5">
              <div className="">
                <BiBorderLeft className="text-[30px] text-[#000] dark:text-[#45CBA0]" />
                <h5 className="text-[20px] font-[400] py-2 font-Poppins text-[#000] dark:text-[#45CBA0]">
                  Sales Obtained
                </h5>
              </div>
              <div>
                <CircularProgressWithLabel value={100} open={open} />
                <h5 className="text-center pt-4 text-black dark:text-white">
                  +120%
                </h5>
              </div>
            </div>
          </div>

          <div className="w-full rounded-sm shadow-md dark:bg-[#111C43] my-8">
            <div className="flex items-center flex-row-reverse justify-around p-5">
              <div className="">
                <PiUsersFourLight className="text-[30px] text-[#000] dark:text-[#45CBA0]" />
                <h5 className="text-[20px] pt-2 font-Poppins text-[#000] dark:text-[#fff]">
                  450
                </h5>
                <h5 className="text-[20px] font-[400] py-2 font-Poppins text-[#000] dark:text-[#45CBA0]">
                  New Users
                </h5>
              </div>
              <div>
                <CircularProgressWithLabel value={100} open={open} />
                <h5 className="text-center pt-4 text-black dark:text-white">
                  +150%
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[62%,38%] mt-[-20px]">
        <div className="dark:bg-[#111c43] w-[96%] mt-[30px] h-[50vh] shadow-lg">
          <OrderAnalytics isDashboard={true} />
        </div>
        <div className="mt-[30px] mr-[30px]">
          <h5 className="text-[20px] font-[400] pb-3 font-Poppins text-[#000] dark:text-[#fff]">
            Recent Transactions
          </h5>
          <AllInvoices isDashboard={true} />
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
