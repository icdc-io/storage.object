import { Button } from "container/Button";
import CopyButton from "container/CopyButton";
import ErrorScreen from "container/ErrorScreen";
import Loader from "container/Loader";
import Popup from "container/Popup";
import { isAdminRights, OPERATOR } from "container/roleUtils";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "container/Table";
import { CircleHelp } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchPools, fetchS3Limits, fetchS3quotas } from "../../../AppActions";
import External from "../../../images/external.svg";
import { filterFreeDiskTypes } from "../../../utils/filterFreeQuotas";
import {
	mapPoolToDiskTypeOptions,
	mapQuotasToDiskType,
} from "../../../utils/mappers";
import QuotasModal from "./quotasModal";

const getPropByString = (obj, path) => {
	if (!obj || !path) return null;
	return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

const Quotas = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const modalRef = useRef();

	const user = useSelector((state) => state.host.user);
	const lang = useSelector((state) => state.host.lang);
	const pools = useSelector((state) => state.AmazonStore.pools);
	const quotas = useSelector((state) => state.AmazonStore.s3quotas);
	const s3quotasFetchStatus = useSelector(
		(state) => state.AmazonStore.s3quotasFetchStatus,
	);

	useEffect(() => {
		dispatch(fetchS3quotas());
		dispatch(fetchPools());
		dispatch(fetchS3Limits(user.account));
	}, [dispatch, user]);

	const onModalOpen = (instance) => () => {
		if (modalRef.current) {
			modalRef.current.handleClick(instance);
		}
	};

	const headers = [
		{
			title: "storageType",
			data: "pool.name",
			width: 2,
			className: "storage-type",
		},
		user.role === OPERATOR && {
			title: "account",
			data: "account.name",
			width: 1,
			className: "name",
		},
		{ title: "objects", data: "objects", width: 2, className: "objects" },
		{ title: "space", data: "data_size_mb", width: 2, className: "space" },
		{
			title: "s3swiftUsers",
			data: "users",
			width: 2,
			className: "s3swiftUsers",
		},
		{
			title: "buckets",
			data: "buckets",
			width: user.role === OPERATOR ? 1 : 2,
			className: "buckets",
		},
		{
			title: "publicEndpoints",
			data: "public",
			width: 3,
			className: "publicEndpoints",
		},
		{
			title: "privateEndpoints",
			data: "private",
			width: 3,
			className: "privateEndpoints",
		},
		isAdminRights(user.role) && { title: "", data: "edit", width: 1 },
	].filter(Boolean);

	const showEndpoints = (endpoints) => {
		const endpointsArray = endpoints.split(",");
		return (
			<div className="endpoint">
				{endpointsArray.map((el) => (
					<div key={el}>
						<a href={el} target="blank">
							{el}
						</a>
						<CopyButton content={el} />
					</div>
				))}
			</div>
		);
	};

	const vendorDomain = window.location.origin.split(".").slice(-2).join(".");

	const HELP_LINK = `https://docs.${vendorDomain}/${lang}/storage/s3/overview/`;

	const isFullHeight =
		s3quotasFetchStatus !== "fulfilled" || quotas.length === 0;

	const withContent = s3quotasFetchStatus === "fulfilled" && quotas.length > 0;

	const getContent = () => {
		if (s3quotasFetchStatus === "pending")
			return (
				<TableRow>
					<TableCell className="s3quotas-empty-cell" colSpan="100">
						<div className="s3quotas-empty">
							<Loader />
						</div>
					</TableCell>
				</TableRow>
			);

		if (s3quotasFetchStatus === "rejected")
			return (
				<TableRow>
					<TableCell className="s3quotas-empty-cell" colSpan="100">
						<div className="s3quotas-empty">
							<ErrorScreen />
						</div>
					</TableCell>
				</TableRow>
			);

		if (quotas.length === 0)
			return (
				<TableRow>
					<TableCell className="s3quotas-empty-cell" colSpan="100">
						<div className="s3quotas-empty">
							<h2>{t("quotasEmpty")}</h2>
							{isAdminRights(user.role) && <QuotasModal />}
						</div>
					</TableCell>
				</TableRow>
			);

		return quotas.map((quota) => (
			<TableRow key={quota.id + quota.account.name}>
				{headers.map((headerItem) =>
					headerItem.data === "edit" ? (
						isAdminRights(user.role) ? (
							<TableCell key={headerItem.data} align="right">
								<Button
									onClick={onModalOpen(quota)}
									variant="outline"
									color="primary"
								>
									{t("edit")}
								</Button>
							</TableCell>
						) : null
					) : (
						<TableCell key={headerItem.data}>
							{headerItem.data === "data_size_mb" ||
							headerItem.data === "objects" ||
							headerItem.data === "users" ||
							headerItem.data === "buckets"
								? `${quota.usage[headerItem.data]} / ${quota[headerItem.data]}`
								: headerItem.data === "public" || headerItem.data === "private"
									? showEndpoints(quota.endpoints[headerItem.data])
									: getPropByString(quota, headerItem.data)}
						</TableCell>
					),
				)}
			</TableRow>
		));
	};

	const availableQuotas = pools
		.map(mapPoolToDiskTypeOptions)
		.map((diskOption) => ({
			...diskOption,
			isFree: !quotas.map(mapQuotasToDiskType).includes(diskOption.text),
		}));

	const createQuotaButton = filterFreeDiskTypes(availableQuotas).length ? (
		<Button onClick={onModalOpen(null)}>{t("addQuota")}</Button>
	) : (
		<Popup content={t("noPools")}>
			<Button className="disabled-btn ">
				{t("addQuota")}&nbsp;&nbsp;
				<CircleHelp size={16} />
			</Button>
		</Popup>
	);

	return (
		<section className="s3quotas-list flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h2 className="page-title">{t("quotas")}</h2>
				{isAdminRights(user.role) &&
					s3quotasFetchStatus === "fulfilled" &&
					createQuotaButton}
			</div>
			<div className="flex quotas-description">
				<p>
					{t("quotasDescription")}{" "}
					<a href={HELP_LINK} target="_blank" rel="noreferrer">
						{t("howToConnect")} <img src={External} alt="External link" />
					</a>
				</p>
			</div>
			<Table
				className={`${withContent ? "loaded" : ""} quotas-list h-full`}
				containerClassName={isFullHeight ? "h-full" : ""}
			>
				<TableHeader>
					<TableRow>
						{headers.map((item) => (
							<TableHead
								key={item.data}
								width={item.width}
								className={item.className}
							>
								{t(item.title)}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>{getContent()}</TableBody>
			</Table>
			<QuotasModal ref={modalRef} availableQuotas={availableQuotas} />
		</section>
	);
};

export default Quotas;
