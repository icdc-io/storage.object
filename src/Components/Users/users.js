import { Button } from "container/Button";
import ErrorScreen from "container/ErrorScreen";
import Loader from "container/Loader";
import { Segment } from "container/Segment";
import { Meh } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchS3Users } from "../../AppActions";
import UserModal from "./userModal";
import UsersList from "./usersList";

const Users = () => {
	const { t } = useTranslation();
	const s3users = useSelector((state) => state.AmazonStore.s3users);
	const s3usersFetchStatus = useSelector(
		(state) => state.AmazonStore.s3usersFetchStatus,
	);
	const user = useSelector((state) => state.host.user);
	const s3quotasFetchStatus = useSelector(
		(state) => state.AmazonStore.s3quotasFetchStatus,
	);
	const poolsFetchStatus = useSelector(
		(state) => state.AmazonStore.poolsFetchStatus,
	);
	const dispatch = useDispatch();
	const editModalRef = useRef();

	const onEditBucketModalOpen = (instance) => () => {
		if (editModalRef.current) {
			editModalRef.current.handleClick(instance);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		dispatch(fetchS3Users());
	}, [dispatch, user]);

	const statuses = [s3usersFetchStatus, s3quotasFetchStatus, poolsFetchStatus];

	return (
		<Segment className="h-full flex flex-col">
			{statuses.includes("pending") && <Loader active inline="centered" />}
			{s3users.length === 0 && s3usersFetchStatus === "fulfilled" && (
				<div className="h-full m-auto flex flex-col justify-center">
					<div className="">
						<Meh size={64} className="mx-auto" />
						<h2>{t("noS3users")}</h2>
					</div>
					<br />
					<div className="flex">
						<Button onClick={onEditBucketModalOpen()} className="mx-auto">
							{t("create")}
						</Button>
					</div>
				</div>
			)}

			{s3usersFetchStatus === "rejected" && <ErrorScreen />}

			{s3users.length > 0 && s3usersFetchStatus === "fulfilled" && (
				<section className="h-full">
					<div>
						<div className="flex items-center justify-between">
							<h2>{t("s3users")}</h2>
							<Button onClick={onEditBucketModalOpen()}>{t("create")}</Button>
						</div>
					</div>
					<UsersList items={s3users} />
				</section>
			)}
			<UserModal ref={editModalRef} />
		</Segment>
	);
};

export default Users;
