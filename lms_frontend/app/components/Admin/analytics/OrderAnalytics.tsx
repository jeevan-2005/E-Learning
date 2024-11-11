import React, { FC } from "react";
import { useGetOrderAnalyticsQuery } from "../../../../redux/features/analytics/analyticsApi";
import Loader from "../../Loader/Loader";
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { style } from "../../../styles/styles";

type Props = {
  isDashboard?: boolean;
};

const OrderAnalytics: FC<Props> = ({ isDashboard }) => {
  const { data, isLoading } = useGetOrderAnalyticsQuery({});

  let analyticsData: any = [];

  if (data) {
    analyticsData = [];
    data.orders.last12Months.forEach((item: any) => {
      analyticsData.push({
        name: item.month,
        count: item.count,
      });
    });
  }

  if (isLoading) return <Loader />;
  return (
    <div className={`${isDashboard ? "h-[40vh]" : "h-[80vh]"}`}>
      <div className={`${isDashboard ? "mt-[0] pl-[40px] mb-2" : "mt-[50px]"}`}>
        <h1
          className={`${style.title} ${
            isDashboard && "!text-[20px] px-5 !text-start"
          }`}
        >
          Order Analytics
        </h1>
        {!isDashboard && (
          <p className={`${style.label} text-center px-5`}>
            Last 12 months analytics data{" "}
          </p>
        )}
      </div>

      <div
        className={`w-full ${
          isDashboard ? "h-[45vh]" : "h-[80vh]"
        } flex items-center justify-center pr-6`}
      >
        <ResponsiveContainer width="98%" height="80%">
          <LineChart
            width={500}
            height={300}
            data={analyticsData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {!isDashboard && <Legend />}
            <Line type="monotone" dataKey="count" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrderAnalytics;
