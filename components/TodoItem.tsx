import React, {Fragment} from 'react';
import {NextPage} from "next";
import {Todo} from "@/typings/db";

interface Props {
  todo: Todo
}

const TodoItem: NextPage<Props> = ({ todo }) => {
  if(!todo) {
    return null;
  }

  return (
    <Fragment>
      <div>ID: {todo.id}</div>
      <div>할 일: {todo.todo}</div>
      <hr />
    </Fragment>
  )
}

export default React.memo(TodoItem);