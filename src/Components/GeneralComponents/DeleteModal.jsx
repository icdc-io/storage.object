import { Button } from "container/Button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "container/Modal";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";

const DeleteModal = ({ title, children, onConfirm }, ref) => {
	const { t } = useTranslation();
	const [instance, setInstance] = useState(null);
	const [open, setOpen] = useState(false);

	useImperativeHandle(ref, () => ({
		handleClick: (instance) => {
			setInstance(instance);
			setOpen(true);
		},
	}));

	if (!instance) return null;

	const onSubmit = () => onConfirm(instance).then(() => setOpen(false));

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t(title)}</DialogTitle>
				</DialogHeader>
				{children?.(instance)}
				<DialogFooter>
					<DialogClose asChild>
						<Button onClick={() => setOpen(false)} variant="secondary">
							{t("cancel")}
						</Button>
					</DialogClose>
					<Button onClick={onSubmit} variant="warning">
						{t("confirm")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default forwardRef(DeleteModal);
