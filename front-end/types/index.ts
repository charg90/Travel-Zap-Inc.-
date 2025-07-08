export interface Movie {
  id: number;
  title: string;
  description: string;
  actors: string;
  ratings: number;
}

export interface Actor {
  id: number;
  name: string;
  lastName: string;
  movies?: string[];
}

export interface User {
  email: string;
  name: string;
}
