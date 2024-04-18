import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import BuildingCard from "../BuildingCard/page";
import { TextField } from "@mui/material";
interface Building {
    id: string;
    name: string;
    building_picture: string;
}
interface BuildingSelectionProps {
    buildings: Building[];
    selectedBuildingId: string | null;
    onSelectBuilding: (buildingId: string) => void;
}

const BuildingSelection = ({
    buildings,
    selectedBuildingId,
    onSelectBuilding,
}: BuildingSelectionProps) => {
    const [filteredBuildings, setFilteredBuildings] = useState<Array<Building>>(
        []
    );
    const [searchQuery, setSearchQuery] = useState("");
    const filterBuildings = () => {
        let filtered = buildings;
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter((building) =>
                building.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredBuildings(filtered);
    };
    useEffect(() => {
        filterBuildings();
    }, [searchQuery, buildings]);
    return (
        <>
            <div className="text-2xl font-medium my-2 mx-6">
                Select Building
            </div>
            <div className="px-6 mt-6 flex items-center gap-4">
                <div className="w-1/2">
                    <TextField
                        id="search"
                        label="Search Building"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <ScrollArea className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-16 gap-x-6 mt-6 px-6">
                    {filteredBuildings.length > 0 ? (
                        filteredBuildings.map((building, index) => (
                            <div
                                key={index}
                                className="mt-2 flex flex-col justify-center items-center"
                            >
                                <BuildingCard
                                    name={building.name as string}
                                    id={building.id as string}
                                    building_picture={
                                        building.building_picture as string
                                    }
                                    showIcons={false}
                                    onSelect={() =>
                                        onSelectBuilding(building.id)
                                    }
                                    isSelected={
                                        selectedBuildingId === building.id
                                    }
                                />
                            </div>
                        ))
                    ) : (
                        <div className="w-full mt-12 text-center font-bold text-2xl">
                            No Buildings found!!
                        </div>
                    )}
                </div>
            </ScrollArea>
        </>
    );
};
export default BuildingSelection;
