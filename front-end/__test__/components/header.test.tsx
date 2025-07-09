import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/components/header";
import { signOut, useSession } from "next-auth/react";
import { jest } from "@jest/globals";

// 🔧 Mock de next-auth
jest.mock("next-auth/react");

describe("Header", () => {
  const mockSignOut = jest.fn();
  const mockMenuClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Simula una sesión activa
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: "John Doe",
          email: "john@example.com",
        },
      },
      status: "authenticated",
    });

    (signOut as jest.Mock) = mockSignOut;
  });

  it("renders user name", () => {
    render(<Header onMenuClick={mockMenuClick} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("calls onMenuClick when menu button is clicked", () => {
    render(<Header onMenuClick={mockMenuClick} />);

    const menuButton = screen.getByRole("button");
    fireEvent.click(menuButton);

    expect(mockMenuClick).toHaveBeenCalled();
  });

  it("opens and closes dropdown", () => {
    render(<Header onMenuClick={mockMenuClick} />);

    const avatarButton = screen.getByRole("button", { name: /john doe/i });
    fireEvent.click(avatarButton);

    expect(screen.getByText("john@example.com")).toBeInTheDocument();

    // Cerrar al hacer click fuera (overlay)
    const overlay = screen.getByRole("presentation");
    fireEvent.click(overlay);

    expect(screen.queryByText("john@example.com")).not.toBeInTheDocument();
  });

  it("calls signOut when clicking Sign out", () => {
    render(<Header onMenuClick={mockMenuClick} />);

    const avatarButton = screen.getByRole("button", { name: /john doe/i });
    fireEvent.click(avatarButton);

    const signOutButton = screen.getByRole("button", { name: /sign out/i });
    fireEvent.click(signOutButton);

    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: "/" });
  });
});
