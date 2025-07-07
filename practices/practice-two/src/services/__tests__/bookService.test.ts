import { getBooks } from '../bookService';
import { apiRequest } from '../apiRequest';

jest.mock('../apiRequest');

describe('getBooks', () => {
  it('calls apiRequest with correct params and returns books', async () => {
    const books = [{ id: '1', title: 'Book' }];
    (apiRequest as jest.Mock).mockResolvedValue(books);
    const result = await getBooks();
    expect(apiRequest).toHaveBeenCalledWith('GET', expect.stringContaining('/books'));
    expect(result).toEqual(books);
  });
});
