import React, { FC, useEffect, useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "next-themes";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { useGetAllOrdersQuery } from "../../../../redux/features/orders/ordersApi";
import { useGetAllCoursesQuery } from "../../../../redux/features/course/courseApi";
import { useGetAllUserQuery } from "../../../../redux/features/user/userApi";
import { AiOutlineMail } from "react-icons/ai";
import { Box } from "@mui/material";

type Props = {
  isDashboard?: boolean;
};

const AllInvoices: FC<Props> = ({ isDashboard }) => {
  const { theme, setTheme } = useTheme();
  const { data, isLoading: orderLoading } = useGetAllOrdersQuery({});
  const { data: courseData } = useGetAllCoursesQuery({});
  const { data: userData } = useGetAllUserQuery({});
  const [orderData, setOrderData] = useState<any>([]);

  useEffect(() => {
    if (data) {
      const temp = data.orders.map((order: any) => {
        const user = userData?.users.find(
          (user: any) => user?._id === order?.userId
        );
        const course = courseData?.courses.find(
          (course: any) => course?._id === order?.courseId
        );

        return {
          ...order,
          userName: user?.name,
          userEmail: user?.email,
          title: course?.name,
          price: "$" + course?.price,
        };
      });

      setOrderData(temp);
    }
  }, [data, courseData, userData]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: isDashboard ? 0.3 : 0.4 },
    {
      field: "userName",
      headerName: "User Name",
      flex: isDashboard ? 0.6 : 0.5,
    },
    ...(isDashboard
      ? []
      : [
          {
            field: "userEmail",
            headerName: "Email",
            flex: 1,
          },
          { field: "title", headerName: "Course Title", flex: 1 },
        ]),
    { field: "price", headerName: "Price", flex: 0.5 },
    ...(isDashboard
      ? [{ field: "created_at", headerName: "Created At", flex: 0.5 }]
      : [
          {
            field: " ",
            headerName: "mail",
            flex: 0.3,
            renderCell: (params: any) => {
              return (
                <a
                  href={`mailto:${params.row.userEmail}`}
                  className="flex h-full items-center justify-center"
                >
                  <AiOutlineMail
                    className="text-black dark:text-white"
                    size={20}
                  />
                </a>
              );
            },
          },
        ]),
  ];

  const rows: any = [];

  if (orderData) {
    orderData.map((order: any) =>
      rows.push({
        id: order?._id,
        userName: order?.userName,
        userEmail: order?.userEmail,
        title: order?.title,
        price: order?.price,
        created_at: format(order?.createdAt),
      })
    );
  }

  if (orderLoading) return <Loader />;

  return (
    <div className={`${!isDashboard ? "mt-[100px]" : "mt-0"}`}>
      <Box m={isDashboard ? "0" : "40px"}>
        <Box
          m={isDashboard ? "0" : "40px 0 0 0"}
          height={isDashboard ? "40vh" : "80vh"}
          overflow="auto"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              outline: "none",
            },
            "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
              color: theme === "dark" ? "#fff" : "#000",
            },
            "& .MuiDataGrid-sortIcon": {
              color: theme === "dark" ? "#fff" : "#000",
            },
            "& .MuiDataGrid-row": {
              color: theme === "dark" ? "#fff" : "#000",
              borderBottom:
                theme === "dark"
                  ? "1px solid #ffffff30!important"
                  : "1px solid #ccc!important",
            },
            "& .MuiTablePagination-root": {
              color: theme === "dark" ? "#fff" : "#000",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: theme === "dark" ? "#fff" : "#000",
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: theme === "dark" ? "#3e4396" : "#59A4E1",
              borderBottom: "none",
              color: theme === "dark" ? "#fff" : "#000",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0",
            },
            "& .MuiDataGrid-footerContainer": {
              color: theme === "dark" ? "#fff" : "#000",
              backgroundColor: theme === "dark" ? "#3e4396" : "#59A4E1",
              borderTop: "none",
            },
            "& .MuiCheckbox-root": {
              color:
                theme === "dark" ? "#b7ebde !important" : "#000 !important",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: "#fff !important",
            },
          }}
        >
          <DataGrid
            checkboxSelection={isDashboard ? false : true}
            rows={rows}
            columns={columns}
            slots={isDashboard ? {} : { toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    </div>
  );
};

export default AllInvoices;
