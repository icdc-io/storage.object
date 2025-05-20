import { Button } from "container/Button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "container/Modal";
import React, {
	useState,
	useEffect,
	useImperativeHandle,
	forwardRef,
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { createBucketAndFetch, editBucketAndFetch } from "../../../AppActions";
import BucketForm from "./bucketForm";

const mapApiToProps = (item) => ({
	name: item.name,
	data_size_mb: item.quota.data_size_mb < 0 ? "" : item.quota.data_size_mb,
	objects: item.quota.objects < 0 ? "" : item.quota.objects,
});

const BucketModal = (_props, ref) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const userAccount = useSelector((state) => state.host.user.account);
	const s3user = useSelector((state) => state.AmazonStore.s3user);

	const [limits, setLimits] = useState({});
	const [bucket, setBucket] = useState();
	const [open, setOpen] = useState(false);
	const edit = !!bucket;

	useImperativeHandle(ref, () => ({
		handleClick: (instance) => {
			setBucket(instance);
			setOpen(true);
		},
	}));

	useEffect(() => {
		setLimits(
			bucket
				? {
						data_size_mb:
							s3user.user_quota.data_size_mb -
							s3user.usage.data_size_mb +
							bucket.usage.data_size_mb,
						objects:
							s3user.user_quota.objects -
							s3user.usage.objects +
							bucket.usage.objects,
					}
				: {
						data_size_mb:
							s3user.user_quota.data_size_mb - s3user.usage.data_size_mb,
						objects: s3user.user_quota.objects - s3user.usage.objects,
					},
		);
	}, [s3user, bucket]);

	const mapPropsToApi = (item) => ({
		quota: {
			data_size_mb: !item.data_size_mb ? -1 : +item.data_size_mb,
			objects: !item.objects ? -1 : +item.objects,
		},
		user_name: s3user.name,
	});

	const handleClose = () => {
		setOpen(false);
		// dispatch(reset("createBucket"));
		setLimits({});
	};

	const onSubmit = (values) => {
		const payload = mapPropsToApi(values);
		if (edit) {
			dispatch(
				editBucketAndFetch(s3user.id, `${userAccount}/${bucket.name}`, payload),
			).then(handleClose);
		} else {
			dispatch(
				createBucketAndFetch(s3user.id, { ...payload, name: values.name }),
			).then(handleClose);
		}

		// dispatch(reset("createBucket"));
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{edit ? t("bucketEdit") : t("createBucket")}
					</DialogTitle>
				</DialogHeader>
				<BucketForm
					handleClose={handleClose}
					onSubmit={onSubmit}
					initialValues={edit ? mapApiToProps(bucket) : undefined}
					limits={limits}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default forwardRef(BucketModal);
