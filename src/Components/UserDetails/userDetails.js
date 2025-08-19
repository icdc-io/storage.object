import { Button } from "container/Button";
import Loader from "container/Loader";
import { Segment } from "container/Segment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "container/Tabs";
import React, { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
	clearS3UserFetchStatus,
	fetchBuckets,
	fetchS3User,
} from "../../AppActions";
import { isStatusDeleted } from "../../utils/isStatusLocked";
import BucketsList from "./Buckets/bucketsList";
import UserOverview from "./Overview/overview";
import Resources from "./Resources/resources";

const panes = [
	{
		name: "overviewTab",
		component: UserOverview,
	},
	{
		name: "resourcesTab",
		component: Resources,
	},
	{
		name: "bucketsTab",
		component: BucketsList,
	},
];

const UserDetails = () => {
	const { t } = useTranslation();

	const { userId } = useParams();
	const s3user = useSelector((state) => state.AmazonStore.s3user);
	const s3userFetchStatus = useSelector(
		(state) => state.AmazonStore.s3userFetchStatus,
	);
	const s3quotasFetchStatus = useSelector(
		(state) => state.AmazonStore.s3quotasFetchStatus,
	);
	const user = useSelector((state) => state.host.user);
	const [activeItem, setActiveItem] = useState(panes[0].name);

	const dispatch = useDispatch();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		dispatch(fetchS3User(userId));
	}, [dispatch, userId, user]);

	useEffect(() => {
		if (s3userFetchStatus === "rejected") {
			dispatch(clearS3UserFetchStatus());
			// history.push("/storage");
		}
	}, [dispatch, s3userFetchStatus]);

	if (isStatusDeleted(s3user)) return <Navigate to={".."} />;

	const statuses = [s3userFetchStatus, s3quotasFetchStatus];

	if (statuses.includes("pending")) return <Loader active inline="centered" />;

	return (
		<div className="page-layout h-full">
			<Link to=".." className="back_link">
				<Button variant="back">{t("back")}</Button>
			</Link>

			{s3userFetchStatus === "fulfilled" && (
				<Tabs
					value={activeItem}
					onValueChange={setActiveItem}
					className="h-full"
				>
					<TabsList>
						{panes.map((item) => (
							<TabsTrigger key={item.name} value={item.name}>
								{t(item.name)}
							</TabsTrigger>
						))}
					</TabsList>
					{panes.map((item) => {
						const Component = item.component;
						return (
							<TabsContent key={item.name} value={item.name} className="h-full">
								<Segment className="h-full flex flex-col">
									<Component s3user={s3user} />
								</Segment>
							</TabsContent>
						);
					})}
				</Tabs>
			)}
		</div>
	);
};

export default UserDetails;
