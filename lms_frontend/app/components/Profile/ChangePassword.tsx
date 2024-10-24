import React, { FC, useEffect, useState } from "react";
import { style } from "../../styles/styles";
import { useUpdatePasswordMutation } from "../../../redux/features/user/userApi";
import toast from "react-hot-toast";

type Props = {};

const ChangePassword: FC<Props> = (props) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();

  const handlePasswordChangeForm = async (e: any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("confirm password does not match with new password");
    } else {
      await updatePassword({ oldPassword, newPassword });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password changed successfully");
    }

    if (error && "data" in error) {
      const errorData = error.data as { message?: string };
      const errorMessage = errorData?.message || "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, error]);

  return (
    <div className="w-full pl-7 px-2 800px:pl-0 800px:px-5">
      <h1 className="block text-[25px] 800px:text-[30px] font-Poppins font-[500] text-black dark:text-white text-center pb-2">
        Change Password
      </h1>
      <div className="w-full">
        <form
          onSubmit={handlePasswordChangeForm}
          className="flex flex-col items-center"
        >
          <div className="w-[100%] 800px:w-[60%] mt-5">
            <label
              htmlFor="oldPassword"
              className="block pb-2 text-black dark:text-white"
            >
              Enter your old password
            </label>
            <input
              type="password"
              name="oldPassword"
              id="oldPassword"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={`${style.input}  mb-4 800px:mb-0`}
            />
          </div>
          <div className="w-[100%] 800px:w-[60%] mt-5">
            <label
              htmlFor="newPassword"
              className="block pb-2 text-black dark:text-white"
            >
              Enter your new password
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`${style.input}  mb-4 800px:mb-0`}
            />
          </div>
          <div className="w-[100%] 800px:w-[60%] mt-5">
            <label
              htmlFor="confirmPassword"
              className="block pb-2 text-black dark:text-white"
            >
              Confirm your password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${style.input}  mb-4 800px:mb-0`}
            />
          </div>
          <input
            type="submit"
            value="Update"
            required
            className={`${style.btn} !w-[50%] m-auto mt-10 !py-2 !min-h-0`}
          />
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
