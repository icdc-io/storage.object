import { Button } from "container/Button";
import { Form, useForm } from "container/Form";
import { Label } from "container/Label";
import { DialogClose, DialogFooter } from "container/Modal";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
// import DangerousHTML from "react-dangerous-html";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { filterFreeDiskTypes } from "../../../utils/filterFreeQuotas";
import { formatI18nMessageToString } from "../../../utils/formatErrorMessages";
import { number } from "../../../Validaions";
import { ComboboxFormField } from "../../GeneralComponents/ComboboxFormField";
import { InputFormField } from "../../GeneralComponents/InputFormField";

const fieldsInfo = [
	{
		name: "objects",
		label: "objects",
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
		name: "users",
		label: "s3swiftUsers",
		placeholder: "usersPlaceholder",
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
		label: "bucketsPerS3",
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

const getDefaultValues = (data) =>
	fieldsInfo.reduce((acc, curr) => {
		acc[curr.name] = data ? `${data[curr.name]}` : "";
		return acc;
	}, {});

const QuotasForm = ({
	handleClose,
	onSubmit,
	initialValues,
	availableQuotas,
}) => {
	const { t } = useTranslation();
	const accountLimits = useSelector((state) => state.AmazonStore.accountLimits);
	const form = useForm({
		defaultValues: getDefaultValues(),
	});
	const [limits, setLimits] = useState({});
	const edit = !!initialValues;

	useEffect(() => {
		if (initialValues) {
			const storageLimits = accountLimits.find(
				(limit) => limit.pool.id === initialValues.pool_id,
			);
			setLimits({
				objects: storageLimits?.objects,
				data_size_mb: storageLimits?.data_size_mb,
				users: storageLimits?.users,
				buckets: storageLimits?.buckets,
			});
			form.reset(initialValues);
		}
	}, [initialValues]);

	const handleChangeStorageType = (newValue) => {
		const storageLimits = accountLimits.find(
			(limit) => limit.pool.id === newValue,
		);
		setLimits({
			objects: storageLimits.objects,
			data_size_mb: storageLimits.data_size_mb,
			users: storageLimits.users,
			buckets: storageLimits.buckets,
		});
	};

	const onClose = () => {
		handleClose(false);
		setLimits({});
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={"flex flex-col gap-4"}
			>
				{edit ? (
					<div className="uneditable_field">
						<Label>
							<b>{t("storageType")}</b>
						</Label>
						<p>
							{
								availableQuotas.find((e) => e.value === initialValues.pool_id)
									?.text
							}
						</p>
					</div>
				) : (
					<ComboboxFormField
						form={form}
						fieldInfo={{
							name: "pool_id",
							label: "storageType",
							placeholder: "select",
							rules: {
								required: "required",
							},
							options: filterFreeDiskTypes(availableQuotas),
							onChange: handleChangeStorageType,
						}}
						// placeholder={t("select")}
						// name="storageType"
						// label={t("storageType")}
						// component={CustomSelect}
						// type="text"
						// editable
						// options={filterFreeDiskTypes(availableQuotas)}
						// initialValues={initialValues}
						// edit={edit}
						// onChange={handleChangeStorageType}
						// validate={[required]}
					/>
				)}
				{fieldsInfo.map((fieldInfo) => (
					<InputFormField
						key={fieldInfo.name}
						form={form}
						fieldInfo={{
							...fieldInfo,
							limit: limits[fieldInfo.name],
							clarification: edit
								? formatI18nMessageToString(
										"cannotBeLess",
										initialValues.usage[fieldInfo.name],
									)
								: undefined,
						}}
					/>
				))}
				{/* <Field
					placeholder={t("objPlaceholder")}
					name="objects"
					label={
						!edit ? (
							t("objects")
						) : (
							<span>
								{t("objects")}{" "}
								<Popup
									inverted
									trigger={<Icon color="grey" name="exclamation circle" />}
									content={
										<DangerousHTML
											html={t("cannotBeLess", {
												value: initialValues.usage.objects,
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
				/> */}
				{/* <Field
					placeholder={t("spacePlaceholder")}
					name="space"
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
												value: initialValues.usage.data_size_mb,
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
					placeholder={t("usersPlaceholder")}
					name="users"
					label={
						!edit ? (
							t("s3swiftUsers")
						) : (
							<span>
								{t("s3swiftUsers")}{" "}
								<Popup
									inverted
									trigger={<Icon color="grey" name="exclamation circle" />}
									content={
										<DangerousHTML
											html={t("cannotBeLess", {
												value: initialValues.usage.users,
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
					limit={limits.users}
				/>
				<Field
					placeholder={t("bucketsPlaceholder")}
					name="buckets"
					label={
						!edit ? (
							t("bucketsPerS3")
						) : (
							<span>
								{t("bucketsPerS3")}{" "}
								<Popup
									inverted
									trigger={<Icon color="grey" name="exclamation circle" />}
									content={
										<DangerousHTML
											html={t("cannotBeLess", {
												value: initialValues.usage.buckets,
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
					<Button onClick={onClose}>{t("cancel")}</Button>
					<Button onClick={handleSubmit} primary type="submit">
						{!edit ? t("add") : t("submit")}
					</Button>
				</Modal.Actions> */}
			</form>
		</Form>
	);
};

QuotasForm.propTypes = {
	handleClose: PropTypes.func,
	handleSubmit: PropTypes.func,
	availableQuotas: PropTypes.array,
};

export default QuotasForm;
