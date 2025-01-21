
// types
import { ProjectsData } from '@/types';

// components
import { Modal } from '@/components/Modal';
import { ProjectForm } from '@/components/Forms';

interface ProjectFormModalProps {
  onClose: () => void;
  onSubmit: (newProjectName: string) => void;
  projects: ProjectsData[];
};

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  onClose,
  onSubmit,
  projects,
}) => {
  return (
    <Modal
      title="Add Project"
      onClose={onClose}
      content={
        <ProjectForm
          onClose={onClose}
          onSubmit={onSubmit}
          projects={projects}
        />
      }
    />
  );
};

export default ProjectFormModal;
