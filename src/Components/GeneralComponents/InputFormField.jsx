import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "container/Form";
import { Input } from "container/Input";
import { Label } from "container/Label";
import Popup from "container/Popup";
import { CircleHelp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatI18nMessageToObject } from "../../utils/formatErrorMessages";

export const InputFormField = ({ fieldInfo, form }) => {
	const { t } = useTranslation();
	const [clarification, clarificationOptions] = formatI18nMessageToObject(
		fieldInfo.clarification,
	);
	return (
		<FormField
			key={fieldInfo.name}
			control={form.control}
			name={fieldInfo.name}
			rules={fieldInfo.rules}
			render={({ field }) => {
				const { error } = form.getFieldState(fieldInfo.name);
				const [key, options] = formatI18nMessageToObject(error?.message);

				return (
					<FormItem className={fieldInfo.className}>
						<FormLabel className="flex items-center">
							<b>{t(fieldInfo.label)}</b>
							&nbsp;
							{fieldInfo.clarification && (
								<Popup content={t(clarification, clarificationOptions)}>
									<span type="button">
										<CircleHelp size={16} />
									</span>
								</Popup>
							)}
						</FormLabel>
						<FormControl>
							<Input
								placeholder={t(fieldInfo.placeholder)}
								{...field}
								value={String(field.value)}
								disabled={fieldInfo.disabled}
								maxLength={fieldInfo.rules?.maxLength}
							/>
						</FormControl>
						{key && <FormMessage>{t(key, options)}</FormMessage>}
						{fieldInfo.description && (
							<FormDescription>{t(fieldInfo.description)}</FormDescription>
						)}
						{(fieldInfo.limit || fieldInfo.limit === 0) && (
							<div className="limit-tip">
								<Label>Max.</Label>
								<span>{fieldInfo.limit}</span>
							</div>
						)}
					</FormItem>
				);
			}}
		/>
	);
};
