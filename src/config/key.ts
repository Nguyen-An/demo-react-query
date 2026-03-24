export const QUERY_KEYS = {
    getAllUsers: () => ['fetchUser'],
    getUsersPaginate: (page: number) => {return ['fetchUser', page]},
}