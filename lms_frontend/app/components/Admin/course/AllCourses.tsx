import React, { FC, useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { useTheme } from "next-themes";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import {
  useDeleteCourseMutation,
  useGetAllCoursesQuery,
} from "../../../../redux/features/course/courseApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { style } from "../../../styles/styles";
import toast from "react-hot-toast";
import Link from "next/link";

type Props = {};

const AllCourses: FC<Props> = (props) => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const { isLoading, data, refetch } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [deleteCourse, { isSuccess, error }] = useDeleteCourseMutation();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "title", headerName: "Course Title", flex: 1 },
    { field: "ratings", headerName: "Ratings", flex: 0.5 },
    { field: "purchased", headerName: "Purchased", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
    {
      field: "  ",
      headerName: "Edit",
      flex: 0.3,
      renderCell: (params: any) => {
        return (
          <>
            <Link
              href={`/admin/edit-course/${params.row.id}`}
              className="flex h-full items-center justify-center"
            >
              <FiEdit2 className="text-black dark:text-white" size={20} />
            </Link>
          </>
        );
      },
    },
    {
      field: " ",
      headerName: "Delete",
      flex: 0.3,
      renderCell: (params: any) => {
        return (
          <>
            <Button
              onClick={() => {
                setOpen(true);
                setCourseId(params.row.id);
              }}
            >
              <AiOutlineDelete
                className="text-black dark:text-white"
                size={20}
              />
            </Button>
          </>
        );
      },
    },
  ];

  const rows: any = [];

  if (data) {
    data.courses.forEach((item: any) => {
      rows.push({
        id: item._id,
        title: item.name,
        purchased: item.purchased,
        ratings: item.rating,
        created_at: format(item.createdAt),
      });
    });
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course deleted successfully");
      refetch();
    }
    if (error && "data" in error) {
      const errorData = error.data as { message?: string };
      const errorMessage = errorData?.message || "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, error]);

  const handleDeleteCourse = async (id: string) => {
    await deleteCourse(id);
    setOpen(false);
    setCourseId("");
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="mt-[100px]">
        <Box m="20px 30px 0 0">
          <Box
            m="0px 0 0 0"
            height="80vh"
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
            <DataGrid checkboxSelection rows={rows} columns={columns} />
          </Box>
        </Box>
      </div>
      <div>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2  w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
            <div className="w-full">
              <h1 className={`${style.title} mb-5`}>
                Are you sure you want to delete this user?
              </h1>
              <div className="flex justify-between items-center">
                <button
                  className={`${style.btn} mt-3 !w-[30%] !h-[30px]  !mx-auto !bg-[#37a39a]`}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className={`${style.btn} mt-3 !w-[30%] !h-[30px]  !mx-auto !bg-[crimson]`}
                  onClick={() => handleDeleteCourse(courseId)}
                >
                  Delete
                </button>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default AllCourses;
