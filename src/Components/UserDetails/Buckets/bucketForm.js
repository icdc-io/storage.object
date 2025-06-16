import { Button } from "container/Button";
import { Form, useForm } from "container/Form";
import { Label } from "container/Label";
import { DialogClose, DialogFooter } from "container/Modal";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { bucketPattern, number } from "../../../Validaions";
import { InputFormField } from "../../GeneralComponents/InputFormField";

const fieldsInfo = [
	{
		name: "name",
		label: "name",
		editDisabled: true,
		placeholder: "namePlaceholder",
		rules: {
			required: "required",
			maxLength: 63,
			pattern: {
				value: bucketPattern,
				message: "bucketName",
			},
		},
	},
	{
		name: "data_size_mb",
		label: "space",
		placeholder: "bucketParamsPlaceholder",
		rules: {
			validate: (value) => !number(value) || "numberValidation",
		},
	},
	{
		name: "objects",
		label: "objectsLimit",
		placeholder: "bucketParamsPlaceholder",
		rules: {
			validate: (value) => !number(value) || "numberValidation",
		},
	},
];

const BucketForm = ({ handleClose, onSubmit, initialValues, limits }) => {
	const { t } = useTranslation();

	const form = useForm({
		defaultValues: {
			...fieldsInfo.reduce((acc, curr) => {
				acc[curr.name] = "";
				return acc;
			}, {}),
		},
	});

	const edit = !!initialValues;

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		initialValues && form.reset(initialValues);
	}, [initialValues]);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={"flex flex-col gap-4"}
			>
				{fieldsInfo.map((fieldInfo) => {
					if (fieldInfo.editDisabled && edit)
						return (
							<div>
								<Label>
									<b>{t(fieldInfo.label)}</b>
								</Label>
								<p>{form.getValues(fieldInfo.name)}</p>
							</div>
						);

					// const FormField = formComponents[fieldInfo.type];
					return (
						<InputFormField
							key={fieldInfo.name}
							form={form}
							fieldInfo={{
								...fieldInfo,
								limit: limits[fieldInfo.name],
							}}
						/>
					);
				})}
				{/* {edit ? (
					<div className="uneditable_field">
						<Label>
							<b>{t("name")}</b>
						</Label>
						<p>{initialValues.name}</p>
					</div>
				) : (
					<Field
						name="name"
						label={t("name")}
						component={CustomField}
						type="text"
						validate={[required, bucket]}
						placeholder={t("namePlaceholder")}
					/>
				)}
				<div className="add-info-field__container">
					<Field
						name="storageSizeLimit"
						label={t("space")}
						component={CustomField}
						type="text"
						validate={[number]}
						placeholder={t("bucketParamsPlaceholder")}
						limit={limits.space}
					/>
				</div>
				<div className="add-info-field__container">
					<Field
						name="objectsLimit"
						label={t("objectsLimit")}
						component={CustomField}
						type="text"
						validate={[number]}
						placeholder={t("bucketParamsPlaceholder")}
						limit={limits.objects}
					/>
				</div> */}
				<DialogFooter>
					<DialogClose asChild>
						<Button onClick={handleClose} type="button" variant="secondary">
							{t("cancel")}
						</Button>
					</DialogClose>

					<Button type="submit" disabled={!form.formState.isDirty}>
						{t("submit")}
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

export default BucketForm;
