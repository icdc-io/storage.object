import CopyButton from "container/CopyButton";
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
import { Lock } from "lucide-react";
import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";
import DangerousHTML from "react-dangerous-html";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { actionAndFetch, deleteS3user, lockS3user } from "../../AppActions";
import { EMPTY_VALUE } from "../../AppConstants";
import DeleteModal from "../GeneralComponents/DeleteModal";
import UserModal from "./userModal";

const Bar = ({ value, total }) => <Progress value={value} total={total} />;

const UsersList = ({ items }) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [column, setColumn] = useState("name");
	const [direction, setDirection] = useState("ascending");
	const [data, setData] = useState(items);
	const deleteModalRef = useRef();
	const editModalRef = useRef();

	const handleSort = (clickedColumn) => () => {
		if (column !== clickedColumn) {
			setColumn(clickedColumn);
			setData(_.sortBy(data, [clickedColumn]));
			setDirection("ascending");
			return;
		}

		direction === "ascending"
			? setDirection("descending")
			: setDirection("ascending");
		setData(data.reverse());
	};

	useEffect(() => setData(_.sortBy(items, [column])), [items, column]);

	const onConfirm = (item) => {
		dispatch(actionAndFetch(deleteS3user, item.id));
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
		dispatch(lockS3user(item.id, { is_locked: "lock" }));

	const unlockS3User = (item) => () =>
		dispatch(lockS3user(item.id, { is_locked: "unlock" }));

	return (
		<React.Fragment>
			<Table className="users-list">
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
							sorted={column === "storageType" ? direction : null}
							onSort={handleSort("storageType")}
						>
							{t("storageType")}
						</TableHead>

						<TableHead
							align="center"
							sorted={column === "space" ? direction : null}
							onSort={handleSort("space")}
						>
							{t("space")}
						</TableHead>

						<TableHead
							align="center"
							sorted={column === "buckets" ? direction : null}
							onSort={handleSort("buckets")}
						>
							{t("buckets")}
						</TableHead>

						<TableHead
							align="center"
							sorted={column === "objects" ? direction : null}
							onSort={handleSort("objects")}
						>
							{t("objects")}
						</TableHead>
						<TableHead />
					</TableRow>
				</TableHeader>

				<TableBody>
					{data?.map((item) => {
						const isData =
							Object.keys(item.user_quota).length > 0 &&
							Object.keys(item.usage).length > 0;
						return (
							<TableRow key={item.name}>
								<TableCell width={3}>
									<div className="flex-inline">
										<div className="name-cell">
											{item.name.length > 20 ? (
												<Popup content={item.name}>
													<button
														type="button"
														onClick={() => navigate(`${item.id}`)}
														className="text-overflow"
													>
														{item.name}
													</button>
												</Popup>
											) : (
												<Link to={`${item.id}`} className="text-overflow">
													{item.name}
												</Link>
											)}
										</div>
										{item.status === "locked" && (
											// <Icon
											// 	name="lock"
											// 	title={t("lockedS3user")}
											// 	style={{ marginLeft: "4px" }}
											// />
											<Lock size={16} />
										)}
									</div>
								</TableCell>
								<TableCell>
									<div className="flex-inline">
										{item.owner || EMPTY_VALUE}
										{item.owner && <CopyButton content={item.owner} />}
									</div>
								</TableCell>
								<TableCell width={3}>
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
										<Bar
											value={item.usage.buckets}
											total={item.user_quota.buckets}
										/>
									</TableCell>
								) : (
									<TableCell align="center">{t("notAvailable")}</TableCell>
								)}
								{isData ? (
									<TableCell align="center">
										{item.usage.objects} / {item.user_quota.objects}
										<Bar
											value={item.usage.objects}
											total={item.user_quota.objects}
										/>
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
												disabled: item.status === "locked",
											},
											item.status === "locked"
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
					})}
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
