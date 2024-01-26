'use client'
import React, { useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  User,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../app/firebase";
import { Alert } from "@mui/material";
import { useState } from "react";
import { Spinner } from "@nextui-org/react";
const DropdownComponent = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);


  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    setLoading(true);
    signOut(auth)
      .then(() => {
        localStorage.removeItem("token");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          router.push("/auth/login"); // Redirect after logout
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
        setIsError(true);
        setError(error.response?.data?.response_message || "An error occurred");
        setTimeout(() => {
          setIsError(false);
          setError("");
        }, 3000);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
     (
      <div className="flex items-center gap-4">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Profile Actions"
            variant="flat"
            className="bg-[#313465] p-3 rounded-md text-white"
          >
            <DropdownItem key="settings" className="p-1">
              My Settings
            </DropdownItem>
            {/* <DropdownItem key="team_settings">Team Settings</DropdownItem>
          <DropdownItem key="analytics">Analytics</DropdownItem>
          <DropdownItem key="system">System</DropdownItem>
          <DropdownItem key="configurations">Configurations</DropdownItem>
          <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem> */}
            <DropdownItem
              key="logout"
              className="p-1"
              color="danger"
              onClick={handleLogout}
            >
              {loading && <Spinner label="loading..." className="mt-4" />}
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        {showAlert && <Alert severity="success">Logout Successful</Alert>}
      </div>
    )
  );
};
export default DropdownComponent;
