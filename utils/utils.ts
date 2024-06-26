import { auth } from "@/app/firebase";
import axios, { AxiosRequestConfig } from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/";
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

interface addNewVHVenueProps {
    name: string;
    authority_id: string;
    building_id: string;
    floor_number: Number;
    accomodation_type: String;
}
interface createBookingProps {
    title: string;
    description: string;
    user_id: string;
    venue_id: string;
    booking_type: string;
    event_time: string;
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
interface VHBooking {
    user_id: string;
    user_address: string;
    user_contact: string;
    arrival_time: string;
    departure_time: string;
    rooms_required: number;
    booking_purpose: string;
    booking_type: string;
    requestby: string;
    id_proof: File | null;
}
export const loginUser = async (
    user_data: userDataProps,
    credentials: string
) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/users/login/`,
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
            `${API_BASE_URL}/users/details/${email}/`,
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
        const response = await axios.get(`${API_BASE_URL}/users/details/all/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: credentials,
            },
        });
        return response;
    } catch (error) {
        console.log(error);
        // throw error;
    }
};

export const DeleteUser = async (email: string, credentials: string) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/users/remove/`,
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
        const response = await axios.post(`${API_BASE_URL}/users/add/`, props, {
            headers: {
                "Content-Type": "application/json",
                Authorization: credentials,
            },
        });
        return response;
    } catch (error) {
        console.log(error);
        //  throw error;
    }
};
export const UpdateExistingUser = async (
    email: string,
    name: string,
    parent: string,
    require_parent_permission: string,
    is_admin: string,
    is_authority: string,
    credentials: string
) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/users/update/`,
            {
                email,
                name,
                parent,
                require_parent_permission:
                    require_parent_permission === "true" ? true : false,
                is_admin: is_admin === "true" ? true : false,
                is_authority: is_authority === "true" ? true : false,
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

export const getAllBuildings = async (credentials: string) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/buildings/details/all/`,
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
            `${API_BASE_URL}/buildings/details/${building_id}/`,
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
export const addNewBuilding = async (
    name: string,
    building_picture: File | null,
    credentials: string
) => {
    try {
        const formData = new FormData();
        formData.append("name", name);
        if (building_picture) {
            formData.append("building_picture", building_picture);
        }
        const response = await axios.post(
            `${API_BASE_URL}/buildings/add/`,
            formData,
            {
                headers: {
                    Authorization: credentials,
                },
            }
        );
        return response;
    } catch (error) {
        console.log(error);
    }
};

export const UpdateExistingBuilding = async (
    id: string,
    name: string,
    building_picture: File | null,
    credentials: string
) => {
    try {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("name", name);
        if (building_picture) {
            formData.append("building_picture", building_picture);
        }
        const response = await axios.post(
            `${API_BASE_URL}/buildings/update/`,
            formData,
            {
                headers: {
                    Authorization: credentials,
                },
            }
        );
        return response;
    } catch (error) {
        console.log(error);
    }
};

export const DeleteBuilding = async (id: string, credentials: string) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/buildings/remove/`,
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
            `${API_BASE_URL}/venues/details/all/`,
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
            `${API_BASE_URL}/venues/details/${venue_id}/`,
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
export const getVenuesByAuthority = async (
    authority_id: string,
    credentials: string
) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/venues/details/byAuthority/${authority_id}/`,
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
    }
};

export const getVenueByBuilding = async (
    buildingId: string,
    credentials: string
) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/venues/details/byBuilding/${buildingId}/`,
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
    }
};
export const addNewVenue = async (
    props: addNewVenueProps,
    credentials: string
) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/venues/add/`,
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
            `${API_BASE_URL}/venues/update/`,
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
            `${API_BASE_URL}/venues/remove/`,
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
            `${API_BASE_URL}/bookings/add/`,
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
            `${API_BASE_URL}/bookings/details/byUser/${user_id}/`,
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
            `${API_BASE_URL}/bookings/details/${id}/`,
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
export const getBookingDetailsByVenue = async (
    venue_id: string,
    credentials: string
) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/bookings/details/byVenue/${venue_id}`,
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
            `${API_BASE_URL}/bookings/bookingRequests/byReceiver/${receiver_id}`,
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
            `${API_BASE_URL}/bookings/bookingRequests/update/`,
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
            `${API_BASE_URL}/bookings/bookingRequests/details/${id}/`,

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
export const editBooking = async (
    booking_id: string,
    event_time: string,
    event_duration: number,
    credentials: string
) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/bookings/update/time/`,
            {
                booking_id,
                event_time,
                event_duration,
            },
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
export const cancelBooking = async (
    booking_id: string,
    credentials: string
) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/bookings/cancel/`,
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

export const getCommentsByBooking = async (
    booking_id: string,
    credentials: string
) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/comments/byBooking/${booking_id}/`,
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

export const postComment = async (
    booking_id: string,
    user_id: string,
    comment_content: string,
    credentials: string
) => {
    console.log(booking_id, user_id, comment_content, credentials);
    try {
        const response = await axios.post(
            `${API_BASE_URL}/comments/add/`,
            {
                booking_id: booking_id,
                user_id: user_id,
                comment_content: comment_content,
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
        return error;
    }
};

// interface VHBooking {
//     user_id: string;
//     user_address: string;
//     user_contact: string;
//     arrival_time: string;
//     departure_time: string;
//     rooms_required: Number;
//     booking_purpose: string;
//     booking_type: string;
//     requestby: string;
//     id_proof: File | null;
// }

export const createVHBooking = async (
    props: VHBooking,
    credentials: string
) => {
    try {
        const formData = new FormData();
        formData.append("user_id", props.user_id);
        formData.append("user_address", props.user_address);
        formData.append("user_contact", props.user_contact);
        formData.append("arrival_time", props.arrival_time);
        formData.append("departure_time", props.departure_time);
        formData.append("rooms_required", props.rooms_required);
        formData.append("booking_purpose", props.booking_purpose);
        formData.append("booking_type", props.booking_type);
        formData.append("requestby", props.requestby);
        if (props.id_proof) {
            formData.append("id_proof", props.id_proof);
        }
        const response = await axios.post(
            `${API_BASE_URL}/vhbookings/add/`,
            formData,
            {
                headers: {
                    Authorization: credentials,
                },
            }
        );
        return response;
    } catch (error: any) {
        return error;
    }
};

export const deleteVHVenue = async (venue_id: string, credentials: string) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/vhvenues/remove/`,
            {
                id: venue_id,
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
        return error;
    }
};

export const UpdateExistingVHVenue = async (
    id: string,
    newVenue: string,
    authority: string,
    build_id: string,
    floor: string,
    accomodationType: string,
    credentials: string
) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/vhvenues/update/`,
            {
                id,
                name: newVenue,
                authority_id: authority,
                building_id: build_id,
                floor_number: Number(floor),
                accomodation_type: accomodationType,
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

export const addNewVHVenue = async (
    props: addNewVHVenueProps,
    credentials: string
) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/vhvenues/add/`,
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

export const getAllVHVenues = async (credentials: string) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/vhvenues/details/all/`,
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

export const getVHVenuesByAuthority = async (
    authority_id: string,
    credentials: string
) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/vhvenues/details/byAuthority/${authority_id}/`,
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
    }
};

export const getAllVHBookings = async (
    user_id: string,
    credentials: string
) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/vhbookings/details/byUser/${user_id}/`,
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

export const cancelVHBooking = async (
    booking_id: string,
    credentials: string
) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/vhbookings/cancel/`,
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

export const getVHBookingRequestsByUser = async (
    receiver_id: string,
    credentials: string
) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/vhbookings/bookingRequests/byReceiver/${receiver_id}`,
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

export const getVHBookingDetails = async (id: string, credentials: string) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/vhbookings/details/${id}/`,
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

export const getVHBookingRequestDetails = async (
    id: string,
    credentials: string
) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/vhbookings/bookingRequests/details/${id}/`,

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
export const updateVHBookingRequest = async (
    id: string,
    request_status: string,
    credentials: string
) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/vhbookings/bookingRequests/update/`,
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
