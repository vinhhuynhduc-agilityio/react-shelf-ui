export const mockUsers = [
  {
    id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
    fullName: "Joe Bloggs",
    earnings: "$11500",
    email: "john@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    registered: "May 21, 2024 17:02:06",
    lastUpdated: "Nov 11, 2024 14:34:21",
  },
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    fullName: "Jane Smith",
    earnings: "$36911",
    email: "jane@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=2",
    registered: "June 10, 2021 09:20:15",
    lastUpdated: "Nov 18, 2024 17:33:37",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    fullName: "Alice Brown",
    earnings: "$7200",
    email: "alice@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    registered: "April 15, 2024 14:02:06",
    lastUpdated: "October 11, 2023 10:00:00",
  },
];

export const mockProjects = [
  {
    id: "f2d32cb6-12c7-4ae7-bb28-74f16d1d2cbb",
    projectName: "Support",
  },
  {
    id: "c1c20a2e-f450-4875-96e8-334f92e9b3b5",
    projectName: "Failure Testing",
  },
  {
    id: "e38e56a2-4d3c-469d-8345-45d6b5fae9f9",
    projectName: "Quality Management",
  },
  {
    id: "f49b68f4-5e5b-457d-bf16-1b5b78e6f5f1",
    projectName: "Data Quality",
  },
  {
    id: "47c80c97-6575-45eb-a25b-75ee485bf9fb",
    projectName: "Test",
  },
];

export const mockTasks = [
  {
    id: "71e564f4-7c18-47f7-89f2-abe4b7ec2854",
    userId: "d290f1ee-6c54-4b01-90e6-d701748f0851",
    projectId: "f2d32cb6-12c7-4ae7-bb28-74f16d1d2cbb",
    taskName: "Build test",
    startDate: "10 Aug 24",
    completedDate: "15 Nov 24",
    currency: 2000,
    status: true,
    projectName: "Support",
    fullName: "Joe Bloggs",
  },
  {
    id: "82e564f4-7c18-47f7-89f2-abe4b7ec2856",
    userId: "d290f1ee-6c54-4b01-90e6-d701748f0851",
    projectId: "c1c20a2e-f450-4875-96e8-334f92e9b3b5",
    taskName: "Build Frontend",
    startDate: "05 Sep 23",
    completedDate: "27 Oct 24",
    currency: 4000,
    status: true,
    projectName: "Failure Testing",
    fullName: "Joe Bloggs",
  },
  {
    id: "u2e564f4-7c18-47f7-89f2-abe4b7ec2878",
    userId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    projectId: "c1c20a2e-f450-4875-96e8-334f92e9b3b5",
    taskName: "Develop Chatbot Feature",
    startDate: "23 Sep 23",
    completedDate: "24 Oct 24",
    currency: 3200,
    status: true,
    projectName: "Failure Testing",
    fullName: "Jane Smith",
  },
  {
    id: "7ce698fc-c0ee-4d8c-8a1b-df988a96c22f",
    userId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    projectId: "47c80c97-6575-45eb-a25b-75ee485bf9fb",
    taskName: "test today",
    startDate: "13 Nov 24",
    completedDate: "incomplete",
    currency: 1111,
    status: false,
    projectName: "Test",
    fullName: "Jane Smith",
  },
  {
    id: "r0s1t2u3-7c18-47f7-89f2-abe4b7ec2949",
    userId: "123e4567-e89b-12d3-a456-426614174000",
    projectId: "47c80c97-6575-45eb-a25b-75ee485bf9fb",
    taskName: "Data Migration",
    startDate: "15 Aug 24",
    completedDate: "20 Feb 24",
    currency: 2800,
    status: true,
    projectName: "Test",
    fullName: "Alice Brown",
  },
];

export const mockContextValue = {
  tasks: mockTasks,
  setTasks: jest.fn(),
};

export const mockUserService = {
  fetchUsers: jest.fn().mockResolvedValue({
    data: mockUsers,
    error: null,
  }),
  createUser: jest.fn().mockResolvedValue({
    data: {
      id: "new-user",
      fullName: "New User",
      email: "newuser@example.com",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
      earnings: "$0",
      registered: "Dec 19, 2024",
      lastUpdated: "Dec 19, 2024",
    },
    error: null,
  }),
  updateUser: jest.fn().mockResolvedValue({
    data: {
      id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
      fullName: "Updated Joe Bloggs",
      email: "updatedjohn@example.com",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
      earnings: "$12500",
      registered: "May 21, 2024 17:02:06",
      lastUpdated: "Dec 19, 2024",
    },
    error: null,
  }),
};

export const mockTaskService = {
  fetchTasks: jest.fn().mockResolvedValue({
    data: mockTasks,
    error: null,
  }),
  createTask: jest.fn().mockResolvedValue({
    data: {
      id: "new-task",
      taskName: "New Task",
      userId: "d290f1ee-6c54-4b01-90e6-d701748f0851",
      projectId: "f2d32cb6-12c7-4ae7-bb28-74f16d1d2cbb",
      startDate: "Dec 20, 2024",
      completedDate: "incomplete",
      currency: 1000,
      status: false,
      projectName: "Support",
      fullName: "Joe Bloggs",
    },
    error: null,
  }),
  updateTask: jest.fn().mockResolvedValue({
    data: {
      id: "71e564f4-7c18-47f7-89f2-abe4b7ec2854",
      taskName: "Updated Task",
      userId: "d290f1ee-6c54-4b01-90e6-d701748f0851",
      projectId: "f2d32cb6-12c7-4ae7-bb28-74f16d1d2cbb",
      startDate: "Dec 19, 2024",
      completedDate: "incomplete",
      currency: 2000,
      status: true,
      projectName: "Support",
      fullName: "Joe Bloggs",
    },
    error: null,
  }),
};

export const mockProjectService = {
  fetchProjects: jest.fn().mockResolvedValue({
    data: mockProjects,
    error: null,
  }),
  createProject: jest.fn().mockResolvedValue({
    data: {
      id: "new-project",
      projectName: "New Project",
    },
    error: null,
  }),
};

