import { useState } from 'react';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { QUERY_KEYS } from './key';

export interface IUser {
    id: number;
    name: string;
    email: string;
}

const PAGE_SIZE = 2;

export const useUsersPaginate = (currentPage: number) => {
    const queryClient = useQueryClient();
    const [totalPages, setTotalPages] = useState<number>(1);

    const query = useQuery<IUser[]>({
        queryKey: QUERY_KEYS.getUsersPaginate(currentPage),
        queryFn: () => fetch(`http://localhost:8000/users?_page=${currentPage}&_limit=${PAGE_SIZE}`).then(res => {
            const total_items = res.headers.get('X-Total-Count') ?? 0;
            const total_pages = Math.ceil(Number(total_items) / PAGE_SIZE);
            setTotalPages(total_pages);
            queryClient.setQueryData(['totalPages'], total_items);
            return res.json();
        }),
        placeholderData: keepPreviousData,
    });

    return { ...query, totalPages };
};
