import { useState } from "react";
interface Venue {
    authority_id: string;
    building_id: string;
    floor_number: Number;
    has_air_conditioner: Boolean;
    has_projectors: Boolean;
    has_speakers: Boolean;
    has_whiteboard: Boolean;
    id: string;
    is_accessible: Boolean;
    name: string;
    seating_capacity: Number;
    venue_type: string;
}
interface VenueSelectionProps {
    venues: Venue[];
    selectedVenueId: string | null;
    onSelectVenue: (buildingId: string) => void;
}

const VenueSelection = ({
    venues,
    selectedVenueId,
    onSelectVenue,
}: VenueSelectionProps) => {
    return (
        <>
            <div className="text-2xl font-medium my-2 mx-6">Select Venue</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {venues.map((venue) => (
                    <div
                        key={venue.id}
                        className={` bg-white border rounded p-4 ${
                            selectedVenueId === venue.id
                                ? "border-4 border-green-500"
                                : ""
                        }`}
                        onClick={() => onSelectVenue(venue.id)}
                    >
                        <div className="text-lg font-semibold mb-2">
                            {venue.name}
                        </div>
                        <div className="text-gray-500">{venue.venue_type}</div>
                    </div>
                ))}
            </div>
        </>
    );
};
export default VenueSelection;
