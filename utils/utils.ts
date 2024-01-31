import axios, { AxiosRequestConfig } from "axios";
interface userDataProps {
  name: string;
  email: string;
//   profile_picture: string;
}

export const loginUser = async (user_data: userDataProps, credentials: string) => {
  try {
        const response = await axios
            .post("http://127.0.0.1:8000/users/login/", user_data, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: credentials,
                },
            });
        // Extracting the JSON data from the response
        
        // console.log(jsonData,status);
        return response;
    } catch (error) {
        console.error("Error:", error);

        throw error;
    }
};

export const getUserDetailsByEmail = async (email:string,credentials:string)=>{
    try {
       const response = await axios.get(
      `http://127.0.0.1:8000/users/details/${email}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: credentials,
        },
      }
    );
    return response 
    } catch (error) {
        console.log(error)
        throw error
    } 
}
