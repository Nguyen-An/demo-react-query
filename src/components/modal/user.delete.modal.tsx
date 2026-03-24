import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';

const UserDeleteModal = (props: any) => {
    const { dataUser, isOpenDeleteModal, setIsOpenDeleteModal } = props;

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            const res = await fetch(`http://localhost:8000/users/${dataUser?.id}`, {
                method: "DELETE",
            })
            return res.json();
        },
        onSuccess: () => {
            toast("Delete user successfully");
            setIsOpenDeleteModal(false);
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        }
    });

    const handleSubmit = () => {
        mutation.mutate();
    }

    return (
        <Modal
            show={isOpenDeleteModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            backdrop={false}
            onHide={() => setIsOpenDeleteModal(false)}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Delete A User
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Delete the user: {dataUser?.email ?? ""}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant='warning'
                    onClick={() => setIsOpenDeleteModal(false)} className='mr-2'>Cancel</Button>
                <Button onClick={() => handleSubmit()}>Confirm</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default UserDeleteModal;