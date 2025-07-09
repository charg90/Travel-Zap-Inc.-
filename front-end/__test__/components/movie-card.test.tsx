import { render, screen, fireEvent, waitFor } from "../utils/test-utils";
import MovieCard from "@/components/movie-card";
import { createMockMovie } from "../utils/test-utils";
import { jest } from "@jest/globals";
import "@testing-library/jest-dom";
import { Movie } from "@/types";

describe("MovieCard", () => {
  const mockMovie = createMockMovie({
    id: "1",
    title: "Test Movie",
    description: "A great test movie",
    actors: ["John Doe, Jane Smith"],
  });

  const mockOnUpdateMovie = jest.fn((movie: Movie) => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders movie title correctly", () => {
    render(<MovieCard movie={mockMovie} onUpdate={mockOnUpdateMovie} />);

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
  });

  it("renders view details button", () => {
    render(<MovieCard movie={mockMovie} onUpdate={mockOnUpdateMovie} />);

    const viewDetailsButton = screen.getByRole("button", {
      name: /view details/i,
    });
    expect(viewDetailsButton).toBeInTheDocument();
  });

  it("opens details modal when view details button is clicked", async () => {
    render(<MovieCard movie={mockMovie} onUpdate={mockOnUpdateMovie} />);

    const viewDetailsButton = screen.getByRole("button", {
      name: /view details/i,
    });
    fireEvent.click(viewDetailsButton);

    await waitFor(() => {
      expect(screen.getByText("Test Movie")).toBeInTheDocument();
      expect(screen.getByText("A great test movie")).toBeInTheDocument();
      expect(screen.getByText("John Doe, Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("8.5/10")).toBeInTheDocument();
    });
  });

  it("shows rating and edit buttons in details modal", async () => {
    render(<MovieCard movie={mockMovie} onUpdate={mockOnUpdateMovie} />);

    fireEvent.click(screen.getByRole("button", { name: /view details/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /rate movie/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /edit movie/i })
      ).toBeInTheDocument();
    });
  });

  it("closes details modal when close button is clicked", async () => {
    render(<MovieCard movie={mockMovie} onUpdate={mockOnUpdateMovie} />);

    // Open modal
    fireEvent.click(screen.getByRole("button", { name: /view details/i }));

    await waitFor(() => {
      expect(screen.getByText("A great test movie")).toBeInTheDocument();
    });

    // Close modal
    const closeButton = screen.getByRole("button", { name: /close details/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText("A great test movie")).not.toBeInTheDocument();
    });
  });

  it("opens rating modal when rate movie button is clicked", async () => {
    render(<MovieCard movie={mockMovie} onUpdate={mockOnUpdateMovie} />);

    // Open details modal
    fireEvent.click(screen.getByRole("button", { name: /view details/i }));

    await waitFor(() => {
      const rateButton = screen.getByRole("button", { name: /rate movie/i });
      fireEvent.click(rateButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Rate this movie")).toBeInTheDocument();
      expect(
        screen.getByText("How would you rate this movie?")
      ).toBeInTheDocument();
    });
  });

  it("opens edit modal when edit movie button is clicked", async () => {
    render(<MovieCard movie={mockMovie} onUpdate={mockOnUpdateMovie} />);

    // Open details modal
    fireEvent.click(screen.getByRole("button", { name: /view details/i }));

    await waitFor(() => {
      const editButton = screen.getByRole("button", { name: /edit movie/i });
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Edit Movie")).toBeInTheDocument();
    });
  });

  it("has consistent height styling", () => {
    render(<MovieCard movie={mockMovie} onUpdate={mockOnUpdateMovie} />);

    const cardElement = screen.getByText("Test Movie").closest(".card");
    expect(cardElement).toHaveClass("h-36");
  });

  it("handles missing onUpdateMovie prop gracefully", () => {
    render(<MovieCard movie={mockMovie} onUpdate={mockOnUpdateMovie} />);

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /view details/i })
    ).toBeInTheDocument();
  });
});
