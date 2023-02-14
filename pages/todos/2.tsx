import type { NextPage } from "next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {ChangeEvent, FormEvent, FormEventHandler, Fragment, useCallback, useState} from "react";
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


const TodosPage2: NextPage = () => {
  const [todo, setTodo] = useState("");

  const queryClient = useQueryClient();

  const {
    data: todos,
    isLoading,
    isError,
    error,
  } = useQuery<Todo[], Error>(["todos"], getTodos, {
    refetchOnWindowFocus: false,
  });


  const { mutate } = useMutation(addTodo, {
    onSuccess: (data) => {
      queryClient.setQueryData<Todo[]>(["todos"], (oldData) => {
        // 여기서 데이터를 무효화 시키지 않고 그대로 넣어준다.
        // 단점은 서버와 데이터가 안맞을 수 있다.
        console.log('oldData', oldData)
        if(!oldData) {
          return [];
        }

        return [...oldData, { id: data.id, todo: data.todo, done: false}]
      })
    },
  });

  const onSubmit: FormEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      mutate(todo);
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


export default TodosPage2;