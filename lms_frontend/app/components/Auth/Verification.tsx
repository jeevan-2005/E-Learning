import { useActivationMutation } from "../../../redux/features/auth/authApi";
import { style } from "../../styles/styles";
import React, { FC, useEffect, useRef, useState } from "react";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";

type Props = {
  setRoute: (route: string) => void;
};

type verifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const Verification: FC<Props> = ({ setRoute }) => {
  const [invalidError, setInvalidError] = useState<boolean>(false);
  const [verifyNumber, setVerifyNumber] = useState<verifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  const { token } = useSelector((state: any) => state.auth);
  const [activation, { isSuccess, error, isLoading }] = useActivationMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account verified successfully");
      setRoute("Login");
    }

    if (error && "data" in error) {
      setInvalidError(true);
      const errorData = error.data as { message?: string };
      toast.error(errorData?.message || "An error occurred");
    }
  }, [isSuccess, error]);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");
    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }
    await activation({
      activation_token: token,
      activation_code: verificationNumber,
    });
  };

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <div>
      <h1 className={`${style.title}`}>Verify Your Account</h1>
      <br />
      <div className="flex items-center justify-center w-full mt-2">
        <div className="w-[80px] h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center">
          <VscWorkspaceTrusted size={40} />
        </div>
      </div>
      <br />
      <br />
      <div className="w-full m-auto flex items-center justify-around">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="number"
            key={key}
            ref={inputRefs[index]}
            maxLength={1}
            className={`w-[65px] h-[65px] background-transparent border-[3px] rounded-[10px] flex items-center justify-center text-black dark:text-white text-[18px] font-Poppins outline-none text-center ${
              invalidError
                ? "border-red-500 shake"
                : "dark:border-white border-[#0000004a]"
            } `}
            placeholder=""
            value={verifyNumber[key as keyof verifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>
      <br />
      <br />
      <button
        className={`${style.btn}  ${
          isLoading && "!opacity-50 !cursor-not-allowed"
        }`}
        disabled={isLoading}
        onClick={verificationHandler}
      >
        {isLoading ? (
          <CircularProgress size={20} color="success" />
        ) : (
          "Verify-OTP"
        )}
      </button>
      <br />
      <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
        Go back to sign in?{" "}
        <span
          className="text-[#2190ff] cursor-pointer pl-1"
          onClick={() => setRoute("Sign-up")}
        >
          Sign-up
        </span>
      </h5>
    </div>
  );
};

export default Verification;
