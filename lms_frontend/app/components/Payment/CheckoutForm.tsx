import { style } from "../../styles/styles";
import { useCreateOrderMutation } from "../../../redux/features/orders/ordersApi";
import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
type Props = {
  setOpen: (open: boolean) => void;
  course: any;
};

const CheckoutForm: FC<Props> = ({ setOpen, course }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<any>(null);
  const [createOrder, { data: orderData, error }] = useCreateOrderMutation();
  const [loadUser, setLoadUser] = useState(false);
  const { data } = useLoadUserQuery({ skip: loadUser ? false : true });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (error) {
      setMessage(error?.message);
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      await createOrder({ courseId: course._id, payment_info: paymentIntent });
    }
  };

  useEffect(() => {
    if (orderData) {
      setLoadUser(true);
      setIsLoading(false);
      toast.success("Payment successful");
      setOpen(false);
      redirect(`/course-access/${course._id}`);
    }
    if (error && "data" in error) {
      setIsLoading(false);
      const errorData = error.data as { message: string };
      const errorMessage = errorData.message;
      toast.error(errorMessage);
    }
  }, [orderData, error]);

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement id="link-authentication-element" />
      <PaymentElement id="payment-element" />
      <div className="w-full flex items-center justify-center mt-3">
        <button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          className="w-[50%]"
        >
          <span id="button-text" className={`${style.btn} my-2 !h-[35px]`}>
            {isLoading ? "Paying..." : "Pay now"}
          </span>
        </button>
      </div>
      {/* show any error or success msg */}
      {message && (
        <div id="payment-message" className="text-[red] font-Poppins pt-2">
          {message}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
