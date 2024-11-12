"use client";
import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillGithub,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { style } from "../../styles/styles";
import { useLoginMutation } from "../../../redux/features/auth/authApi";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { CircularProgress } from "@mui/material";

type Props = {
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
  refetch?: any;
};

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email!"),
  password: Yup.string().required("Please enter your password!").min(6),
});

const Login: FC<Props> = ({ setRoute, setOpen, refetch }) => {
  const [show, setShow] = useState(false);
  const [login, { error, isSuccess, data, isLoading }] = useLoginMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Login successful!";
      setOpen(false);
      toast.success(message);
      refetch();
    }
    if (error && "data" in error) {
      const errorData = error.data as { message?: string };
      const errorMessage = errorData?.message || "An error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, error]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      const data = { email, password };
      await login(data);
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  // if(isLoading) return <Loader />

  return (
    <div className="w-full">
      <h1 className={`${style.title} mb-5`}>Login with E-Learning</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" className={`${style.label}`}>
          Enter your Email
        </label>
        <input
          type="email"
          name=""
          value={values.email}
          onChange={handleChange}
          id="email"
          placeholder="loginmail@gmail.com"
          className={`${errors.email && touched.email && "border-red-500"} ${
            style.input
          }`}
        />
        {errors.email && touched.email && (
          <span className="text-red-500 pt-2 block">{errors.email}</span>
        )}
        <div className="w-full mt-5 relative mb-1">
          <label htmlFor="password" className={`${style.label}`}>
            Enter your Password
          </label>
          <input
            type={show ? "text" : "password"}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="password!@%"
            className={`${
              errors.password && touched.password && "border-red-500"
            } ${style.input}`}
          />
          {!show ? (
            <AiOutlineEyeInvisible
              size={20}
              onClick={() => setShow(true)}
              className="absolute bottom-[9px] right-3 z-1 cursor-pointer"
            />
          ) : (
            <AiOutlineEye
              size={20}
              onClick={() => setShow(false)}
              className="absolute bottom-[9px] right-3 z-1 cursor-pointer"
            />
          )}
        </div>
        {errors.password && touched.password && (
          <span className="text-red-500 pt-1 block">{errors.password}</span>
        )}
        <div className="w-full mt-8">
          <button
            type="submit"
            className={`${style.btn}  ${
              isLoading && "!opacity-50 !cursor-not-allowed"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={20} color="success" />
            ) : (
              "Login"
            )}
          </button>
        </div>
        <br />
        <h5 className="text-center pt-4 text-black dark:text-white font-Poppins text-[16px]]">
          Or login with
        </h5>
        <div className="flex items-center justify-center my-3">
          <FcGoogle
            size={30}
            className="mr-2 cursor-pointer"
            onClick={() => signIn("google")}
          />
          <AiFillGithub
            size={30}
            className="ml-2 cursor-pointer text-black dark:text-white"
            onClick={() => signIn("github")}
          />
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
          Not have an account?{" "}
          <span
            className="text-[#2190ff] cursor-pointer pl-1"
            onClick={() => setRoute("Sign-up")}
          >
            Sign-up
          </span>
        </h5>
      </form>
    </div>
  );
};

export default Login;
