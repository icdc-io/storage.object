export const isStatusLocked = (s3UserInfo) => {
	if (s3UserInfo.status) return s3UserInfo.status === "locked";
	return s3UserInfo.is_locked;
};
