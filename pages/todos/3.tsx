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


const TodosPage: NextPage = () => {
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

  const { mutate } = useMutation<Todo, Error, string, { previousTodos: Todo[] | undefined }>(addTodo, {
    onMutate: async (newTodo) => { // 2. mutate 함수 실행 전에 onMutate 메소드 호출
      await queryClient.cancelQueries(['todos']); // 3. cancelQueires를 실행하여 혹시 발생할지도 모르는 refetch를 취소하여 Optimistic Update의 데이터를 덮어쓰지 않도록 예방

      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']); // 4. getQueryData를 이용하여 서버에 전송한 요청이 잘못됐을 경우를 대비하여 이 전 데이터를 저장

      queryClient.setQueryData<Todo[]>(['todos'], (oldData) => {
        // 5. setQeuryData를 이용하여 ['todos'] 쿼리 키를 갖는 쿼리를 업데이트 함.
        // 5. 서버의 응답이 오기 전에 UI를 미리 업데이트 하기 위함임
        if (!oldData) {
          return [];
        }

        return [
          ...oldData,
          { id: oldData.length + 1, todo: newTodo, done: false },
        ];
      });

      return { previousTodos }; // 6. 에러 발생 시 복원할 수 있도록 이전 데이터(previousTodos)를 반환. onError의 context로 들어간다.
    },
    onError: (_error, _newTodo, context) => {
      queryClient.setQueryData(['todos'], context?.previousTodos); // 7-2. 에러가 발생했을 경우 저장해뒀던 백업 데이터로 데이터를 복원한다.
    },
    onSettled: () => {
      queryClient.invalidateQueries(['todos']); // 7-1. onSettled 는 성공, 실패 시 모두 발생하는 메서드로 ['todos'] 쿼리 키를 갖는 쿼리를 무효화 시켜 refetch 한 후 데이터를 서버와 일치시킨다.
    },
  });

  const onSubmit: FormEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      mutate(todo); // 1. mutate 함수 호출
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


export default TodosPage;