import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AdditionalBookingDetailsProps {
    title: string;
    description: string;
    bookingType: string;
    bookingTypeOptions: string[];
    expectedStrength: number;
    onTitleChange: (title: string) => void;
    onDescriptionChange: (description: string) => void;
    onBookingTypeChange: (bookingType: string) => void;
    onExpectedStrengthChange: (expectedStrength: string) => void;
}

const AdditionalBookingDetails: React.FC<AdditionalBookingDetailsProps> = ({
    title,
    description,
    bookingType,
    bookingTypeOptions,
    expectedStrength,
    onTitleChange,
    onDescriptionChange,
    onBookingTypeChange,
    onExpectedStrengthChange,
}) => {
    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onTitleChange(event.target.value);
    };

    const handleDescriptionChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        onDescriptionChange(event.target.value);
    };

    const handleExpectedStrengthChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        onExpectedStrengthChange(event.target.value);
    };

    const handleBookingTypeChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        onBookingTypeChange(event.target.value);
    };

    return (
        <>
            <div className="flex flex-wrap">
                <div className=" w-1/2 px-4">
                    <div className="mt-6">
                        <Label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Title
                        </Label>
                        <Input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => onTitleChange(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                </div>
                <div className="w-1/2 px-4">
                    <div className="mt-6">
                        <Label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) =>
                                onDescriptionChange(e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap">
                <div className="w-1/2 px-4">
                    <div className="mt-6">
                        <Label
                            htmlFor="bookingType"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Booking Type
                        </Label>
                        <div className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <Select
                                value={bookingType}
                                onValueChange={(e) => onBookingTypeChange(e)}
                                required
                            >
                                <SelectTrigger className="w-2/3">
                                    <SelectValue placeholder="Booking Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {bookingTypeOptions.length > 0 ? (
                                        bookingTypeOptions.map(
                                            (option, index) => (
                                                <div key={index}>
                                                    <SelectItem value={option}>
                                                        {option}
                                                    </SelectItem>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <p>
                                            No buildings to select! Create one
                                            first
                                        </p>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <div className="w-1/2 px-4">
                    <div className="mt-6">
                        <Label
                            htmlFor="expectedStrength"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Expected Strength
                        </Label>
                        <Input
                            id="expectedStrength"
                            type="number"
                            value={expectedStrength}
                            onChange={(e) =>
                                onExpectedStrengthChange(e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdditionalBookingDetails;
