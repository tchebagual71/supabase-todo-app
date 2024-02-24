import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

const HomePage = () => {
  const [todos, setTodos] = useState([]);
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabaseClient
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching todos:", error);
      } else {
        setTodos(data);
      }
    };

    fetchTodos();
  }, []);

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
              showArrows={true}
              infiniteLoop={true}
              showThumbs={false}
              showStatus={false}
              autoPlay={true}
              interval={5000}
              transitionTime={1000}
              useKeyboardArrows
              emulateTouch
              swipeable
              dynamicHeight
              stopOnHover
            >
              {todos.map((todo) => (
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
