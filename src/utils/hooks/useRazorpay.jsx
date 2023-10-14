"use client";
import useApiHandler from "./useApiHandler";

const useRazorpay = () => {
  const { handleError } = useApiHandler();

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

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
  const payWithRazorpay = async ({
    amount,
    description,
    user,
    onSuccess,
    onFail,
  }) => {
    const res = await initializeRazorpay();

    if (!res) {
      alert("Razorpay SDK Failed to load");
      return;
    }

    // Make API call to the serverless API
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/razorpay`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
        }),
      }
    ).then((t) => {
      console.log(t);
      return t.json();
    });

    var options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
      name: "Virolife Foundation",
      currency: data.currency,
      amount: data.amount,
      order_id: data.id,
      description: description || "Thankyou for using Virolife",
      image: "https://avatars.githubusercontent.com/u/7713209?s=280&v=4",
      handler: function (response) {
        if (response.razorpay_payment_id) {
          onSuccess(response.razorpay_payment_id);
        } else {
          onFail();
        }
      },
      prefill: {
        name: user?.name || localStorage?.getItem("userName"),
        email: user?.email || localStorage?.getItem("email"),
        phone: user?.phone || ""
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return {
    initializeRazorpay,
    payWithRazorpay,
  };
};

export default useRazorpay;
