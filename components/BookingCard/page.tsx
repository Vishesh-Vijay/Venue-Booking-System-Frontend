import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
interface BookingCardProps{
    name:string,
    type:string,
    location:string,
    time:string,
    date:Date,
    approval:string
}
const BookingCard = (props:BookingCardProps) => {
  return (
    <Card className="bg-[#313465] text-white w-11/12">
      <CardHeader>
        <CardTitle>{props.name}</CardTitle>
        <CardDescription>{props.type}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{props.location}</p>
        <br />
        <p>
          {props.date.toDateString()} at {props.time}
        </p>
      </CardContent>
      <CardFooter>
        <p>{props.approval}</p>
      </CardFooter>
    </Card>
  );
}

export default BookingCard
