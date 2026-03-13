import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // model("User", userSchema)
      required: true,
    },
    subTodos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubTodo', // mongoose.model("SubTodo", subTodoSchema);
      },
    ], // array of sub-todos
  },
  { timestamps: true }
);

export const Todo = mongoose.model('Todo', todoSchema); // todos
