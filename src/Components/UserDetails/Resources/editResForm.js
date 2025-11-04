import { Button } from "container/Button";
import { Form, useForm } from "container/Form";
import { Label } from "container/Label";
import { DialogClose, DialogFooter } from "container/Modal";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { number } from "../../../Validaions";
import { InputFormField } from "../../GeneralComponents/InputFormField";

const fieldsInfo = [
	{
		name: "data_size_mb",
		label: "storageSizeLimit",
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
		label: "objectsLimit",
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
		label: "bucketsLimit",
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

const EditResForm = ({ handleClose, onSubmit, initialValues, limits }) => {
	const { t } = useTranslation();
	const form = useForm({
		defaultValues: {
			...fieldsInfo.reduce((acc, curr) => {
				acc[curr.name] = "";
				return acc;
			}, {}),
		},
	});

	useEffect(() => {
		initialValues && form.reset(initialValues);
	}, [initialValues]);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={"flex flex-col gap-4"}
			>
				<div className="uneditable_field">
					<Label>
						<b>{t("name")}</b>
					</Label>
					<p>{initialValues.name}</p>
				</div>
				{fieldsInfo.map((fieldInfo) => {
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
				{/* <Field
					placeholder={t("spacePlaceholder")}
					name="storageSizeLimit"
					label={t("storageSizeLimit")}
					component={CustomField}
					type="number"
					validate={[required, number, positiveNumber]}
					limit={limits.storageSizeLimit}
				/>
				<Field
					placeholder={t("objPlaceholder")}
					name="objectsLimit"
					label={t("objectsLimit")}
					component={CustomField}
					type="number"
					validate={[required, number, positiveNumber]}
					limit={limits.objectsLimit}
				/>
				<Field
					placeholder={t("bucketsPlaceholder")}
					name="bucketsLimit"
					label={t("bucketsLimit")}
					component={CustomField}
					type="number"
					validate={[required, number, positiveNumber]}
					limit={limits.bucketsLimit}
				/> */}
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

EditResForm.propTypes = {
	handleClose: PropTypes.func,
	handleSubmit: PropTypes.func,
	initialValues: PropTypes.any,
};

export default EditResForm;
