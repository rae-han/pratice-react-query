import type { NextPage } from "next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ChangeEvent, FormEvent, Fragment, useCallback, useState } from "react";
import { Todo } from "@/typings/db";
import DefaultLayout from "@/layouts/DefaultLayout";
import TodoItem from '@/components/TodoItem'

const getTodos = async () => {
  const { data } = await axios.get<Todo[]>("http://localhost:3055/todos");
  return data;
};


const addTodo = async (todo: string) => {
  const { data } = await axios.post<Todo>("http://localhost:3055/todos", {
    todo,
    done: false,
  });

  return data;
};


const TodosPage1: NextPage = () => {
  const [todo, setTodo] = useState("");

  const queryClient = useQueryClient();

  const {
    data: todos,
    isLoading,
    isError,
    error,
  } = useQuery<Todo[], Error>(["todos"], getTodos, {
    // 6. ['todos'] 쿼리키를 갖는 쿼리 refetch
    // 7. getTodos 호출(Get 요청)
    refetchOnWindowFocus: false,
  });


  const { mutate } = useMutation(addTodo, { // 3. addTodo 호출 (Post 요청)
    onSuccess: () => { // 4. onSuccess 호출
      queryClient.invalidateQueries(["todos"]); // 5. ['todos'] 쿼리키를 갖는 쿼리 데이터 무효화
    },
  });

  // Option(Post에 대한 사전 요청) -> Post -> Get
  // 순서는 숫자로.
  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      mutate(todo); // 2. mutate 호출
      setTodo("");
    },
    [mutate, todo]
  );


  if (isError) {
    return <div>{error.message}</div>;
  }


  return (
    <DefaultLayout>
      <form onSubmit={onSubmit}>
        {/* 1. onSubmit 호출 (버틀 클릭 or 인풋 엔터)*/}
        <label>할 일: </label>
        <input
          type="text"
          value={todo}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTodo(e.target.value)
          }
        />
        <button type="submit">작성</button>
      </form>


      <br />


      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          todos?.map((todo) => <TodoItem todo={todo} key={todo.id} />)
        )}
      </div>
    </DefaultLayout>
  );
};


export default TodosPage1;