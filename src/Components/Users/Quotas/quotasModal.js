import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "container/Modal";
import PropTypes from "prop-types";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
	actionAndFetch,
	createS3quotasActionAndFetch,
	editS3quotaAndFetch,
} from "../../../AppActions";
import QuotasForm from "./quotasForm";

const mapApiToProps = (item) => ({
	pool_id: item.pool.id,
	data_size_mb: item.data_size_mb,
	buckets: item.buckets,
	objects: item.objects,
	users: item.users,
	usage: item.usage,
});

const QuotasModal = ({ availableQuotas }, ref) => {
	const { t } = useTranslation();

	const dispatch = useDispatch();
	const userAccount = useSelector((state) => state.host.user.account);
	const [quota, setQuota] = useState();

	const [open, setOpen] = useState(false);
	const edit = !!quota;

	useImperativeHandle(ref, () => ({
		handleClick: (quota) => {
			setQuota(quota);
			setOpen(true);
		},
	}));

	const mapPropsToApi = (item, edit) =>
		edit
			? {
					objects: +item.objects,
					data_size_mb: +item.data_size_mb,
					buckets: +item.buckets,
					users: +item.users,
				}
			: {
					objects: +item.objects,
					data_size_mb: +item.data_size_mb,
					buckets: +item.buckets,
					users: +item.users,
					pool_id: +item.pool_id,
					account_name: userAccount,
				};

	const handleClose = () => {
		setOpen(false);
	};

	const onSubmit = (values) => {
		const payload = mapPropsToApi(values, edit);
		if (edit) {
			dispatch(editS3quotaAndFetch(quota.id, payload)).then(handleClose);
		} else {
			dispatch(actionAndFetch(createS3quotasActionAndFetch, payload)).then(
				handleClose,
			);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{edit ? t("editQuota") : t("addQuota")}</DialogTitle>
				</DialogHeader>
				<QuotasForm
					handleClose={handleClose}
					onSubmit={onSubmit}
					availableQuotas={availableQuotas}
					initialValues={edit ? mapApiToProps(quota) : undefined}
				/>
			</DialogContent>
		</Dialog>
	);
};

QuotasModal.propTypes = {
	availableQuotas: PropTypes.array,
};

export default forwardRef(QuotasModal);
