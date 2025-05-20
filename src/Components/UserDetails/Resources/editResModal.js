import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "container/Modal";
import PropTypes from "prop-types";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionAndFetch, editS3user } from "../../../AppActions";
import EditResForm from "./editResForm";

const EditResModal = ({ label }, ref) => {
	const dispatch = useDispatch();
	const [open, setOpen] = useState(false);
	const [s3user, setS3user] = useState();

	useImperativeHandle(ref, () => ({
		handleClick: (instance) => {
			setS3user(instance);
			setOpen(true);
		},
	}));

	const userRole = useSelector((state) => state.host.user.role);
	const userAccount = useSelector((state) => state.host.user.account);
	const currentOwner = useSelector((state) => state.host.user.email);
	const quotas = useSelector((state) => state.AmazonStore.s3quotas);

	if (!s3user) return null;

	const userPool = quotas
		.filter((quota) => quota.account.name === userAccount)
		.find((quota) => quota.pool.id === s3user.pool.id);

	const limits = userPool
		? {
				data_size_mb:
					userPool.data_size_mb -
					userPool.usage.data_size_mb +
					s3user.user_quota.data_size_mb,
				objects:
					userPool.objects - userPool.usage.objects + s3user.user_quota.objects,
				buckets:
					userPool.buckets - userPool.usage.buckets + s3user.user_quota.buckets,
			}
		: {
				data_size_mb: 0,
				objects: 0,
				buckets: 0,
			};

	const mapPropsToApi = (item) => ({
		description: item.description,
		owner: item.owner || currentOwner,
		quota: {
			data_size_mb: +item.data_size_mb,
			objects: +item.objects,
			buckets: +item.buckets,
		},
	});

	const mapApiToProps = (item) => ({
		name: item.name,
		description: item.description,
		default_placement: item.pool.id,
		data_size_mb: item.user_quota.data_size_mb || 0,
		objects: item.user_quota.objects || 0,
		buckets: +item.user_quota.buckets || 0,
		owner: item.owner,
	});

	const handleClose = () => setOpen(false);

	const onSubmit = (values) => {
		const payload = mapPropsToApi(values);

		dispatch(actionAndFetch(editS3user, { user_id: s3user.id, payload })).then(
			handleClose,
		);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{label}</DialogTitle>
				</DialogHeader>

				<EditResForm
					handleClose={handleClose}
					onSubmit={onSubmit}
					initialValues={mapApiToProps(s3user)}
					limits={limits}
				/>
			</DialogContent>
		</Dialog>
	);
};

EditResModal.propTypes = {
	s3user: PropTypes.object,
	name: PropTypes.string,
	label: PropTypes.string,
};

export default forwardRef(EditResModal);
