import { useGetSingleCourseDetailsQuery } from "../../../redux/features/course/courseApi";
import React, { FC, useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "../../utils/Heading";
import Header from "../Header";
import Footer from "../Footer";
import CourseDetails from "./CourseDetails";
import {
  useCreatePaymentMutation,
  useGetStripePublishabeKeyQuery,
} from "../../../redux/features/orders/ordersApi";
import { loadStripe } from "@stripe/stripe-js";

type Props = {
  id: string;
};

const CourseDetailsPage: FC<Props> = ({ id }) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetSingleCourseDetailsQuery(id, {});
  const { data: config } = useGetStripePublishabeKeyQuery({});
  const [createPayment, { data: paymentIntentData }] =
    useCreatePaymentMutation();
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (config) {
      const publishableKey = config.publishableKey;
      setStripePromise(loadStripe(publishableKey));
    }
    if (data) {
      const amount = Math.round(data?.course?.price * 100);
      createPayment(amount);
    }
  }, [config, data]);

  useEffect(() => {
    if (paymentIntentData) {
      setClientSecret(paymentIntentData?.clientSecret);
    }
  }, [paymentIntentData]);

  if (isLoading) return <Loader />;

  return (
    <div>
      <Heading
        title={data?.course?.name + " - E-Learning"}
        description="E-Learning Platform for student to learn and get help with their courses from teachers."
        keywords={data?.course?.tags}
      />
      <Header
        open={open}
        setOpen={setOpen}
        route={route}
        setRoute={setRoute}
        activeItem={1}
      />
      {stripePromise && (
        <CourseDetails
          setOpen={setOpen}
          setRoute={setRoute}
          course={data?.course}
          stripePromise={stripePromise}
          clientSecret={clientSecret}
        />
      )}
      <Footer />
    </div>
  );
};

export default CourseDetailsPage;
