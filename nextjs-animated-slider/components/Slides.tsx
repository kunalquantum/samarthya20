import React from "react";
import SliderCard from "./SliderCard";

type Data = {
  img: string;
  title: string;
  location: string;
  url: string; // Ensure the url property is included
};

type Props = {
  data: Data[]; // Array of Data objects
};

function Slides({ data }: Props) {
  return (
    <div className="flex space-x-4 overflow-x-auto">
      {data.map((item) => (
        <SliderCard key={item.img} data={item} />
      ))}
    </div>
  );
}

export default Slides;
