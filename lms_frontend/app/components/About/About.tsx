import { style } from "../../styles/styles";
import React from "react";

type Props = {};

const About = (props: Props) => {
  return (
    <div className="text-black dark:text-white pb-5">
      <br />
      <h1 className={`${style.title} 800px:!text-[45px]`}>
        What is <span className="text-gradient">E-Learning?</span>
      </h1>
      <br />
      <div>
        <p className="text-[17px] font-Poppins">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. In,
          consequatur! Veniam quis laborum velit quidem! Nisi explicabo,
          sapiente excepturi perspiciatis repudiandae magni odit quidem? Autem,
          adipisci odio sit tempora dolorum reprehenderit asperiores facere vero
          dolorem mollitia, magnam sunt! Quo, iure.
          <br />
          <br />
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. In,
          consequatur! Veniam quis laborum velit quidem! Nisi explicabo,
          sapiente excepturi perspiciatis repudiandae magni odit quidem? Autem,
          adipisci odio sit tempora dolorum reprehenderit asperiores facere vero
          dolorem mollitia, magnam sunt! Quo, iure. Lorem ipsum dolor sit, amet
          consectetur adipisicing elit. Voluptatibus non doloremque natus ex
          vero ullam iure dignissimos perferendis, aliquam dolor!
          <br />
          <br />
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. In,
          consequatur! Veniam quis laborum velit quidem! Nisi explicabo,
          sapiente excepturi perspiciatis repudiandae magni odit quidem? Autem,
          adipisci odio sit tempora dolorum reprehenderit asperiores facere vero
          dolorem mollitia, magnam sunt! Quo, iure. Lorem ipsum dolor sit, amet
          consectetur adipisicing elit. Sunt quae tempore, sit soluta quis
          ipsum!
          <br />
          <br />
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. In,
          consequatur! Veniam quis laborum velit quidem! Nisi explicabo,
          sapiente excepturi perspiciatis repudiandae magni odit quidem? Autem,
          adipisci odio sit tempora dolorum reprehenderit asperiores facere vero
          dolorem mollitia, magnam sunt! Quo, iure.
          <br />
          <br />
          <p className="text-[18px] text-center">
            Created by <span className="text-gradient">Jeevan Choudhary</span>
          </p>
        </p>
      </div>
    </div>
  );
};

export default About;
