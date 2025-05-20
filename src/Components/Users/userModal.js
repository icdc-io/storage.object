import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "container/Modal";
import React, { useState, useImperativeHandle, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
	actionAndFetch,
	createS3user,
	editS3user,
	editS3userAndFetch,
} from "../../AppActions";
import UserForm from "./userForm";

const UserModal = (_props, ref) => {
	const { t } = useTranslation();
	const accountName = useSelector((state) => state.host.user.account);
	const currentOwner = useSelector((state) => state.host.user.email);

	const dispatch = useDispatch();
	const [open, setOpen] = useState(false);
	const [user, setUser] = useState();
	const edit = !!user;

	useImperativeHandle(ref, () => ({
		handleClick: (user) => {
			setUser(user);
			setOpen(true);
		},
	}));

	const mapPropsToApi = (item, edit) =>
		edit
			? {
					description: item.description,
					owner: item.owner || currentOwner,
					quota: {
						data_size_mb: +item.data_size_mb,
						objects: +item.objects,
						buckets: +item.buckets,
					},
				}
			: {
					name: item.name,
					description: item.description,
					owner: item.owner || currentOwner,
					pool_id: item.pool_id,
					account_name: accountName,
					quota: {
						data_size_mb: +item.data_size_mb,
						objects: +item.objects,
						buckets: +item.buckets,
					},
				};

	const mapApiToProps = (item) => ({
		name: item.name,
		description: item.description,
		pool_id: item.pool.id,
		data_size_mb: item.user_quota.data_size_mb || 0,
		objects: item.user_quota.objects || 0,
		buckets: item.user_quota.buckets || 0,
		owner: item.owner,
		user: user,
	});

	const handleClose = () => {
		setOpen(false);
		// setLimits({});
	};

	const onSubmit = (values) => {
		const payload = mapPropsToApi(values, edit);
		if (edit) {
			dispatch(actionAndFetch(editS3user, { user_id: user.id, payload })).then(
				handleClose,
			);
		} else {
			dispatch(actionAndFetch(createS3user, payload)).then(handleClose);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{edit ? t("editS3user") : t("createS3user")}
					</DialogTitle>
				</DialogHeader>

				<UserForm
					handleClose={handleClose}
					onSubmit={onSubmit}
					initialValues={edit ? mapApiToProps(user) : undefined}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default forwardRef(UserModal);
