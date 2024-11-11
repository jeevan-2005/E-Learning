import React, { FC, useEffect, useState } from "react";
import UserAnalytics from "./analytics/UserAnalytics";
import { BiBorderLeft } from "react-icons/bi";
import { PiUsersFourLight } from "react-icons/pi";
import { Box, CircularProgress } from "@mui/material";
import OrderAnalytics from "./analytics/OrderAnalytics";
import AllInvoices from "./orderInvoices/AllInvoices";
import {
  useGetOrderAnalyticsQuery,
  useGetUserAnalyticsQuery,
} from "@/redux/features/analytics/analyticsApi";

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
  const [userComparePercentage, setUserComparePercentage] = useState<any>();
  const [orderComparePercentage, setOrderComparePercentage] = useState<any>();

  const { data: userData, isLoading: userLoading } = useGetUserAnalyticsQuery(
    {}
  );
  const { data: orderData, isLoading: orderLoading } =
    useGetOrderAnalyticsQuery({});

  useEffect(() => {
    if (userLoading || orderLoading) {
      return;
    }
    if (userData && orderData) {
      const userLast2Months = userData?.users?.last12Months.slice(-2);
      const orderLast2Months = orderData?.orders?.last12Months.slice(-2);

      if (userLast2Months.length === 2 && orderLast2Months.length === 2) {
        const userCurrentMonth = userLast2Months[1].count;
        const userPreviousMonth = userLast2Months[0].count;
        const orderCurrentMonth = orderLast2Months[1].count;
        const orderPreviousMonth = orderLast2Months[0].count;

        const userPercentage =
          userPreviousMonth !== 0
            ? ((userCurrentMonth - userPreviousMonth) / userPreviousMonth) * 100
            : 100;
        const orderPercentage =
          orderPreviousMonth !== 0
            ? ((orderCurrentMonth - orderPreviousMonth) / orderPreviousMonth) *
              100
            : 100;

        setUserComparePercentage({
          currentMonth: userCurrentMonth,
          previousMonth: userPreviousMonth,
          percentChange: userPercentage,
        });

        setOrderComparePercentage({
          currentMonth: orderCurrentMonth,
          previousMonth: orderPreviousMonth,
          percentChange: orderPercentage,
        });
      }
    }
  }, [userData, orderData, userLoading, orderLoading]);

  return (
    <div className="mt-[20px] min-h-screen mb-[30px]">
      <div className="grid grid-cols-[75%,25%]">
        <div className="pr-8">
          <UserAnalytics isDashboard={true} />
        </div>

        <div className="pt-[80px] pr-8">
          <div className="w-full rounded-sm shadow-md dark:bg-[#111C43]">
            <div className="flex items-center flex-row-reverse justify-between p-3 py-6">
              <div className="">
                <div className="flex items-center gap-3">
                  <BiBorderLeft className="text-[30px] text-[#000] dark:text-[#45CBA0]" />
                  <h5 className="text-[20px] font-Poppins text-[#000] dark:text-[#fff]">
                    {orderComparePercentage?.currentMonth}
                  </h5>
                </div>
                <h5 className="text-[20px] font-[400] py-2 font-Poppins text-[#000] dark:text-[#45CBA0]">
                  Sales Obtained
                </h5>
              </div>
              <div className="flex flex-col items-center justify-around">
                <CircularProgressWithLabel value={
                  orderComparePercentage?.percentChange > 0 ? 100 : 0
                } open={open} />
                <h5 className="text-center pt-4 text-black dark:text-white">
                  {orderComparePercentage?.percentChange > 0
                    ? "+" + orderComparePercentage?.percentChange.toFixed(2)
                    : "-" + orderComparePercentage?.percentChange.toFixed(2)}
                  %
                </h5>
              </div>
            </div>
          </div>

          <div className="w-full rounded-sm shadow-md dark:bg-[#111C43] my-8">
            <div className="flex items-center flex-row-reverse justify-around p-3 py-6">
              <div className="">
                <div className="flex gap-3 items-center">
                  <PiUsersFourLight className="text-[30px] text-[#000] dark:text-[#45CBA0]" />
                  <h5 className="text-[20px] font-Poppins text-[#000] dark:text-[#fff]">
                    {userComparePercentage?.currentMonth}
                  </h5>
                </div>
                <h5 className="text-[20px] font-[400] py-2 font-Poppins text-[#000] dark:text-[#45CBA0]">
                  New Users
                </h5>
              </div>
              <div className="flex flex-col items-center justify-around">
                <CircularProgressWithLabel value={
                  userComparePercentage?.percentChange > 0 ? 100 : 0
                } open={open} />
                <h5 className="text-center pt-4 text-black dark:text-white">
                  {userComparePercentage?.percentChange > 0
                    ? "+" + userComparePercentage?.percentChange.toFixed(2)
                    : "-" + userComparePercentage?.percentChange.toFixed(2)}
                  %
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
