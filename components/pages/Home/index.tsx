/* eslint-disable @next/next/no-img-element */
/* eslint-disable tailwindcss/no-custom-classname */
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader


interface TodoItem {
  id: number; // Adjust according to your actual data model if necessary.
  content: string;
  image_url?: string;
}


const HomePage = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const supabaseClient = useSupabaseClient();

  

  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabaseClient
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTodos(data as TodoItem[]);
        
      } else {
        // eslint-disable-next-line no-console
        console.error("Error fetching todos:");
      }
    };

    fetchTodos();
  }, [supabaseClient]);

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center px-16">
        <div className="mt-20 text-center">
        <h1 className="text-display-lg font-bold">randos😊</h1>
          <p className="text-xl text-gray-600">Enjoy.</p>
                  </div>
        <div className="w-full max-w-screen-md">
          {todos.length > 0 && (
            <Carousel

              showThumbs={false}
              showStatus={false}

              interval={5000}
              transitionTime={1000}
              useKeyboardArrows
              emulateTouch
              swipeable
              dynamicHeight
              stopOnHover
            >
              {todos.map((todo) => (
                // eslint-disable-next-line tailwindcss/no-custom-classname
                <div key={todo.id} className="carousel-item">
                  <img src={todo.image_url} alt="Todo" />
                  <p className="legend">{todo.content}</p>
                </div>
              ))}
            </Carousel>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
