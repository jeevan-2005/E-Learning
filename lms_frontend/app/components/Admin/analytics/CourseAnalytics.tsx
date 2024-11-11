import React, { FC } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  Label,
  YAxis,
  LabelList,
} from "recharts";
import Loader from "../../Loader/Loader";
import { useGetCourseAnalyticsQuery } from "../../../../redux/features/analytics/analyticsApi";
import { style } from "../../../styles/styles";

type Props = {};

const CourseAnalytics: FC<Props> = (props) => {
  const { data, isLoading } = useGetCourseAnalyticsQuery({});

  const analyticsData: any = [];
  const minValue = 0;

  if (data) {
    data.courses.last12Months.forEach((item: any) => {
      analyticsData.push({
        name: item.month,
        uv: item.count,
      });
    });
  }

  if (isLoading) return <Loader />;

  return (
    <div className="w-full min-h-screen">
      <div className="pt-[50px]">
        <h1 className={`${style.title} !text-start px-5`}>Course Analytics</h1>
        <p className={`${style.label} px-5`}>Last 12 months analytics data </p>
      </div>

      <div className="w-full h-[80vh] flex items-center justify-center">
        <ResponsiveContainer width="98%" height="70%">
          <BarChart width={200} height={300} data={analyticsData}>
            <XAxis dataKey="name">
              <Label offset={0} position="insideBottom" />
            </XAxis>
            <YAxis domain={[minValue, "auto"]} />
            <Bar dataKey="uv" fill="#3faf82">
              <LabelList dataKey="uv" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CourseAnalytics;
