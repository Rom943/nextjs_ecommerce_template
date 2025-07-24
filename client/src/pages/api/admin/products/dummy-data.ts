// This file provides mock data for development purposes
// Use this when the backend is not available

export const mockProducts = [
  {
    id: 1,
    name: 'Sample Product 1',
    description: 'This is a description for sample product 1',
    price: 29.99,
    discount: 10,
    mainImageUrl: 'https://placehold.co/300x300',
    stock: 15,
    categories: [
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Gadgets' }
    ],
    createdAt: '2025-06-01T10:00:00Z',
    updatedAt: '2025-06-15T14:30:00Z'
  },
  {
    id: 2,
    name: 'Sample Product 2',
    description: 'This is a description for sample product 2',
    price: 49.99,
    discount: 0,
    mainImageUrl: 'https://placehold.co/300x300',
    stock: 8,
    categories: [
      { id: 3, name: 'Clothing' }
    ],
    createdAt: '2025-06-02T11:00:00Z',
    updatedAt: '2025-06-20T09:15:00Z'
  },
  {
    id: 3,
    name: 'Sample Product 3',
    description: 'This is a description for sample product 3',
    price: 99.99,
    discount: 15,
    mainImageUrl: 'https://placehold.co/300x300',
    stock: 3,
    categories: [
      { id: 1, name: 'Electronics' }
    ],
    createdAt: '2025-06-03T09:30:00Z',
    updatedAt: '2025-07-01T16:45:00Z'
  }
];

export const mockCategories = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Gadgets' },
  { id: 3, name: 'Clothing' },
  { id: 4, name: 'Home & Garden' },
  { id: 5, name: 'Books' }
];

export const mockPagination = {
  total: 3,
  page: 1,
  limit: 10,
  totalPages: 1
};
