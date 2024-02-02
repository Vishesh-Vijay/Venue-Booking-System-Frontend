/* eslint-disable react/jsx-no-undef */

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
import { MdDeleteOutline } from "react-icons/md";

interface BuildingCardProps {
  name: string;
}
const BuildingCard = ({ name }: BuildingCardProps) => {
  return (
    <Card className="w-full">
      <Image
        src="/building.jpg"
        alt="building"
        width={400}
        height={400}
        className="w-full rounded-t-lg"
      />
      <div className="flex justify-between items-center w-full">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <MdDeleteOutline className="text-red-500 w-5 h-5 mr-4" />
      </div>
    </Card>
  );
};

export default BuildingCard;
