import { LoaderFunction } from "react-router-dom";
 
export const app: LoaderFunction = ({ request, params, context }) => {
    return request;
}