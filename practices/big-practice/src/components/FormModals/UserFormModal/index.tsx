// types
import { UserFormData, UserData } from '@/types';

// components
import { Modal } from '@/components/Modal';
import { UserForm } from '@/components/Forms';

interface UserFormModalProps {
  isEditUser: boolean;
  defaultValues: UserData;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  users: UserData[];
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  isEditUser,
  defaultValues,
  onClose,
  onSubmit,
  users,
}) => {
  const title = isEditUser ? 'Edit User' : 'Add User';
  const buttonLabel = isEditUser ? 'Save' : 'Add';

  return (
    <Modal
      title={title}
      onClose={onClose}
      content={
        <UserForm
          defaultValues={defaultValues}
          isEditUser={isEditUser}
          onClose={onClose}
          onSubmit={onSubmit}
          buttonLabel={buttonLabel}
          users={users}
        />
      }
    />
  );
};

export default UserFormModal;
