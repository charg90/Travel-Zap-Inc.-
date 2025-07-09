import { render, screen, fireEvent } from "@testing-library/react";
import ActorCard from "@/components/actor-card";
import type { Actor } from "@/types";
import { jest } from "@jest/globals";

// Mock del modal de edición
jest.mock("@/components/modals/edit-actor-modal", () => ({
  __esModule: true,
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div>Edit Modal Content</div> : null,
}));

const mockActor: Actor = {
  id: "1",
  name: "Leonardo",
  lastName: "DiCaprio",

  movies: ["Inception", "Titanic"],
};

describe("ActorCard", () => {
  it("renders actor name and last name", () => {
    render(<ActorCard actor={mockActor} />);

    expect(screen.getByText("Leonardo DiCaprio")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /view details/i })
    ).toBeInTheDocument();
  });

  it("opens the details modal when 'View Details' is clicked", () => {
    render(<ActorCard actor={mockActor} />);

    fireEvent.click(screen.getByRole("button", { name: /view details/i }));

    expect(screen.getByText(/filmography/i)).toBeInTheDocument();
    expect(screen.getByText(/inception/i)).toBeInTheDocument();
    expect(screen.getByText(/titanic/i)).toBeInTheDocument();
    expect(screen.getByText(/movies count/i)).toBeInTheDocument();
    expect(screen.getByText(/actor id/i)).toBeInTheDocument();
  });

  it("closes the details modal when 'Close' button is clicked", () => {
    render(<ActorCard actor={mockActor} />);

    fireEvent.click(screen.getByRole("button", { name: /view details/i }));

    const closeBtn = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByText(/filmography/i)).not.toBeInTheDocument();
  });

  it("opens the edit modal when 'Edit Actor' is clicked", () => {
    render(<ActorCard actor={mockActor} />);

    fireEvent.click(screen.getByRole("button", { name: /view details/i }));

    const editBtn = screen.getByRole("button", { name: /edit actor/i });
    fireEvent.click(editBtn);

    expect(screen.getByText("Edit Modal Content")).toBeInTheDocument();
  });

  it("calls onUpdateActor if passed and actor is edited (modal mocked)", () => {
    const mockOnUpdateActor = jest.fn();

    render(<ActorCard actor={mockActor} onUpdateActor={mockOnUpdateActor} />);

    fireEvent.click(screen.getByRole("button", { name: /view details/i }));
    fireEvent.click(screen.getByRole("button", { name: /edit actor/i }));

    expect(mockOnUpdateActor).not.toHaveBeenCalled();
  });
});
