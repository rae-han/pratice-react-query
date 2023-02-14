export interface Post {
  id: number;
  title: string;
  author: string;
  description: string
}

export interface User {
  email: string;
  nickname: string;
  postId: number;
}

export interface Todo {
  id: number;
  todo: string;
  done: boolean;
}