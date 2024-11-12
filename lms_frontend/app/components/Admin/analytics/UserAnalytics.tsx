import React, { FC } from "react";
import { useGetUserAnalyticsQuery } from "../../../../redux/features/analytics/analyticsApi";
import { style } from "../../../styles/styles";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Loader from "../../Loader/Loader";

type Props = {
  isDashboard?: boolean;
};

const UserAnalytics: FC<Props> = ({ isDashboard }) => {
  const { data, isLoading } = useGetUserAnalyticsQuery({});
  const analyticsData: any = [];

  if (data) {
    data.users.last12Months.forEach((item: any) => {
      analyticsData.push({
        name: item.month,
        count: item.count,
      });
    });
  }

  if (isLoading) return <Loader />;

  return (
    <div
      className={`${
        !isDashboard
          ? "mt-[50px]"
          : "mt-[25px] dark:bg-[#111C43] shadow-lg pb-0 rounded-sm"
      }`}
    >
      <div className={`${isDashboard ? "!ml-8 mb-0" : ""}`}>
        <h1
          className={`${style.title} ${
            isDashboard && "!text-[20px] px-5 !text-start"
          }`}
        >
          User Analytics
        </h1>
        {!isDashboard && (
          <p className={`${style.label} text-center px-5`}>
            Last 12 months analytics data{" "}
          </p>
        )}
      </div>

      <div
        className={`w-full ${
          isDashboard ? "h-[45vh]" : "h-[85vh]"
        } flex items-center justify-center pr-6`}
      >
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart
            data={analyticsData}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type={"monotone"}
              dataKey={"count"}
              stroke="#4d62d9"
              fill="#4d62d9"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserAnalytics;
