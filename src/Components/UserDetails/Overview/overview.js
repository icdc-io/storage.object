import { Button } from "container/Button";
import CopyButton from "container/CopyButton";
import ErrorScreen from "container/ErrorScreen";
import Loader from "container/Loader";
import { Lock } from "lucide-react";
import React, { useCallback, useRef } from "react";
import DangerousHTML from "react-dangerous-html";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	deleteS3userAndFetch,
	generateKeys,
	lockS3user,
} from "../../../AppActions";
import { isStatusLocked } from "../../../utils/isStatusLocked";
import DeleteModal from "../../GeneralComponents/DeleteModal";

const UserOverview = ({ s3user }) => {
	const { t } = useTranslation();

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const deleteModalRef = useRef();
	const s3userFetchStatus = useSelector(
		(state) => state.AmazonStore.s3userFetchStatus,
	);
	const onDeleteBucketModalOpen = (instance) => () => {
		if (deleteModalRef.current) {
			deleteModalRef.current.handleClick(instance);
		}
	};

	const generateNewKeys = useCallback(() => {
		dispatch(generateKeys(s3user.id));
	}, [dispatch, s3user]);

	const deleteS3user = () => {
		return dispatch(deleteS3userAndFetch(s3user.id)).then(() => navigate(".."));
	};

	if (s3userFetchStatus === "pending")
		return <Loader active inline="centered" />;

	if (s3userFetchStatus === "rejected") return <ErrorScreen />;

	const s3Info = s3user.keys.s3?.[0] || s3user.keys.s3 || {};
	const swiftInfo = s3user.keys.swift?.[0] || s3user.keys.swift || {};

	return (
		<React.Fragment>
			<div className="flex flex-col gap-4">
				<div className="flex">
					<div>
						<h4 className="flex gap-2 items-center">
							{s3user.name}
							{isStatusLocked(s3user) && <Lock size={16} />}
						</h4>
					</div>
				</div>
				<div className="flex">
					<div>{s3user.description}</div>
				</div>
			</div>
			<hr className="mx-4" />
			<h4 className="mb-4">{t("s3")}</h4>
			<div className="flex flex-col gap-4">
				<div className="flex gap-2 flex-wrap">
					<div className="overview_label">{t("id")}</div>
					<div className="flex align-items gap-2 column-copy">
						{s3Info.user}
						<div className="flex items-center">
							<CopyButton content={s3Info.user} />
						</div>
					</div>
				</div>
				<div className="flex gap-2 flex-wrap">
					<div className="overview_label">{t("accessKey")}</div>
					<div className="flex align-items gap-2 column-copy">
						{s3Info.access_key}
						<div className="flex items-center">
							<CopyButton content={s3Info.access_key} />
						</div>
					</div>
				</div>
				<div className="flex gap-2 flex-wrap">
					<div className="overview_label">{t("secretKey")}</div>
					<div className="flex align-items gap-2 column-copy">
						<span className="secret-key">{s3Info.secret_key}</span>
						<div className="flex items-center">
							<CopyButton content={s3Info.secret_key} />
						</div>
					</div>
				</div>
			</div>
			<hr className="mx-4" />
			<h4 className="mb-4">{t("swift")}</h4>
			<div className="flex flex-col gap-4 mb-8">
				<div className="flex gap-2 flex-wrap">
					<div className="overview_label">{t("id")}</div>
					<div className="flex align-items gap-2 column-copy">
						{swiftInfo.user}
						<div className="flex items-center">
							<CopyButton content={swiftInfo.user} />
						</div>
					</div>
				</div>
				<div className="flex gap-2 flex-wrap">
					<div className="overview_label">{t("accessKey")}</div>
					<div className="flex align-items gap-2 column-copy">
						<span className="secret-key">{swiftInfo.secret_key}</span>
						<div className="flex items-center">
							<CopyButton content={swiftInfo.secret_key} />
						</div>
					</div>
				</div>
			</div>

			<div className="flex gap-2 justify-end mt-auto flex-wrap">
				<Button onClick={generateNewKeys} variant="secondary">
					{t("generatenewKeys")}
				</Button>
				{isStatusLocked(s3user) ? (
					<Button
						variant="secondary"
						onClick={() =>
							dispatch(lockS3user(s3user.id, { status: "active" }))
						}
					>
						{t("unlockS3user")}
					</Button>
				) : (
					<Button
						content={t("lockS3user")}
						variant="secondary"
						onClick={() =>
							dispatch(lockS3user(s3user.id, { status: "locked" }))
						}
					>
						{t("lockS3user")}
					</Button>
				)}
				<Button variant="warning" onClick={onDeleteBucketModalOpen(s3user)}>
					{t("deleteS3user")}
				</Button>
			</div>

			<DeleteModal
				ref={deleteModalRef}
				title={"deleteS3userConfirName"}
				onConfirm={deleteS3user}
			>
				{(s3user) => (
					<div className="content">
						<DangerousHTML
							html={t("deleteS3userConfirmMessage", {
								name: `<b>${s3user.name}</b>`,
							})}
						/>
					</div>
				)}
			</DeleteModal>
		</React.Fragment>
	);
};

export default UserOverview;
