import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import SidebarCollapseItem from './SidebarCollapseItem';
import SidebarItem from './SidebarItem';

describe('Sidebar', () => {
  it('renders navigation items and collapses on toggle', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Rules').length).toBeGreaterThan(0);
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Management')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Collapse sidebar/i }));

    expect(screen.getByRole('button', { name: /Expand sidebar/i })).toBeInTheDocument();
  });

  it('marks the active item based on the current route', () => {
    render(
      <MemoryRouter initialEntries={['/rules']}>
        <Sidebar />
      </MemoryRouter>
    );

    // The main "Rules" nav item (Management also contains a Rules link)
    const rulesLinks = screen.getAllByText('Rules').map((el) => el.closest('a')!);
    const mainRulesLink = rulesLinks.find((link) => link.getAttribute('href') === '/rules')!;
    expect(mainRulesLink).toHaveAttribute('data-active', 'true');
  });

  it('expands the sidebar when the collapsed Management group is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Sidebar />
      </MemoryRouter>
    );

    // Collapse the sidebar
    await user.click(screen.getByRole('button', { name: /Collapse sidebar/i }));
    expect(screen.getByRole('button', { name: /Expand sidebar/i })).toBeInTheDocument();

    // Click the collapsed Management group -> Sidebar expands (onExpand wiring)
    await user.click(screen.getByRole('button', { name: /Management/i }));

    expect(screen.getByRole('button', { name: /Collapse sidebar/i })).toBeInTheDocument();
  });
});

describe('SidebarItem', () => {
  it('renders a link with the label and computes active state', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <SidebarItem icon={<span>icon</span>} label="Dashboard" collapsed={false} to="/dashboard" />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: /Dashboard/i });
    expect(link).toHaveAttribute('href', '/dashboard');
    expect(link).toHaveAttribute('data-active', 'true');
  });

  it('respects an explicit active prop', () => {
    render(
      <MemoryRouter initialEntries={['/other']}>
        <SidebarItem icon={<span>icon</span>} label="Users" collapsed={false} to="/users" active />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: /Users/i });
    expect(link).toHaveAttribute('data-active', 'true');
  });
});

describe('SidebarCollapseItem', () => {
  it('expands and collapses children', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SidebarCollapseItem icon={<span>icon</span>} label="Management" collapsed={false}>
          <div>Child Item</div>
        </SidebarCollapseItem>
      </MemoryRouter>
    );

    // Collapsed children are visually hidden (max-height 0)
    const childContainer = screen.getByText('Child Item').parentElement!;
    expect(childContainer.className).toMatch(/max-h-0/);

    await user.click(screen.getByRole('button', { name: /Management/i }));
    expect(childContainer.className).toMatch(/max-h-screen/);

    await user.click(screen.getByRole('button', { name: /Management/i }));
    expect(childContainer.className).toMatch(/max-h-0/);
  });

  it('expands immediately and calls onExpand when collapsed', async () => {
    const onExpand = jest.fn();
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SidebarCollapseItem icon={<span>icon</span>} label="Management" collapsed onExpand={onExpand}>
          <div>Child Item</div>
        </SidebarCollapseItem>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /Management/i }));
    expect(onExpand).toHaveBeenCalled();
  });
});
