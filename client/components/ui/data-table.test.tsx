import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable, Column } from './data-table';

interface TestUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

const mockData: TestUser[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
];

const mockColumns: Column<TestUser>[] = [
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
    sortable: true,
  },
  {
    key: 'email',
    title: 'Email',
    dataIndex: 'email',
    sortable: true,
  },
  {
    key: 'role',
    title: 'Role',
    dataIndex: 'role',
    sortable: false,
  },
];

describe('DataTable', () => {
  it('renders table headers correctly', () => {
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
      />
    );
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
  });

  it('renders table data correctly', () => {
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
      />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <DataTable 
        data={[]} 
        columns={mockColumns} 
        loading 
      />
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(
      <DataTable 
        data={[]} 
        columns={mockColumns} 
      />
    );
    
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('shows custom empty message', () => {
    render(
      <DataTable 
        data={[]} 
        columns={mockColumns} 
        emptyMessage="No users found"
      />
    );
    
    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  it('handles row selection when selectable', () => {
    const handleRowSelect = vi.fn();
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        selectable
        onRowSelect={handleRowSelect}
      />
    );
    
    // Should show checkboxes
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
    
    // Click first row checkbox
    fireEvent.click(checkboxes[1]); // Skip header checkbox
    
    expect(handleRowSelect).toHaveBeenCalled();
  });

  it('handles select all functionality', () => {
    const handleRowSelect = vi.fn();
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        selectable
        onRowSelect={handleRowSelect}
      />
    );
    
    const selectAllCheckbox = screen.getByLabelText('Select all rows');
    fireEvent.click(selectAllCheckbox);
    
    expect(handleRowSelect).toHaveBeenCalledWith(mockData);
  });

  it('handles column sorting', () => {
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
      />
    );
    
    const nameHeader = screen.getByText('Name');
    
    // Click to sort ascending
    fireEvent.click(nameHeader);
    
    // Click again to sort descending  
    fireEvent.click(nameHeader);
    
    // Click again to remove sorting
    fireEvent.click(nameHeader);
    
    // Should not throw errors and table should still render
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders custom cell content with render function', () => {
    const customColumns: Column<TestUser>[] = [
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
        render: (value) => <strong>{value}</strong>,
      },
    ];

    render(
      <DataTable 
        data={mockData} 
        columns={customColumns} 
      />
    );
    
    expect(screen.getByText('John Doe').tagName).toBe('STRONG');
  });

  it('applies correct ARIA labels for accessibility', () => {
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        selectable
      />
    );
    
    expect(screen.getByLabelText('Select all rows')).toBeInTheDocument();
    expect(screen.getByLabelText('Select row 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Select row 2')).toBeInTheDocument();
  });

  it('sorts data correctly', () => {
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
      />
    );
    
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader); // Sort ascending
    
    const rows = screen.getAllByRole('row');
    // Skip header row, check data rows
    const firstDataRow = rows[1];
    const lastDataRow = rows[rows.length - 1];
    
    // After ascending sort, Bob should come before John
    expect(firstDataRow).toHaveTextContent('Bob Johnson');
  });
});
