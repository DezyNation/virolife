"use client";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const page = () => {
  const searchParams = useSearchParams();
  const order_id = searchParams.get("order_id");
  const amount = searchParams.get("amount");
  const description = searchParams.get("description");

  useEffect(() => {
    document.getElementById("paymentForm").submit()
  }, [])

  return (
    <>
      <form
        action="https://api.razorpay.com/v1/checkout/embedded"
        method="POST" id="paymentForm"
      >
        <input
          type="hidden"
          name="key_id"
          value={process.env.NEXT_PUBLIC_RAZORPAY_KEY}
        />
        <input type="hidden" name="order_id" value={order_id} />
        <input type="hidden" name="name" value="Virolife Foundation" />
        <input type="hidden" name="description" value={description} />
        <input type="hidden" name="image" value="/logo.png" />
        <input type="hidden" name="amount" value={amount} />
        <input type="hidden" name="callback_url" value={process.env.NEXT_PUBLIC_BACKEND_URL + "/api/verify-order"} />
        <input type="hidden" name="cancel_url" value={process.env.NEXT_PUBLIC_FRONTEND_URL + "/payment/failed"} />
      </form>
    </>
  );
};

export default page;
