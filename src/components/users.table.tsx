import Table from 'react-bootstrap/Table';
import { useState, forwardRef } from 'react';
import Button from 'react-bootstrap/Button';
import UserCreateModal from './modal/user.create.modal';
import UserEditModal from './modal/user.edit.modal';
import UserDeleteModal from './modal/user.delete.modal';
import UsersPagination from './pagination/users.pagination';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { useQuery } from '@tanstack/react-query';
import { useUsersPaginate, IUser } from '../config/fetch';

const PopoverComponent = forwardRef((props: any, ref: any) => {
    const { id } = props;

    const { isPending, isError, data: user, error } = useQuery<IUser>({
        queryKey: ['todos', id],
        queryFn: () => fetch(`http://localhost:8000/users/${id}`).then(res => res.json()),
    })

    if (isPending) {
        return <span>Loading...</span>
    } else if (isError) {
        return <span>Error: {error.message}</span>
    }
    return (
        <Popover ref={ref} {...props}>
            <Popover.Header as="h3">Detail User</Popover.Header>
            <Popover.Body>
                <div>ID = {user?.id}</div>
                <div>Name = {user?.name}</div>
                <div>Email = {user?.email}</div>
            </Popover.Body>
        </Popover>
    )
})

function UsersTable() {

    const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false);

    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
    const [dataUser, setDataUser] = useState({});

    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<number>(1);

    const handleEditUser = (user: any) => {
        setDataUser(user);
        setIsOpenUpdateModal(true);
    }

    const handleDelete = (user: any) => {
        setDataUser(user);
        setIsOpenDeleteModal(true);
    }

    const { isPending, isError, data: users, error, totalPages } = useUsersPaginate(currentPage);

    if (isPending) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }


    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", margin: "15px 0" }}>
                <h4>Table Users</h4>
                <Button variant="primary"
                    onClick={() => setIsOpenCreateModal(true)}
                >Add New</Button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users?.map(user => {
                        return (
                            <tr key={user.id}>
                                <OverlayTrigger trigger="click" placement="right"
                                    rootClose
                                    overlay={<PopoverComponent id={user.id} />}
                                >
                                    <td><a href='#' onClick={(e) => e.preventDefault()}>{user.id}</a></td>
                                </OverlayTrigger>

                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        onClick={() => handleEditUser(user)}
                                    >
                                        Edit
                                    </Button>&nbsp;&nbsp;&nbsp;
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(user)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <UsersPagination
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
            <UserCreateModal
                isOpenCreateModal={isOpenCreateModal}
                setIsOpenCreateModal={setIsOpenCreateModal}
            />

            <UserEditModal
                isOpenUpdateModal={isOpenUpdateModal}
                setIsOpenUpdateModal={setIsOpenUpdateModal}
                dataUser={dataUser}
            />

            <UserDeleteModal
                dataUser={dataUser}
                isOpenDeleteModal={isOpenDeleteModal}
                setIsOpenDeleteModal={setIsOpenDeleteModal}
            />
        </>
    );
}

export default UsersTable;