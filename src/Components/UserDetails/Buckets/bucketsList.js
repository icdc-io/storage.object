import { Button } from "container/Button";
import CopyButton from "container/CopyButton";
import ErrorScreen from "container/ErrorScreen";
import Loader from "container/Loader";
import OptionsMenu from "container/OptionsMenu";
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
import { Lock, Meh, RefreshCw } from "lucide-react";
import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";
import DangerousHTML from "react-dangerous-html";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { deleteBucketAndFetch, fetchBuckets } from "../../../AppActions";
import { isStatusLocked } from "../../../utils/isStatusLocked";
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
	const quotas = useSelector((state) => state.AmazonStore.s3quotas);

	const publicEndpoint = quotas?.find((q) => q.pool.id === s3user.pool.id)
		?.endpoints.public;

	const [column, setColumn] = useState("");
	const [direction, setDirection] = useState("ascending");
	const [data, setData] = useState([]);
	const isUserLocked = isStatusLocked(s3user);

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
			disabled: isUserLocked,
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
		return dispatch(deleteBucketAndFetch(userId, bucket.path));
	};

	return (
		<React.Fragment>
			{bucketsFetchStatus === "pending" && <Loader />}

			{Object.keys(buckets).length === 0 &&
				bucketsFetchStatus === "fulfilled" && (
					<div className="no_buckets h-full m-auto flex flex-col justify-center gap-4">
						<div className="">
							<Meh size={64} className="mx-auto" />
							<h2>{t("noBuckets")}</h2>
						</div>
						<div className="flex">
							<Button
								onClick={onBucketModalOpen()}
								disabled={isUserLocked}
								className="mx-auto"
							>
								{t("create")}
							</Button>
						</div>
					</div>
				)}

			{bucketsFetchStatus === "rejected" && <ErrorScreen />}

			{Object.keys(buckets).length > 0 &&
				bucketsFetchStatus === "fulfilled" && (
					<div className="flex flex-col gap-4">
						<div className="buckets-grid">
							<div className="flex flex-wrap items-center justify-between gap-4">
								<h4 className="flex gap-2 items-center">
									{t("bucketsTab")}
									{isUserLocked && (
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
								<div className="flex gap-2">
									<Button
										variant="outline"
										className="p-2 color--primary"
										onClick={() => dispatch(fetchBuckets(s3user.name))}
									>
										<RefreshCw size={20} />
									</Button>
									<Button
										onClick={onBucketModalOpen()}
										// content={t("addBucket")}
										// icon="plus"
										// labelPosition="left"
										// primary
										disabled={isUserLocked}
									>
										{t("addBucket")}
									</Button>
								</div>
							</div>
							<p className="quotas-description">{t("bucketsDescription")}</p>
						</div>
						<Table className="buckets-list">
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
										<TableCell>
											<div className="flex items-center gap-2">
												{item.name}
												<CopyButton
													content={`${publicEndpoint}/${item.path.replace(/\//g, ":")}`}
													buttonText={t("copyUrl")}
												/>
											</div>
										</TableCell>
										<TableCell align="center">
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
										<TableCell align="center">
											{item.usage.objects} /{" "}
											{item.quota.objects >= 0 ? item.quota.objects : "∞"}
											{item.quota.objects >= 0 && (
												<Bar
													value={item.usage.objects}
													total={item.quota.objects}
												/>
											)}
										</TableCell>
										<TableCell align="right">
											<OptionsMenu instance={item} options={options} />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
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
