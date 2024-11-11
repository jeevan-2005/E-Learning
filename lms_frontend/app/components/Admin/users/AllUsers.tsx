import React, { FC, useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { useTheme } from "next-themes";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import {
  useDeleteUserMutation,
  useGetAllUserQuery,
  useUpdateUserRoleMutation,
} from "../../../../redux/features/user/userApi";
import { style } from "../../../styles/styles";
import toast from "react-hot-toast";

type Props = {
  isTeam: boolean;
};
const AllUsers: FC<Props> = ({ isTeam }) => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [userId, setUserId] = useState("");
  const [updateUserRole, { isSuccess, error: updateError }] =
    useUpdateUserRoleMutation();
  const { isLoading, data, refetch } = useGetAllUserQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [deleteUser, { isSuccess: isDeleteSuccess, error: deleteError }] =
    useDeleteUserMutation();

  useEffect(() => {
    if (updateError && "data" in updateError) {
      const errorData = updateError.data as { message?: string };
      const errorMessage = errorData?.message || "An error occurred";
      toast.error(errorMessage);
    }

    if (isSuccess) {
      toast.success("User role updated successfully");
      refetch();
    }

    if (isDeleteSuccess) {
      toast.success("User deleted successfully");
      refetch();
    }

    if (deleteError && "data" in deleteError) {
      const errorData = deleteError.data as { message?: string };
      const errorMessage = errorData?.message || "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, updateError, isDeleteSuccess, deleteError]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Name", flex: 0.6 },
    { field: "email", headerName: "Email", flex: 0.7 },
    { field: "role", headerName: "Role", flex: 0.4 },
    { field: "courses", headerName: "Purchased Courses", flex: 0.5 },
    { field: "created_at", headerName: "Joined", flex: 0.4 },
    {
      field: " ",
      headerName: "Delete",
      flex: 0.25,
      renderCell: (params: any) => {
        return (
          <>
            <Button
              onClick={() => {
                setOpen2(true);
                setUserId(params.row.id);
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
    {
      field: "  ",
      headerName: "Email",
      flex: 0.25,
      renderCell: (params: any) => {
        return (
          <>
            <a
              href={`mailto:${params.row.email}`}
              className="text-black dark:text-white cursor-pointer flex items-center justify-center h-full"
            >
              <AiOutlineMail className="text-black dark:text-white" size={20} />
            </a>
          </>
        );
      },
    },
  ];

  const rows: any = [];

  if (data && isTeam) {
    data.users.forEach((item: any) => {
      if (item.role === "admin") {
        rows.push({
          id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
          courses: item.courses.length,
          created_at: format(item.createdAt),
        });
      }
    });
  } else if (data && !isTeam) {
    data.users.forEach((item: any) => {
      rows.push({
        id: item._id,
        name: item.name,
        email: item.email,
        role: item.role,
        courses: item.courses.length,
        created_at: format(item.createdAt),
      });
    });
  }
  const handleUpdateUserRole = async (e: any) => {
    e.preventDefault();
    const data = { email, role };
    await updateUserRole(data);
    setOpen(false);
    setEmail("");
    setRole("admin");
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
    setOpen2(false);
    setUserId("");
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="mt-[80px]">
        <Box m="0 30px 0 0">
          {isTeam && (
            <div className="w-full flex justify-center m-0 p-0">
              <div
                className={`${style.btn2} !m-0 !mb-3 !rounded-full !w-[20%] dark:!bg-[#3e4396] !bg-[#59A4E1]`}
                onClick={() => setOpen(true)}
              >
                Add New Member
              </div>
            </div>
          )}
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
              <h1 className={`${style.title} mb-5`}>Add New Member</h1>
              <form onSubmit={handleUpdateUserRole}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="enter email..."
                  className={`${style.input} w-full mb-5`}
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`${style.input} w-full mb-5`}
                >
                  <option
                    className="dark:bg-[#333] dark:text-white text-black bg-[#fff]"
                    value="admin"
                  >
                    Admin
                  </option>
                  <option
                    className="dark:bg-[#333] dark:text-white text-black bg-[#fff]"
                    value="user"
                  >
                    User
                  </option>
                </select>
                <input
                  type="submit"
                  value="Add"
                  className={`${style.btn} mt-3 !w-[70%] !h-[30px]  !mx-auto`}
                />
              </form>
            </div>
          </Box>
        </Modal>
      </div>
      <div>
        <Modal
          open={open2}
          onClose={() => setOpen2(false)}
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
                  onClick={() => setOpen2(false)}
                >
                  Cancel
                </button>
                <button
                  className={`${style.btn} mt-3 !w-[30%] !h-[30px]  !mx-auto !bg-[crimson]`}
                  onClick={() => handleDelete(userId)}
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

export default AllUsers;
