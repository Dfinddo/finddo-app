import {createContext} from "react";
import UserStore from "stores/user-store";

const UserContext = createContext<UserStore>(new UserStore());

export {UserContext};
