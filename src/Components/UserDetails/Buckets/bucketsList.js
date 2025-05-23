import { Button } from "container/Button";
import ErrorScreen from "container/ErrorScreen";
import Loader from "container/Loader";
import OptionsMenu from "container/OptionsMenu";
import { Progress } from "container/Progress";
import Segment from "container/Segment";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "container/Table";
import _ from "lodash";
import { Lock, Meh } from "lucide-react";
import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";
import DangerousHTML from "react-dangerous-html";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { deleteBucketAndFetch, fetchBuckets } from "../../../AppActions";
import DeleteModal from "../../GeneralComponents/DeleteModal";
import BucketModal from "./bucketModal";

const Bar = ({ value, total }) => <Progress value={value} total={total} />;

const BucketsList = ({ s3user }) => {
	const { t } = useTranslation();
	const bucketModalRef = useRef();
	const deleteModalRef = useRef();

	const { userId } = useParams();

	const dispatch = useDispatch();

	const buckets = useSelector((state) => state.AmazonStore.buckets);
	const bucketsFetchStatus = useSelector(
		(state) => state.AmazonStore.bucketsFetchStatus,
	);
	const user = useSelector((state) => state.host.user);

	const [column, setColumn] = useState("name");
	const [direction, setDirection] = useState("ascending");
	const [data, setData] = useState([]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		s3user && dispatch(fetchBuckets(s3user.name));
	}, [s3user]);

	useEffect(() => {
		setData(Object.values(buckets));
	}, [buckets]);

	const onBucketModalOpen = (instance) => () => {
		if (bucketModalRef.current) {
			bucketModalRef.current.handleClick(instance);
		}
	};

	const onDeleteBucketModalOpen = (instance) => () => {
		if (deleteModalRef.current) {
			deleteModalRef.current.handleClick(instance);
		}
	};

	const options = [
		{
			text: "edit",
			action: onBucketModalOpen,
		},
		{
			text: "remove",
			action: onDeleteBucketModalOpen,
			color: "red",
		},
	];

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

	const onConfirm = (bucket) => {
		const isV2Bucket = bucket.path?.startsWith(user.account);

		return dispatch(
			deleteBucketAndFetch(
				userId,
				isV2Bucket ? `${user.account}/${bucket.name}` : bucket.path,
			),
		);
	};

	return (
		<React.Fragment>
			{bucketsFetchStatus === "pending" && <Loader />}

			{Object.keys(buckets).length === 0 &&
				bucketsFetchStatus === "fulfilled" && (
					<div className="h-full m-auto flex flex-col justify-center">
						<div className="">
							<Meh size={64} className="mx-auto" />
							<h2>{t("noBuckets")}</h2>
						</div>
						<br />
						<div className="flex">
							<Button onClick={onBucketModalOpen()} className="mx-auto">
								{t("create")}
							</Button>
						</div>
					</div>
				)}

			{bucketsFetchStatus === "rejected" && <ErrorScreen />}

			{Object.keys(buckets).length > 0 &&
				bucketsFetchStatus === "fulfilled" && (
					<React.Fragment>
						<div className="buckets-grid">
							<div className="flex flex-wrap items-center justify-between gap-4">
								<h4 className="flex gap-2 items-center">
									{t("bucketsTab")}
									{s3user.status === "locked" && (
										<Lock size={16} />
										// <Icon
										// 	style={{
										// 		fontSize: "15px",
										// 		position: "relative",
										// 		top: "-5px",
										// 		marginLeft: "4px",
										// 	}}
										// 	name="lock"
										// 	title={t("lockedS3user")}
										// />
									)}
								</h4>
								<Button
									onClick={onBucketModalOpen()}
									// content={t("addBucket")}
									// icon="plus"
									// labelPosition="left"
									// primary
									disabled={s3user.status === "locked"}
								>
									{t("addBucket")}
								</Button>
							</div>
							<br />
							{/* <div> */}

							{/* <BucketModal s3user={s3user} /> */}
							{/* </div> */}
							{/* <Grid.Row className="buckets-description">
								<Grid.Column verticalAlign="middle" width={16}> */}
							<p className="quotas-description">{t("bucketsDescription")}</p>
							{/* </Grid.Column>
							</Grid.Row> */}
						</div>
						<br />
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
										align="center"
										sorted={column === "space" ? direction : null}
										onSort={handleSort("space")}
									>
										{t("space")}
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
								{data?.map((item, i) => (
									<TableRow key={item.name}>
										<TableCell width={5}>{item.name}</TableCell>
										<TableCell width={5} align="center">
											{item.usage.data_size_mb} /{" "}
											{item.quota.data_size_mb >= 0
												? item.quota.data_size_mb
												: "∞"}
											{item.quota.data_size_mb >= 0 && (
												<Bar
													value={item.usage.data_size_mb}
													total={item.quota.data_size_mb}
												/>
											)}
										</TableCell>
										<TableCell width={5} align="center">
											{item.usage.objects} /{" "}
											{item.quota.objects >= 0 ? item.quota.objects : "∞"}
											{item.quota.objects >= 0 && (
												<Bar
													value={item.usage.objects}
													total={item.quota.objects}
												/>
											)}
										</TableCell>
										<TableCell width={1} align="right">
											<OptionsMenu instance={item} options={options} />
											{/* <Dropdown
												direction="left"
												icon="ellipsis vertical"
												className="users-list__actions_dot"
											>
												<Dropdown.Menu>
													<BucketModal edit bucket={item} s3user={s3user} />
													<Dropdown.Item
														className="item-red"
														icon="trash"
														text={t("remove")}
														onClick={() => {
															setDeleteConfirm(true);
															setCurrentItem(item);
														}}
													/>
												</Dropdown.Menu>
											</Dropdown> */}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</React.Fragment>
				)}
			<DeleteModal
				ref={deleteModalRef}
				title={"deleteBucketConfirmName"}
				onConfirm={onConfirm}
			>
				{(currentItem) => (
					<div className="content">
						<DangerousHTML
							html={t("deleteBucketConfirmMessage", {
								name: `<b>${currentItem.name}</b>`,
							})}
						/>
					</div>
				)}
			</DeleteModal>
			<BucketModal ref={bucketModalRef} />
		</React.Fragment>
	);
};

Bar.propTypes = {
	value: PropTypes.number,
	total: PropTypes.number,
};

export default BucketsList;
