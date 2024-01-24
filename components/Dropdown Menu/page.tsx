import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  User,
} from "@nextui-org/react";

const DropdownComponent = () => {
  return (
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
          <DropdownItem key="settings" className="p-1">My Settings</DropdownItem>
          {/* <DropdownItem key="team_settings">Team Settings</DropdownItem>
          <DropdownItem key="analytics">Analytics</DropdownItem>
          <DropdownItem key="system">System</DropdownItem>
          <DropdownItem key="configurations">Configurations</DropdownItem>
          <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem> */}
          <DropdownItem key="logout" className="p-1" color="danger">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
export default DropdownComponent;
