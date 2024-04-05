import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import BuildingCard from "../BuildingCard/page";
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
    return (
        <>
            <div className="text-2xl font-medium my-2 mx-6">
                Select Building
            </div>
            <ScrollArea className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-16 gap-x-6 mt-6 px-6">
                    {buildings.length > 0 ? (
                        buildings.map((building, index) => (
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
