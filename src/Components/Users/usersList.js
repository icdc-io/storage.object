import { Button } from "container/Button";
import CopyButton from "container/CopyButton";
import ErrorScreen from "container/ErrorScreen";
import Loader from "container/Loader";
import OptionsMenu from "container/OptionsMenu";
import Popup from "container/Popup";
import { Progress } from "container/Progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "container/Table";
import _ from "lodash";
import { CircleX, Lock, Meh } from "lucide-react";
import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";
import DangerousHTML from "react-dangerous-html";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { actionAndFetch, deleteS3user, lockS3user } from "../../AppActions";
import { EMPTY_VALUE } from "../../AppConstants";
import { isStatusDeleted, isStatusLocked } from "../../utils/isStatusLocked";
import DeleteModal from "../GeneralComponents/DeleteModal";
import UserModal from "./userModal";

const Bar = ({ value, total }) => <Progress value={value} total={total} />;

export const fullCellWidth = (content) => {
	return (
		<TableRow>
			<TableCell colSpan={100}>
				<div className="empty-cell">{content}</div>
			</TableCell>
		</TableRow>
	);
};

const sortChartData = (data, field) =>
	data.sort((a, b) => {
		if (!a.usage[field]) {
			if (!b.usage[field]) {
				return a.user_quota[field] - b.user_quota[field];
			}
			return -1;
		}

		return a.usage[field] - b.usage[field];
	});

const updateAfterLocking = (setData) => (data) => {
	setData((prevState) =>
		prevState.map((s3User) =>
			s3User.id === data.value.id ? data.value : s3User,
		),
	);
};

const UsersList = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const items = useSelector((state) => state.AmazonStore.s3users);
	const s3usersFetchStatus = useSelector(
		(state) => state.AmazonStore.s3usersFetchStatus,
	);
	const s3quotasFetchStatus = useSelector(
		(state) => state.AmazonStore.s3quotasFetchStatus,
	);
	const poolsFetchStatus = useSelector(
		(state) => state.AmazonStore.poolsFetchStatus,
	);
	const [column, setColumn] = useState("");
	const [direction, setDirection] = useState("ascending");
	const [data, setData] = useState([...items]);
	const deleteModalRef = useRef();
	const editModalRef = useRef();

	useEffect(() => {
		setData([...items]);
	}, [items]);

	const handleSort = (clickedColumn) => () => {
		if (column !== clickedColumn) {
			const sortedData = clickedColumn?.includes("usage.")
				? sortChartData(data, clickedColumn.split("usage.")[1])
				: _.sortBy(data, [clickedColumn]);
			setColumn(clickedColumn);
			setData(sortedData);
			setDirection("ascending");
			return;
		}

		direction === "ascending"
			? setDirection("descending")
			: setDirection("ascending");
		setData(data.reverse());
	};

	const onConfirm = (item) => {
		return dispatch(actionAndFetch(deleteS3user, item.id));
	};

	const onDeleteBucketModalOpen = (instance) => () => {
		if (deleteModalRef.current) {
			deleteModalRef.current.handleClick(instance);
		}
	};

	const onEditBucketModalOpen = (instance) => () => {
		if (editModalRef.current) {
			editModalRef.current.handleClick(instance);
		}
	};

	const lockS3User = (item) => () =>
		dispatch(lockS3user(item.id, { is_locked: "lock" })).then(
			updateAfterLocking(setData),
		);

	const unlockS3User = (item) => () =>
		dispatch(lockS3user(item.id, { is_locked: "unlock" })).then(
			updateAfterLocking(setData),
		);

	const withContent = data.length > 0;

	const statuses = [s3usersFetchStatus, s3quotasFetchStatus, poolsFetchStatus];

	const content = data?.map((item) => {
		const isLocked = isStatusLocked(item);
		const isDeleted = isStatusDeleted(item);
		const TagName = isDeleted ? Button : Link;
		const isData =
			Object.keys(item.user_quota).length > 0 &&
			Object.keys(item.usage).length > 0;
		const nameCellContent = (
			<TagName
				to={`${item.id}`}
				className={`text-overflow ${isDeleted ? "deleted" : ""}`}
			>
				{item.name}
			</TagName>
		);
		return (
			<TableRow key={item.name}>
				<TableCell>
					<div className="flex-inline">
						<div className="name-cell">
							{item.name.length > 20 ? (
								<Popup content={item.name}>{nameCellContent}</Popup>
							) : (
								nameCellContent
							)}
						</div>
						{isLocked && (
							<Popup content={t("lockedUserPopup")}>
								<button type="button">
									<Lock size={16} />
								</button>
							</Popup>
						)}
						{isDeleted && (
							<Popup content={t("deletedUserPopup")}>
								<button type="button">
									<CircleX size={16} color="#DB2828" />
								</button>
							</Popup>
						)}
					</div>
				</TableCell>
				<TableCell>
					<div className="flex-inline">
						{item.owner || EMPTY_VALUE}
						{item.owner && <CopyButton content={item.owner} />}
					</div>
				</TableCell>
				<TableCell>
					<div>
						{item.description.length > 18 ? (
							<Popup content={item.description}>
								<button type="button" className="text-overflow">
									{item.description}
								</button>
							</Popup>
						) : (
							<span className="text-overflow">{item.description}</span>
						)}
					</div>
				</TableCell>
				<TableCell>{item.pool.name || EMPTY_VALUE}</TableCell>
				{isData ? (
					<TableCell align="center">
						{item.usage.data_size_mb} / {item.user_quota.data_size_mb}
						<Bar
							value={item.usage.data_size_mb}
							total={item.user_quota.data_size_mb}
						/>
					</TableCell>
				) : (
					<TableCell align="center">{t("notAvailable")}</TableCell>
				)}
				{isData ? (
					<TableCell align="center">
						{item.usage.buckets} / {item.user_quota.buckets}
						<Bar value={item.usage.buckets} total={item.user_quota.buckets} />
					</TableCell>
				) : (
					<TableCell align="center">{t("notAvailable")}</TableCell>
				)}
				{isData ? (
					<TableCell align="center">
						{item.usage.objects} / {item.user_quota.objects}
						<Bar value={item.usage.objects} total={item.user_quota.objects} />
					</TableCell>
				) : (
					<TableCell align="center">{t("notAvailable")}</TableCell>
				)}

				<TableCell align="right">
					<OptionsMenu
						instance={item}
						options={[
							{
								text: "edit",
								action: onEditBucketModalOpen,
								disabled: isLocked,
							},
							isLocked
								? {
										text: "unlockS3user",
										action: unlockS3User,
									}
								: {
										text: "lockS3user",
										action: lockS3User,
									},
							{
								text: "remove",
								action: onDeleteBucketModalOpen,
								color: "red",
							},
						]}
					/>
				</TableCell>
			</TableRow>
		);
	});

	return (
		<React.Fragment>
			<Table className={`${withContent ? "loaded" : ""} users-list`}>
				<TableHeader>
					<TableRow>
						<TableHead
							sorted={column === "name" ? direction : null}
							onSort={handleSort("name")}
						>
							{t("name")}
						</TableHead>

						<TableHead
							sorted={column === "owner" ? direction : null}
							onSort={handleSort("owner")}
						>
							{t("owner")}
						</TableHead>

						<TableHead
							sorted={column === "description" ? direction : null}
							onSort={handleSort("description")}
						>
							{t("description")}
						</TableHead>

						<TableHead
							sorted={column === "pool.name" ? direction : null}
							onSort={handleSort("pool.name")}
						>
							{t("storageType")}
						</TableHead>

						<TableHead
							align="center"
							sorted={column === "usage.data_size_mb" ? direction : null}
							onSort={handleSort("usage.data_size_mb")}
						>
							{t("space")}
						</TableHead>

						<TableHead
							align="center"
							sorted={column === "usage.buckets" ? direction : null}
							onSort={handleSort("usage.buckets")}
						>
							{t("buckets")}
						</TableHead>

						<TableHead
							align="center"
							sorted={column === "usage.objects" ? direction : null}
							onSort={handleSort("usage.objects")}
						>
							{t("objects")}
						</TableHead>
						<TableHead />
					</TableRow>
				</TableHeader>

				<TableBody>
					{statuses.includes("pending")
						? fullCellWidth(<Loader />)
						: s3usersFetchStatus === "rejected"
							? fullCellWidth(<ErrorScreen />)
							: data.length
								? content
								: fullCellWidth(
										<div className="flex flex-col gap-2">
											<Meh size={64} className="mx-auto" />
											<h2>{t("noS3users")}</h2>
										</div>,
									)}
				</TableBody>
			</Table>
			<UserModal ref={editModalRef} />
			<DeleteModal
				ref={deleteModalRef}
				title={"deleteS3userConfirName"}
				onConfirm={onConfirm}
			>
				{(currentItem) => (
					<div className="content">
						<DangerousHTML
							html={t("deleteS3userConfirmMessage", {
								name: `<b>${currentItem.name}</b>`,
							})}
						/>
					</div>
				)}
			</DeleteModal>
		</React.Fragment>
	);
};

UsersList.propTypes = {
	items: PropTypes.array,
};

Bar.propTypes = {
	value: PropTypes.number,
	total: PropTypes.number,
};

export default UsersList;
