"use client";
import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import Alert from "@mui/material/Alert";
import BuildingCard from "@/components/BuildingCard/page";
import { getAllBuildings } from "@/utils/utils";
import { useRouter } from "next/navigation";
interface Building{
    id:string,
    name:string,
}
const Building = () => {
  const router = useRouter();
  if (localStorage.getItem("admin") == "no") {
    router.push("/");
    return null;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [buildings, setBuildings] = useState<Array<Building>>([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [loading, setLoading] = React.useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showAlert, setShowAlert] = React.useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isError, setIsError] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [error, setError] = useState("");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const getBuildings = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const userDetails: any = await getAllBuildings(token as string).then(
          (res) => {
            const resp = res;
            if (resp.status == 200) {
              const data = resp.data.response_data;
              // console.log(data);
              
              setBuildings(data)
              setLoading(false);
              setShowAlert(true);
              setTimeout(() => {
                setShowAlert(false);
              }, 1000);
            }
          }
        );

        // console.log(userDetails);
      } catch (error: any) {
        // Handle error
        setIsError(true);
        setError(error.response.data.response_message);
        setTimeout(() => {
          setIsError(false);
          setError("");
        }, 3000);
      } finally {
        setLoading(false);
      }
    };
    getBuildings()
  },[]);
  console.log(buildings)
  return (
    <div className="p-4">
      <h1 className="text-center mt-4 font-semibold text-4xl">Buildings</h1>
      {loading == false ? (
        <div className="grid grid-cols-3 gap-y-16 gap-x-6 mt-6">
          {buildings.length > 0 ? (
            buildings.map((building, index) => (
              <div
                key={index}
                className="mt-2 flex flex-col justify-center items-center"
              >
                <BuildingCard name={building.name as string} />
              </div>
            ))
          ) : (
            <div className="w-full mt-12 text-center font-bold text-2xl">
              No Buildings found!!
            </div>
          )}
        </div>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

export default Building;
