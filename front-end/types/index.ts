export interface Movie {
  id: string;
  title: string;
  description: string;
  actors: string[];
  ratings: number;
}

export interface Actor {
  id: string;
  name: string;
  lastName: string;
  movies?: string[];
}

export interface User {
  email: string;
  name: string;
}
