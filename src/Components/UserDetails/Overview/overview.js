import { Button } from "container/Button";
import CopyButton from "container/CopyButton";
import { Lock } from "lucide-react";
import React, { useState, useCallback, useEffect, useRef } from "react";
import DangerousHTML from "react-dangerous-html";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	deleteS3userAndFetch,
	generateKeys,
	lockS3user,
} from "../../../AppActions";
import DeleteModal from "../../GeneralComponents/DeleteModal";

const UserOverview = ({ s3user }) => {
	const { t } = useTranslation();

	const dispatch = useDispatch();
	const navigate = useNavigate();
	// const [deleteConfirm, setDeleteConfirm] = useState(false);
	const userRole = useSelector((state) => state.host.user.role);
	const deleteModalRef = useRef();

	const onDeleteBucketModalOpen = (instance) => () => {
		if (deleteModalRef.current) {
			deleteModalRef.current.handleClick(instance);
		}
	};

	const generateNewKeys = useCallback(() => {
		dispatch(generateKeys(s3user.id));
	}, [dispatch, s3user]);

	const deleteS3user = () => {
		dispatch(deleteS3userAndFetch(s3user.id)).then(() => navigate(-1));
		// setDeleteConfirm(false);
		// history.push("/amazon");
		// navigate(-1);
	};

	return (
		<React.Fragment>
			<div className="flex flex-col gap-4">
				<div className="flex">
					<div width={4}>
						<h4 className="flex gap-2">
							{s3user.name}
							{s3user.status === "locked" && (
								// <Icon
								// 	style={{
								// 		fontSize: "15px",
								// 		position: "relative",
								// 		top: "-5px",
								// 	}}
								// 	name="lock"
								// 	title={t("lockedS3user")}
								// />
								<Lock size={16} />
							)}
						</h4>
					</div>
				</div>
				<div className="flex">
					<div>{s3user.description}</div>
				</div>
			</div>
			<br />
			<hr />
			<br />
			<h4>{t("s3")}</h4>
			<br />
			<div className="flex flex-col gap-4">
				<div className="flex gap-2 flex-wrap">
					<div className="overview_label">{t("id")}</div>
					<div className="flex align-items gap-2 column-copy">
						{s3user.keys.s3.user}
						<CopyButton content={s3user.keys.s3.user} />
					</div>
				</div>
				<div className="flex gap-2 flex-wrap">
					<div className="overview_label">{t("accessKey")}</div>
					<div className="flex align-items gap-2 column-copy">
						{s3user.keys.s3.access_key}
						<CopyButton content={s3user.keys.s3.access_key} />
					</div>
				</div>
				<div className="flex gap-2 flex-wrap">
					<div className="overview_label">{t("secretKey")}</div>
					<div className="flex align-items gap-2 column-copy">
						<span className="secret-key">{s3user.keys.s3.secret_key}</span>
						<CopyButton content={s3user.keys.s3.secret_key} />
					</div>
				</div>
			</div>
			<br />
			<hr />
			<br />
			<h4>{t("swift")}</h4>
			<br />
			<div className="flex flex-col gap-4 mb-8">
				<div className="flex gap-2 flex-wrap">
					<div className="overview_label">{t("id")}</div>
					<div className="flex align-items gap-2 column-copy">
						{s3user.keys.swift.user}
						<CopyButton content={s3user.keys.swift.user} />
					</div>
				</div>
				<div className="flex gap-2 flex-wrap">
					<div className="overview_label">{t("accessKey")}</div>
					<div className="flex align-items gap-2 column-copy">
						<span className="secret-key">{s3user.keys.swift.secret_key}</span>
						<CopyButton content={s3user.keys.swift.secret_key} />
					</div>
				</div>
			</div>

			<div className="flex gap-2 justify-end mt-auto flex-wrap">
				<Button
					onClick={generateNewKeys}
					variant="secondary"
					// style={{ width: "270px" }}
				>
					{t("generatenewKeys")}
				</Button>
				{s3user.status === "locked" ? (
					<Button
						// content={t("unlockS3user")}
						// style={{ width: "270px" }}
						variant="secondary"
						onClick={() =>
							dispatch(lockS3user(s3user.id, { is_locked: "unlock" }))
						}
					>
						{t("unlockS3user")}
					</Button>
				) : (
					<Button
						content={t("lockS3user")}
						variant="secondary"
						// style={{ width: "270px" }}
						// onClick={() => dispatch(lockS3userAndFetch(s3user.id, { action: 'lock' }))}
						onClick={() =>
							dispatch(lockS3user(s3user.id, { is_locked: "lock" }))
						}
					>
						{t("lockS3user")}
					</Button>
				)}
				<Button
					variant="warning"
					onClick={onDeleteBucketModalOpen(s3user)}
					// content=
					// style={{ width: "270px" }}
				>
					{t("deleteS3user")}
				</Button>
				{/* <Confirm
							open={deleteConfirm}
							header={t("deleteS3userConfirName")}
							content={
								<div className="content">
									<DangerousHTML
										html={t("deleteS3userConfirmMessage", {
											name: `<b>${s3user.name}</b>`,
										})}
									/>
								</div>
							}
							onCancel={() => setDeleteConfirm(false)}
							onConfirm={deleteS3user}
						/> */}
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
