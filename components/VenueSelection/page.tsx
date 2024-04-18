import { useState, useEffect } from "react";
import { CircularProgress, TextField, MenuItem, Box } from "@mui/material";
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
interface Building {
    id: string;
    name: string;
    building_picture: string;
}
interface VenueSelectionProps {
    venues: Venue[];
    selectedVenueId: string | null;
    onSelectVenue: (buildingId: string) => void;
    buildings: Building[];
}

const VenueSelection = ({
    venues,
    selectedVenueId,
    onSelectVenue,
    buildings,
}: VenueSelectionProps) => {
    const [filteredVenues, setFilteredVenues] = useState<Array<Venue>>([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [buildingFilter, setBuildingFilter] = useState(null);
    const [venueTypeFilter, setVenueTypeFilter] = useState(null);

    const venueTypeOptions = [
        "CLASSROOM",
        "LAB",
        "MEETING_ROOM",
        "AUDITORIUM",
        "OTHER",
    ];
    const filterVenues = () => {
        let filtered = venues;
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter((venue) =>
                venue.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (buildingFilter) {
            filtered = filtered.filter(
                (venue) => venue.building_id === buildingFilter
            );
        }

        if (venueTypeFilter) {
            filtered = filtered.filter(
                (venue) => venue.venue_type === venueTypeFilter
            );
        }
        setFilteredVenues(filtered);
    };
    const handleBuildingChange = (event: any) => {
        setBuildingFilter(event.target.value);
    };

    const handleVenueTypeChange = (event: any) => {
        setVenueTypeFilter(event.target.value);
    };
    useEffect(() => {
        filterVenues();
    }, [searchQuery, buildingFilter, venueTypeFilter, venues]);
    return (
        <>
            <div className="text-2xl font-medium my-2 mx-6">Select Venue</div>
            <div className="px-6 mt-6 flex items-center gap-4">
                <div className="w-1/2">
                    <TextField
                        id="search"
                        label="Search Venue"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="w-1/2">
                    <Box sx={{ minWidth: 120 }}>
                        <TextField
                            id="venue-type-filter"
                            select
                            label="Filter by Venue Type"
                            variant="outlined"
                            fullWidth
                            value={venueTypeFilter}
                            onChange={handleVenueTypeChange}
                        >
                            {venueTypeOptions.map((venueType) => (
                                <MenuItem key={venueType} value={venueType}>
                                    {venueType}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {filteredVenues.length > 0 ? (
                    filteredVenues.map((venue) => (
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
                            <div className="text-gray-500">
                                {venue.venue_type}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="w-full mt-12 text-center font-bold text-2xl">
                        No Venues found!!
                    </div>
                )}
            </div>
        </>
    );
};
export default VenueSelection;
