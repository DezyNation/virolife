"use client";
import { useEffect, useState } from "react";
import useApiHandler from "./useApiHandler";
import BackendAxios, { DefaultAxios } from "../axios";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const useRazorpay = () => {
  const { handleError } = useApiHandler();
  const { push } = useRouter();
  const [token, setToken] = useState("");
  useEffect(() => {
    setToken(Cookies.get("jwt"));
  }, []);

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v2/checkout.js";

      script.onload = () => {
        resolve(true);
      };
      script.onerror = (err) => {
        resolve(false);
        handleError(err, "Err while loading Razorpay");
      };

      document.body.appendChild(script);
    });
  };

  const submitrazorpayForm = async (order) => {
    try {
      const formdata = new FormData();
      formdata.append("key_id", process.env.NEXT_PUBLIC_RAZORPAY_KEY);
      formdata.append("order_id", order?.order_id);
      formdata.append("amount", order?.amount);
      formdata.append("name", "Virolife Foundation");
      formdata.append("description", order?.description);
      formdata.append(
        "callback_url",
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/verify-order"
      );
      formdata.append(
        "callback_url",
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/verify-order"
      );
      await axios.post(
        `https://api.razorpay.com/v1/checkout/embedded`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (err) {
      console.log(err);
      handleError({ message: "Err while creating razorpay checkout form" });
    }
  };

  const payWithRazorpay = async (params) => {
    const { amount, description, user, onSuccess, onFail } = params;
    // const res = await initializeRazorpay();

    // if (!res) {
    //   alert("Razorpay SDK Failed to load");
    //   return;
    // }

    // // Make API call to the serverless API
    // const data = await fetch(
    //   `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/razorpay`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       amount: amount,
    //     }),
    //   }
    // ).then((t) => {
    //   console.log(t);
    //   return t.json();
    // });

    // var options = {
    //   key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
    //   name: "Virolife Foundation",
    //   currency: data.currency,
    //   amount: data.amount,
    //   order_id: data.id,
    //   description: description || "Thankyou for using Virolife",
    //   image: "https://avatars.githubusercontent.com/u/7713209?s=280&v=4",
    //   handler: function (response) {
    //     if (response.razorpay_payment_id) {
    //       onSuccess(response.razorpay_payment_id);
    //     } else {
    //       onFail();
    //     }
    //   },
    //   prefill: {
    //     name: user?.name || localStorage?.getItem("userName"),
    //     email: user?.email || localStorage?.getItem("email"),
    //   },
    // };

    // const paymentObject = new window.Razorpay(options);
    // paymentObject.open();

    if (token) {
      await BackendAxios.post("/api/create-order", { ...params })
        .then(async (res) => {
          // await submitrazorpayForm({ ...res.data, ...params });
          push(
            `/payment?order_id=${res.data?.order_id}&amount=${res.data?.amount}&description=${description}`
          );
        })
        .catch((err) => {
          console.log(err);
          handleError({ message: "Notification while creating order" });
        });
    } else {
      await DefaultAxios.post("/api/create-order", { ...params })
        .then(async (res) => {
          // await submitrazorpayForm({ ...res.data, ...params });
          push(
            `/payment?order_id=${res.data?.order_id}&amount=${res.data?.amount}&description=${description}`
          );
        })
        .catch((err) => {
          console.log(err);
          handleError({ message: "Notification while creating order" });
        });
    }
  };

  return {
    initializeRazorpay,
    payWithRazorpay,
  };
};

export default useRazorpay;
