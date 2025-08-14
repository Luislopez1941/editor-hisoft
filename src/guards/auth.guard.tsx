import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { PrivateRoutes, PublicRoutes } from "../models/routes"; // Importa PrivateRoutes y PublicRoutes
import useUserStore from "../store/General";

interface Props {
    privateValidation: boolean;
}

const PrivateValidationFragment = <Outlet />;
const PublicValidationFragment = <Navigate replace to={PrivateRoutes.CRM} />

export const AuthGuard = ({ privateValidation }: Props) => {
    const userState = useUserStore(state => state.user);
    return userState?.id ? (
        privateValidation ? (
            PrivateValidationFragment
        ) : (
            PublicValidationFragment
        )
    )   :   (
        <Navigate replace to={PublicRoutes.LOGIN} />
    )
};

export default AuthGuard;

