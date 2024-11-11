import { style } from "../../styles/styles";
import React from "react";

type Props = {};

const Policy = (props: Props) => {
  return (
    <div className="text-black dark:text-white">
      <h1 className={`${style.title} !text-start 800px:!text-[35px] pt-2`}>
        Platform Terms and Conditions
      </h1>
      <ul style={{ listStyle: "unset" }}>
        <p className="py-2 text-[16px] font-Poppins leading-8 whitespace-pre-line">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
          inventore esse doloremque vel optio, incidunt porro quis praesentium
          impedit est! Quisquam, ipsa ab culpa, veniam enim aliquam mollitia
          perspiciatis perferendis deleniti molestias autem voluptas omnis atque
          at animi! Dolorem, officiis. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Corporis maxime perspiciatis voluptatem consectetur
          voluptate optio dicta pariatur mollitia aliquid officiis?
        </p>
        <br />
        <p className="py-2 text-[16px] font-Poppins leading-8 whitespace-pre-line">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
          inventore esse doloremque vel optio, incidunt porro quis praesentium
          impedit est! Quisquam, ipsa ab culpa, veniam enim aliquam mollitia
          perspiciatis perferendis deleniti molestias autem voluptas omnis atque
          at animi! Dolorem, officiis. Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. Rerum, laudantium!
        </p>
        <br />
        <p className="py-2 text-[16px] font-Poppins leading-8 whitespace-pre-line">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
          inventore esse doloremque vel optio, incidunt porro quis praesentium
          impedit est! Quisquam, ipsa ab culpa, veniam enim aliquam mollitia
          perspiciatis perferendis deleniti molestias autem voluptas omnis atque
          at animi! Dolorem, officiis. Lorem ipsum dolor, sit amet consectetur
          adipisicing elit. Tenetur explicabo praesentium, ex mollitia eaque
          aut!
        </p>
        <br />
        <p className="py-2 text-[16px] font-Poppins leading-8 whitespace-pre-line">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
          inventore esse doloremque vel optio, incidunt porro quis praesentium
          impedit est! Quisquam, ipsa ab culpa, veniam enim aliquam mollitia
          perspiciatis perferendis deleniti molestias autem voluptas omnis atque
          at animi! Dolorem, officiis. Lorem ipsum, dolor sit amet consectetur
          adipisicing elit. Accusamus illo nesciunt eaque sequi eveniet iusto
          maxime excepturi at.
        </p>
        <br />
      </ul>
    </div>
  );
};

export default Policy;
