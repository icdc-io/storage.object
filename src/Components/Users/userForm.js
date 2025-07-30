import { Button } from "container/Button";
import { Form, useForm } from "container/Form";
import { Label } from "container/Label";
import { DialogClose, DialogFooter } from "container/Modal";
import { isAdminRights } from "container/roleUtils";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
// import DangerousHTML from "react-dangerous-html";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccountUsers } from "../../AppActions";
import { emailPattern, number, s3userPattern } from "../../Validaions";
import { formatI18nMessageToString } from "../../utils/formatErrorMessages";
import { ComboboxFormField } from "../GeneralComponents/ComboboxFormField";
import { InputFormField } from "../GeneralComponents/InputFormField";

const defaultValues = {
	name: "",
	description: "",
	owner: "",
	data_size_mb: "1024",
	buckets: "5",
	objects: "5",
	pool_id: "",
};

const generalFieldsInfo = (isEdit) => [
	{
		name: "name",
		label: "name",
		placeholder: "namePlaceholder",
		disabled: isEdit,
		rules: {
			required: "required",
			maxLength: 64,
			pattern: isEdit
				? undefined
				: {
						value: s3userPattern,
						message: "s3userName",
					},
		},
	},
	{
		name: "description",
		label: "description",
		placeholder: "descriptPlaceholder",
		rules: {
			required: "required",
			maxLength: 64,
		},
	},
];

const quotasFieldsInfo = [
	{
		name: "data_size_mb",
		label: "space",
		placeholder: "spacePlaceholder",
		rules: {
			required: "required",
			validate: (value) =>
				number(value)
					? "numberValidation"
					: value <= 0
						? "positiveNumber"
						: undefined,
		},
	},
	{
		name: "objects",
		label: "objectsQuota",
		placeholder: "objPlaceholder",
		rules: {
			required: "required",
			validate: (value) =>
				number(value)
					? "numberValidation"
					: value <= 0
						? "positiveNumber"
						: undefined,
		},
	},
	{
		name: "buckets",
		label: "bucketsQuota",
		placeholder: "bucketsPlaceholder",
		rules: {
			required: "required",
			validate: (value) =>
				number(value)
					? "numberValidation"
					: value <= 0
						? "positiveNumber"
						: undefined,
		},
	},
];

const UserForm = ({ initialValues, handleClose, onSubmit }) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const userRole = useSelector((state) => state.host.user.role);
	const currentAccount = useSelector((state) => state.host.user.account);
	const currentUserEmail = useSelector((state) => state.host.email);
	const pools = useSelector((state) => state.AmazonStore.s3quotas);
	const acountUsers = useSelector((state) => state.AmazonStore.accountUsers);
	const isAdmin = isAdminRights(userRole);

	const currentPool = pools.filter(
		(item) => item.account.name === currentAccount,
	);

	const form = useForm({
		defaultValues,
	});
	const [limits, setLimits] = useState({});
	const edit = !!initialValues;

	const storageTypes = currentPool.map((item, index) => ({
		key: index,
		text: item.pool.name,
		value: item.pool.id,
	}));

	const usersOptions = isAdmin
		? acountUsers.map((item, index) => ({
				key: index,
				text: item.email,
				value: item.email,
			}))
		: [{ key: 0, text: currentUserEmail, value: currentUserEmail }];

	const handleStorageTypeChange = (newValue) => {
		const checkedPool = currentPool.find((quota) => quota.pool.id === newValue);
		const newLimits = checkedPool
			? {
					data_size_mb:
						checkedPool.data_size_mb - checkedPool.usage.data_size_mb,
					objects: checkedPool.objects - checkedPool.usage.objects,
					buckets: checkedPool.buckets - checkedPool.usage.buckets,
				}
			: {
					data_size_mb: 0,
					objects: 0,
					buckets: 0,
				};
		setLimits(newLimits);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (initialValues) {
			form.reset(initialValues);
			const userPool = currentPool.find(
				(quota) => quota.pool.id === initialValues.pool_id,
			);
			if (!userPool) return;
			setLimits({
				data_size_mb:
					userPool.data_size_mb -
					userPool.usage.data_size_mb +
					initialValues.user.user_quota.data_size_mb,
				objects:
					userPool.objects -
					userPool.usage.objects +
					initialValues.user.user_quota.objects,
				buckets:
					userPool.buckets -
					userPool.usage.buckets +
					initialValues.user.user_quota.buckets,
			});
		}
	}, [initialValues]);

	useEffect(() => {
		if (isAdmin) {
			dispatch(fetchAccountUsers());
		} else if (!edit) {
			form.setValue("owner", currentUserEmail);
		}
	}, [isAdmin, edit, currentUserEmail, form, dispatch]);

	const onClose = () => {
		setLimits({});
		handleClose();
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={"flex flex-col gap-4"}
			>
				<h4>{t("general")}</h4>
				{generalFieldsInfo(edit).map((fieldInfo) => {
					if (fieldInfo.adminOnly && !isAdmin) return null;

					return (
						<InputFormField
							key={fieldInfo.name}
							form={form}
							fieldInfo={fieldInfo}
						/>
					);
				})}
				{/* {edit ? (
					<div className="uneditable_field">
						<Label>{t("name")}</Label>
						<p>{initialValues.name}</p>
					</div>
				) : (
					<Field
						placeholder={t("namePlaceholder")}
						name="name"
						label={t("name")}
						component={CustomField}
						type="text"
						validate={[required, s3user]}
					/>
				)}
				<Field
					placeholder={t("descriptPlaceholder")}
					name="description"
					label={t("description")}
					component={CustomField}
					type="text"
					validate={[required]}
				/>
				{isAdmin && (
					<Field
						placeholder={t("emailPlaceholder")}
						name="owner"
						label={t("owner")}
						component={CustomField}
						type="email"
						validate={edit ? [required, email] : [email]}
					/>
				)} */}
				<ComboboxFormField
					fieldInfo={{
						name: "owner",
						label: "owner",
						placeholder: "emailPlaceholder",
						rules: {
							required: "required",
							pattern: edit
								? {
										value: emailPattern,
										message: "noValidEmail",
									}
								: undefined,
						},
						disabled: !isAdmin,
						options: usersOptions,
					}}
					form={form}
				/>
				{edit ? (
					<div className="uneditable_field">
						<Label>
							<b>{t("storageType")}</b>
						</Label>
						<p>
							{
								storageTypes.find((e) => e.value === initialValues.pool_id)
									?.text
							}
						</p>
					</div>
				) : (
					<ComboboxFormField
						fieldInfo={{
							name: "pool_id",
							label: "storageType",
							placeholder: "select",
							rules: {
								required: edit ? undefined : "required",
							},
							options: storageTypes,
							onChange: handleStorageTypeChange,
						}}
						form={form}
					/>
				)}
				<h4>{t("quotas")}</h4>

				{quotasFieldsInfo.map((fieldInfo) => (
					<InputFormField
						key={fieldInfo.name}
						form={form}
						fieldInfo={{
							...fieldInfo,
							limit: limits[fieldInfo.name],
							clarification: edit
								? formatI18nMessageToString(
										"cannotBeLess",
										initialValues.user.usage[fieldInfo.name],
									)
								: undefined,
						}}
					/>
				))}

				{/* <Field
					placeholder={t("spacePlaceholder")}
					name="data_size_mb"
					label={
						!edit ? (
							t("space")
						) : (
							<span>
								{t("space")}{" "}
								<Popup
									inverted
									trigger={<Icon color="grey" name="exclamation circle" />}
									content={
										<DangerousHTML
											html={t("cannotBeLess", {
												value: initialValues.user.usage.data_size_mb,
											})}
										/>
									}
								/>
							</span>
						)
					}
					component={CustomField}
					type="number"
					validate={[required, number, positiveNumber]}
					limit={limits.data_size_mb}
				/>
				<Field
					placeholder={t("objPlaceholder")}
					name="objects"
					label={
						!edit ? (
							t("objectsQuota")
						) : (
							<span>
								{t("objectsQuota")}{" "}
								<Popup
									inverted
									trigger={<Icon color="grey" name="exclamation circle" />}
									content={
										<DangerousHTML
											html={t("cannotBeLess", {
												value: initialValues.user.usage.objects,
											})}
										/>
									}
								/>
							</span>
						)
					}
					component={CustomField}
					type="number"
					validate={[required, number, positiveNumber]}
					limit={limits.objects}
				/>
				<Field
					placeholder={t("bucketsPlaceholder")}
					name="buckets"
					label={
						!edit ? (
							t("bucketsQuota")
						) : (
							<span>
								{t("bucketsQuota")}{" "}
								<Popup
									inverted
									trigger={<Icon color="grey" name="exclamation circle" />}
									content={
										<DangerousHTML
											html={t("cannotBeLess", {
												value: initialValues.user.usage.buckets,
											})}
										/>
									}
								/>
							</span>
						)
					}
					component={CustomField}
					type="number"
					validate={[required, number, positiveNumber]}
					limit={limits.buckets}
				/> */}
				<DialogFooter>
					<DialogClose asChild>
						<Button onClick={onClose} type="button" variant="secondary">
							{t("cancel")}
						</Button>
					</DialogClose>

					<Button type="submit" disabled={!form.formState.isDirty}>
						{!edit ? t("add") : t("submit")}
					</Button>
				</DialogFooter>
				{/* <Modal.Actions align={"right"}>
					<Button onClick={handleClose}>{t("cancel")}</Button>
					<Button onClick={handleSubmit} primary type="submit">
						{t("submit")}
					</Button>
				</Modal.Actions> */}
			</form>
		</Form>
	);
};

UserForm.propTypes = {
	handleClose: PropTypes.func,
	handleSubmit: PropTypes.func,
	edit: PropTypes.bool,
	isAdmin: PropTypes.bool,
	pools: PropTypes.array,
};

export default UserForm;
