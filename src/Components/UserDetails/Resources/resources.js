import { Button } from "container/Button";
import ErrorScreen from "container/ErrorScreen";
import Loader from "container/Loader";
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchS3User } from "../../../AppActions";
import { isStatusLocked } from "../../../utils/isStatusLocked";
import EditResModal from "./editResModal";

const Resources = ({ s3user }) => {
	const { t } = useTranslation();
	const modalRef = useRef();
	const dispatch = useDispatch();
	const { userId } = useParams();
	const s3userFetchStatus = useSelector(
		(state) => state.AmazonStore.s3userFetchStatus,
	);
	const onModalOpen = (instance) => () => {
		if (modalRef.current) {
			modalRef.current.handleClick(instance);
		}
	};

	useEffect(() => {
		dispatch(fetchS3User(userId));
	}, []);

	if (s3userFetchStatus === "pending")
		return <Loader active inline="centered" />;

	if (s3userFetchStatus === "rejected") return <ErrorScreen />;

	return (
		<div className="flex flex-col gap-4 h-full">
			<h4>{t("storageType")}</h4>
			<p>{s3user.pool?.klass}</p>

			<h4>{t("space")}</h4>
			<p>
				{`${s3user.usage?.data_size_mb} / ${s3user.user_quota?.data_size_mb}`}
			</p>

			<h4>{t("objectsLimit")}</h4>
			<p>{`${s3user.usage?.objects} / ${s3user.user_quota?.objects}`}</p>

			<h4>{t("numberBucketsLimit")}</h4>
			<p>{`${s3user.usage?.buckets} / ${s3user.user_quota?.buckets}`}</p>

			<div className="resources-bottom-panel mt-auto">
				<Button
					onClick={onModalOpen(s3user)}
					disabled={isStatusLocked(s3user)}
					variant="secondary"
				>
					{t("edit")}
				</Button>
			</div>
			<EditResModal ref={modalRef} s3user={s3user} />
		</div>
	);
};

Resources.propTypes = {
	s3user: PropTypes.object,
};

export default Resources;
