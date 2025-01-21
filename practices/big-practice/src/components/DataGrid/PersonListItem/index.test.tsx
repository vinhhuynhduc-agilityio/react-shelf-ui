import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ICellRendererParams } from 'ag-grid-community';
import { PersonListItem } from '.';
import { UserData } from '@/types';

const mockData: UserData = {
  id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
  fullName: "Joe Bloggs",
  earnings: "$5000",
  email: "john@example.com",
  avatarUrl: "https://i.pravatar.cc/150?img=1",
  registered: "May 21, 2020 17:02:06",
  lastUpdated: "October 10, 2023 12:30:00"
};

describe('PersonListItem component', () => {
  it('matches snapshot for default state', () => {
    const params: ICellRendererParams<UserData> = { data: mockData } as ICellRendererParams<UserData>;
    const { container } = render(<PersonListItem {...params} />);
    expect(container).toMatchSnapshot();
  });

  it('should render user data correctly', () => {
    const params: ICellRendererParams<UserData> = { data: mockData } as ICellRendererParams<UserData>;

    render(<PersonListItem {...params} />);

    expect(screen.getByText('Joe Bloggs')).toBeInTheDocument();
    expect(screen.getByText('$5000')).toBeInTheDocument();
    const img = screen.getByAltText('User Avatar') as HTMLImageElement;
    expect(img.src).toBe('https://i.pravatar.cc/150?img=1');
  });

  it('should return null when params.data is undefined', () => {
    const params: ICellRendererParams<UserData> = { data: undefined } as ICellRendererParams<UserData>;
    const { container } = render(<PersonListItem {...params} />);

    expect(container.firstChild).toBeNull();
  });
});
