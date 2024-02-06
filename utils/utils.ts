import axios, { AxiosRequestConfig } from "axios";
interface userDataProps {
  name: string;
  email: string;
  //   profile_picture: string;
}

interface addNewVenueProps {
  name: string;
  authority_id: string;
  building_id: string;
  floor_number: Number;
  seating_capacity: Number;
  venue_type: String;
  is_accessible: Boolean;
  has_air_conditioner: Boolean;
  has_projectors: Boolean;
  has_speakers: Boolean;
  has_whiteboard: Boolean;
}

interface createBookingProps{
  title:string,
  description:string,
  user_id:string,
  venue_id:string,
  booking_type:string,
  event_time:Date,
  event_duration:Number,
  expected_strength:Number,

}
export const loginUser = async (
  user_data: userDataProps,
  credentials: string
) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/users/login/",
      user_data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: credentials,
        },
      }
    );
    // Extracting the JSON data from the response

    // console.log(jsonData,status);
    return response;
  } catch (error) {
    console.error("Error:", error);

    // throw error;
  }
};

export const getUserDetailsByEmail = async (
  email: string,
  credentials: string
) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/users/details/${email}/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: credentials,
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
    // throw error
  }
};

export const getAllBuildings = async (credentials: string) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/buildings/details/all/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: credentials,
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
    // throw error;
  }
};

export const getBuildingDetailsById = async (
  building_id: string,
  credentials: string
) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/buildings/details/${building_id}/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: credentials,
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
    // throw error;
  }
};
export const addNewBuilding = async (name: string, credentials: string) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/buildings/add/`,
      { name: name },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: credentials,
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
    //  throw error;
  }
};

export const UpdateExistingBuilding = async (
  id: string,
  name: string,
  credentials: string
) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/buildings/update/`,
      {
        id: id,
        name: name,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: credentials,
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
    //  throw error;
  }
};

export const DeleteBuilding = async (id: string, credentials: string) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/buildings/remove/`,
      {
        id: id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: credentials,
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
    //  throw error;
  }
};

export const getAllVenues = async (credentials: string) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/venues/details/all/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: credentials,
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
    // throw error;
  }
};

export const addNewVenue = async (props: addNewVenueProps,credentials:string) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/venues/add/`,
      props,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: credentials,
        },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
    //  throw error;
  }
};

export const createBooking = async(props:createBookingProps,credentials:string) =>{
  try {
   const response = await axios.post(
     `http://127.0.0.1:8000/bookings/add/`,
     props,
     {
       headers: {
         "Content-Type": "application/json",
         Authorization: credentials,
       },
     }
   );
   return response;  
  } catch (error:any) {
    return error 
  }
  
}