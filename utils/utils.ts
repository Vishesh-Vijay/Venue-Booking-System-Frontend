import { auth } from "@/app/firebase";
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

interface createBookingProps {
  title: string;
  description: string;
  user_id: string;
  venue_id: string;
  booking_type: string;
  event_time: Date;
  event_duration: Number;
  expected_strength: Number;
}
interface addNewUserProps {
  email: string;
  name: string;
  parent: string;
  require_parent_permission: Boolean;
  is_admin: Boolean;
  is_authority: Boolean;
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
export const getAllUsers = async (credentials: string) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/users/details/all/`,
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

export const DeleteUser = async (email: string, credentials: string) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/users/remove/`,
      {
        email: email,
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
export const addNewUser = async (
  props: addNewUserProps,
  credentials: string
) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/users/add/`,
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
export const UpdateExistingUser = async (credentials: string) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/users/update/`,
      {},
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

export const getVenuesByAuthority = async (credentials:string,authority_id:string) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/venues/details/byAuthority/${authority_id}/`,
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
export const getVenueDetailsById = async (
  venue_id: string,
  credentials: string
) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/venues/details/${venue_id}/`,
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
export const addNewVenue = async (
  props: addNewVenueProps,
  credentials: string
) => {
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

export const UpdateExistingVenue = async (
  id: string,
  newVenue: string,
  authority: string,
  build_id: string,
  floor: string,
  capacity: string,
  venueType: string,
  accessible: string,
  airConditioner: string,
  projectors: string,
  speakers: string,
  whiteboard: string,
  credentials: string
) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/venues/update/`,
      {
        id,
        name: newVenue,
        authority_id: authority,
        building_id: build_id,
        floor_number: Number(floor),
        seating_capacity: Number(capacity),
        venue_type: venueType,
        is_accessible: accessible === "true" ? true : false,
        has_air_conditioner: airConditioner === "true" ? true : false,
        has_projectors: projectors === "true" ? true : false,
        has_speakers: speakers === "true" ? true : false,
        has_whiteboard: whiteboard === "true" ? true : false,
        credentials,
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

export const DeleteVenue = async (id: string, credentials: string) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/venues/remove/`,
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

export const createBooking = async (
  props: createBookingProps,
  credentials: string
) => {
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
  } catch (error: any) {
    return error;
  }
};

export const getAllBookings = async (user_id: string, credentials: string) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/bookings/details/byUser/${user_id}/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: credentials,
        },
      }
    );
    return response;
  } catch (error: any) {
    return error;
  }
};

export const getBookingDetails = async (id: string, credentials: string) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/bookings/details/${id}/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: credentials,
        },
      }
    );
    return response;
  } catch (error: any) {
    return error;
  }
};

export const getBookingRequestsByUser = async (
  receiver_id: string,
  credentials: string
) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/bookings/bookingRequests/byReceiver/${receiver_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: credentials,
        },
      }
    );
    return response;
  } catch (error: any) {
    return error;
  }
};

export const updateBookingRequest = async (
  id: string,
  request_status: string,
  credentials: string
) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/bookings/bookingRequests/update/`,
      { id, request_status },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: credentials,
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const getBookingRequestDetails = async (
  id: string,
  credentials: string
) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/bookings/bookingRequests/details/${id}/`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: credentials,
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const cancelBooking = async (
  booking_id: string,
  credentials: string
) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/bookings/cancel/`,
      { booking_id },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: credentials,
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};
