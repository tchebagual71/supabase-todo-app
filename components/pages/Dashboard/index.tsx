/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import MainLayout from "@/components/layout/MainLayout";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import FormField from "@/components/shared/FormField";
import Button from "@/components/shared/Button";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TodoItem from "./TodoItem";
import React from "react";
import Image from "next/image";

const Dashboard = () => {
  const validationSchema = Yup.object().shape({
    todoData: Yup.string().required("Required field.")
  });
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const [todos, setTodos] = useState<any>([]);
  const [reloadTodos, setReloadTodos] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    (async () => {
      const { data, error } = await supabaseClient
        .from("todos")
        .select()
        .order("created_at", { ascending: false });
      console.log(data);
      if (error) {
        console.log(error);
        return;
      }
      setTodos(data as any);
    })();
  }, [reloadTodos]);

  const onSubmitFn = async ({ todoData }, { setSubmitting, resetForm }) => {
    let image_url = null;
  
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop();
      const fileName = `todos/${Math.random().toString(36).substring(2)}.${fileExtension}`;
  
      try {
        const { error: uploadError } = await supabaseClient.storage
          .from('todos-images')
          .upload(fileName, selectedFile);
  
        if (uploadError) {
          throw new Error(uploadError.message);
        }
  
        // Directly construct the URL for public access
        image_url = `https://kagqxukzunpizemvxjro.supabase.co/storage/v1/object/public/todos-images/${fileName}`;
        console.log('Image URL:', image_url);
      } catch (error) {
        toast.error(`Failed to upload image: ${error.message}`);
        return;
      }
    }
  
    try {
      const { error } = await supabaseClient
        .from('todos')
        .insert({
          content: todoData,
          user_uuid: user?.id,
          image_url: image_url,
        });
  
      if (error) {
        throw new Error(error.message);
      }
  
      toast.success('Todo added successfully');
      setReloadTodos((state) => !state);
      resetForm();
    } catch (error) {
      toast.error(`There was an error: ${error.message}`);
    } finally {
      setSelectedFile(null);
    }
  };
  
  
  
  

  return (
    <MainLayout className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-16">
        <div className="mt-20 text-center">

          <h1 className="text-display-lg font-bold">create rando😊</h1>
          <p className="text-xl text-gray-600">just select an image and add a comment.</p>
        </div>
        <div className="flex w-full max-w-screen-sm flex-col">
        <Formik
        initialValues={{ todoData: "" }}
        validationSchema={validationSchema}
        onSubmit={(values, formikHelpers) => onSubmitFn(values, formikHelpers)}
      >
        {({ isValid, dirty }) => (
          <Form className="mt-8 flex w-full items-center"> {/* Ensure alignment */}
            <FormField
              fieldName="todoData"
              placeholder="An interesting title or comment..."
              disabled={false}
              className="w-full"
            />

            {/* File input hidden but accessible via label */}
            <input
              id="file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }} // Hide the actual input
            />
            {/* Label styled as a button */}
            <label
              htmlFor="file"
              className="ml-4 inline-block bg-black text-white font-bold py-2 px-4 rounded hover:bg-purple-700 cursor-pointer"
            >
              Choose Image
            </label>

            <Button
              disabled={!dirty || !isValid}
              type="submit"
              customClassName="ml-4"
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
          <div className="mt-4">
          {todos.length ? (
  todos.map((todo: any) => (
    <React.Fragment key={todo.uuid}> 
    <TodoItem
      uuid={todo.uuid}
      done={todo.completed}
      timestamp={todo.created_at}
      setReloadTodos={setReloadTodos}
      className="mt-4"
    >
      {todo.content}
    </TodoItem>
    {todo.image_url && (
      <img
        src={todo.image_url}
        alt="Todo"
        className="mt-2 w-full max-w-xs"
        style={{ maxWidth: '500px', height: 'auto' }} // Optional styling
      />
    )}
  </React.Fragment> 
  ))
) : (
  <p>No Randos😔</p>
)}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
