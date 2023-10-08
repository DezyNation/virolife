"use client";
import { useState } from "react";
import BackendAxios from "../axios";
import Cookies from "js-cookie";
import { useToast } from "@chakra-ui/react";

const useAuth = () => {
  const Toast = useToast({ position: "top-right" });
  const [authUser, setAuthUser] = useState(null);
  const [myRole, setMyRole] = useState("");

  const fetchMyInfo = async () => {
    await BackendAxios.get("/auth-user")
      .then((res) => {
        setAuthUser(res.data[0]);
        localStorage.setItem("userName", res.data[0]?.name);
        localStorage.setItem("userId", res.data[0]?.id);
        localStorage.setItem("onHold", res.data[0]?.on_hold);
        localStorage.setItem("primaryActive", res.data[0]?.primary_activated);
        localStorage.setItem(
          "secondaryActive",
          res.data[0]?.secondary_activated
        );
        localStorage.setItem("myPlan", res.data[0]?.subscription?.plan?.id);
        Cookies.set("adPoints", res.data[0]?.ad_points);
        Cookies.set("healthPoints", res.data[0]?.health_points);
        Cookies.set("viroPoints", res.data[0]?.virolife_points);
        localStorage.setItem(
          "myRole",
          res.data[0]?.roles?.length ? res.data[0]?.roles[0]?.name : ""
        );
        setMyRole(
          res.data[0]?.roles?.length ? res.data[0]?.roles[0]?.name : ""
        );
        if (res.data[0].parent_id) {
          localStorage.setItem("primaryParentId", res.data[0]?.parent_id);
        }
        if (res.data[0].secondary_parent_id) {
          localStorage.setItem(
            "secondaryParentId",
            res.data[0]?.secondary_parent_id
          );
        }
      })
      .catch((err) => {
        if (err?.response?.status == 401) {
          Cookies.remove("jwt");
          localStorage.clear();
          window.location.assign("/");
          return;
        }
        Toast({
          status: "error",
          description:
            err?.response?.data?.message || err?.response?.data || err?.message,
        });
      });
  };
  return {
    fetchMyInfo,
    authUser,
    myRole,
  };
};

export default useAuth;