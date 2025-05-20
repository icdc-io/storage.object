const validationMessages = {
	ru: {
		required: "Обязательное поле",
		number: "Должно быть число",
		positiveNumber: "Должно быть положительное число",
		bucketName:
			"Может иметь длину от 3 до 63 символов и содержать только строчные буквы, цифры, точки и тире",
		s3userName:
			"Допускаются только цифры, латинские буквы, дефисы, точки, знаки @ и знаки подчеркивания",
		minLength: (min) => `Должно быть ${min} символов или больше`,
		diskName: "Пожалуйста, введите корректное имя диска",
		diskLength: "Должно быть от 1 до 24 символов",
		email: "Почта",
		latin: "Только латинские симолы",
		diskSize: "Размер диска должен быть больше текущего",
		clientName: "Пожалуйста, введите корректное имя клиента",
		chapUsername: "Пожалуйста, введите корректное имя пользователя",
		chapUsernameLength: "Должно быть от 8 до 64 символов",
		chapPassword: "Пожалуйста, введите корректный пароль",
		chapPasswordLength: "Должно быть от 12 до 16 символов",
		snapshotNameValue: "Пожалуйста, введите корректное имя снапшота",
	},
	en: {
		required: "Required",
		number: "Must be a number",
		positiveNumber: "Must be a positive number",
		bucketName:
			"Can be between 3 and 63 characters long, and can contain only lower-case characters, numbers, periods, and dashes",
		s3userName:
			"Only numbers, latin letters, hyphens, periods, @ signs and underscores are allowed",
		minLength: (min) => `Must be ${min} characters or more`,
		diskName: "Please type the correct disk’s name",
		diskLength: "Must be between 1 to 24 charecters",
		email: "Email",
		latin: "Latin letters only",
		diskSize: "Disk size must be larger than the current one",
		clientName: "Please type the correct client’s name",
		chapUsername: "Please type the correct username",
		chapUsernameLength: "Must be between 8 to 64 charecters",
		chapPassword: "Please type the correct password",
		chapPasswordLength: "Must be between 12 to 16 charecters",
		snapshotNameValue: "Please type the correct snapshot’s name",
	},
};

export const required = (value) =>
	value === "" || value === undefined || value === null
		? validationMessages[localStorage.getItem("icdc-lang") || "en"].required
		: undefined;

export const number = (value) => Number.isNaN(Number(value));

export const positiveNumber = (value) =>
	value && value < 0
		? validationMessages[localStorage.getItem("icdc-lang") || "en"]
				.positiveNumber
		: undefined;

export const minLength = (min) => (value) =>
	value && value.length < min
		? validationMessages[localStorage.getItem("icdc-lang") || "en"].minLength(
				min,
			)
		: undefined;

export const bucketPattern = /^[a-z0-9.-]{3,}$/;
// bucketName

export const latinDiskName = (value) =>
	value && !value.match(/^[a-zA-Z0-9_.-]*$/)
		? validationMessages[localStorage.getItem("icdc-lang") || "en"].latin
		: undefined;

export const lengthDiskName = (value) =>
	value.length > 24
		? validationMessages[localStorage.getItem("icdc-lang") || "en"].diskLength
		: undefined;

export const clientName = (value) =>
	value &&
	!value.match(
		/^iqn\.[0-9]{4}[-](1[0-2]|0[1-9])(?:\.[a-zA-Z0-9-]*[a-zA-Z0-9]){2,}(?::[a-zA-Z0-9-_.]+)?$/,
	)
		? validationMessages[localStorage.getItem("icdc-lang") || "en"].clientName
		: undefined;

export const chapUsername = (value) =>
	value && !value.match(/^[0-9a-zA-Z.:@_-]*$/)
		? validationMessages[localStorage.getItem("icdc-lang") || "en"].chapUsername
		: undefined;

export const lengthChapUsername = (value) =>
	value.length < 8 || value.length > 64
		? validationMessages[localStorage.getItem("icdc-lang") || "en"]
				.chapUsernameLength
		: undefined;

export const chapPassword = (value) =>
	value && !value.match(/^[0-9a-zA-Z@/_-]*$/)
		? validationMessages[localStorage.getItem("icdc-lang") || "en"].chapPassword
		: undefined;

export const lengthChapPassword = (value) =>
	value.length < 12 || value.length > 16
		? validationMessages[localStorage.getItem("icdc-lang") || "en"]
				.chapPasswordLength
		: undefined;

export const emailPattern =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const sizeValue = (value, _allValues, props) => {
	return value &&
		props.initialValues &&
		Number(value) < Number(props.initialValues.size)
		? validationMessages[localStorage.getItem("icdc-lang") || "en"].diskSize
		: undefined;
};

export const s3userPattern = /^[a-z0-9_.@-]*$/;

export const diskName = (value, _allValues, props) => {
	return value && value !== props.instance.disk_name
		? validationMessages[localStorage.getItem("icdc-lang") || "en"].diskName
		: undefined;
};

export const snapshotNameValue = (value, _allValues, props) => {
	return value && value !== props.snapshot_name
		? validationMessages[localStorage.getItem("icdc-lang") || "en"]
				.snapshotNameValue
		: undefined;
};
