
import axios, { AxiosRequestConfig } from "axios";
interface userDataProps{
    name:string,
    email:string,
    profilePic:string,
}


export const LoginUser = (
    userData: userDataProps,
    credentials: string
) => {
    const config: AxiosRequestConfig<userDataProps> = {
        headers: {
            Authorization: credentials,
        },
    };
    const response = axios.post(
        "http://127.0.0.1:8000/users/login",
        userData,
        config
    );

    console.log(response);
    return response;
};
