export const formatAccountUsers = (data) => {
	const users = [];

	for (const roleData of data) {
		for (const member of roleData.members) {
			const user = users.find((user) => user.id === member.id);
			if (!user) {
				users.push(member);
			}
		}
	}
	const sortedUsers = users
		.filter((user) => user.email !== "")
		.sort((a, b) => a.email.localeCompare(b.email));
	return sortedUsers;
};
