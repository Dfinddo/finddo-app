import React, {createContext, useState, FC} from "react";
import AuthStore from "stores/auth-store";

const AuthContext = createContext<AuthStore>(new AuthStore());

interface AuthData {
	token: any;
	user: any;
}

export {AuthContext};
