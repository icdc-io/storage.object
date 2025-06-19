import { Button } from "container/Button";
import { Segment } from "container/Segment";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchS3Users } from "../../AppActions";
import UserModal from "./userModal";
import UsersList from "./usersList";

const Users = () => {
	const { t } = useTranslation();
	const user = useSelector((state) => state.host.user);

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

	return (
		<Segment className="h-full flex flex-col">
			<section className="h-full flex flex-col gap-4">
				<div>
					<div className="flex items-center justify-between">
						<h2 className="page-title">{t("s3users")}</h2>
						<Button onClick={onEditBucketModalOpen()}>{t("create")}</Button>
					</div>
				</div>
				<UsersList />
			</section>

			<UserModal ref={editModalRef} />
		</Segment>
	);
};

export default Users;
