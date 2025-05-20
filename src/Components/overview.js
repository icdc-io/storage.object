import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const Users = React.lazy(() => import("./Users/users"));
const Quotas = React.lazy(() => import("./Users/Quotas/quotas"));
const UserDetails = React.lazy(() => import("./UserDetails/userDetails"));

const Overview = () => {
	return (
		<div className="storage_objects">
			<Quotas />
			<div className="h-full">
				<Routes>
					<Route path={"/"} Component={Users} />
					<Route path={":userId"} Component={UserDetails} />
					<Route path="*" element={<Navigate to={"/"} replace />} />
				</Routes>
			</div>
		</div>
	);
};

export default Overview;
