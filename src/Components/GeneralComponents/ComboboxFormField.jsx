import { Combobox } from "container/Combobox";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "container/Form";
import Popup from "container/Popup";
import { CircleHelp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatI18nMessageToObject } from "../../utils/formatErrorMessages";

export const ComboboxFormField = ({ fieldInfo, form }) => {
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

				return (
					<FormItem>
						<FormLabel className="flex items-center">
							<b>{t(fieldInfo.label)}</b>&nbsp;
							{fieldInfo.clarification && (
								<Popup content={t(clarification, clarificationOptions)}>
									<span type="button">
										<CircleHelp size={16} />
									</span>
								</Popup>
							)}
						</FormLabel>
						<FormControl>
							<Combobox
								value={field.value}
								onValueChange={(value) => {
									fieldInfo.onChange?.(value);
									field.onChange(value);
								}}
								options={fieldInfo.options}
								disabled={fieldInfo.disabled}
								placeholder={fieldInfo.placeholder}
								formatOption={fieldInfo.formatOption}
								className={fieldInfo.className}
							/>
						</FormControl>
						{fieldInfo.description && (
							<FormDescription>{t(fieldInfo.description)}</FormDescription>
						)}
						{error?.message && <FormMessage>{t(error.message)}</FormMessage>}
					</FormItem>
				);
			}}
		/>
	);
};
