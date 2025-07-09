import type React from "react";
import type { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { DashboardProvider } from "@/contexts/dashboard-context";
import type { Movie, Actor } from "@/types";

// Mock data for testing
export const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Test Movie 1",
    description: "A test movie description",
    actors: "Test Actor 1, Test Actor 2",
    rating: 8.5,
  },
  {
    id: 2,
    title: "Test Movie 2",
    description: "Another test movie description",
    actors: "Test Actor 3, Test Actor 4",
    rating: 7.2,
  },
];

export const mockActors: Actor[] = [
  {
    id: "1",
    name: "John",
    lastName: "Doe",
    movies: ["Test Movie 1"],
  },
  {
    id: "2",
    name: "Jane",
    lastName: "Smith",
    movies: ["Test Movie 1", "Test Movie 2"],
  },
];

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  initialMovies?: Movie[];
  initialActors?: Actor[];
  totalPages?: number;
  currentPage?: number;
}

const AllTheProviders = ({
  children,
  initialMovies = mockMovies,
  initialActors = mockActors,
  totalPages = 1,
  currentPage = 1,
}: {
  children: React.ReactNode;
  initialMovies?: Movie[];
  initialActors?: Actor[];
  totalPages?: number;
  currentPage?: number;
}) => {
  return (
    <DashboardProvider
      initialMovies={initialMovies}
      totalPagesDb={totalPages}
      page={currentPage}
      actors={initialActors}
    >
      {children}
    </DashboardProvider>
  );
};

const customRender = (ui: ReactElement, options: CustomRenderOptions = {}) => {
  const {
    initialMovies,
    initialActors,
    totalPages,
    currentPage,
    ...renderOptions
  } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AllTheProviders
      initialMovies={initialMovies}
      initialActors={initialActors}
      totalPages={totalPages}
      currentPage={currentPage}
    >
      {children}
    </AllTheProviders>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };

// Helper functions for testing
export const createMockMovie = (overrides: Partial<Movie> = {}): Movie => ({
  id: 1,
  title: "Mock Movie",
  description: "Mock description",
  actors: "Mock Actor",
  rating: 8.0,
  ...overrides,
});

export const createMockActor = (overrides: Partial<Actor> = {}): Actor => ({
  id: "1",
  name: "Mock",
  lastName: "Actor",
  movies: ["Mock Movie"],
  ...overrides,
});

// Wait for async operations
export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

// Mock API responses
export const mockApiResponse = (data: any, delay = 0) =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

export const mockApiError = (message = "API Error", delay = 0) =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error(message)), delay)
  );
