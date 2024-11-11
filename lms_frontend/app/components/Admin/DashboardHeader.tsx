import React, { FC, useEffect, useState } from "react";
import ThemeSwitcher from "../../utils/ThemeSwitcher";
import { IoMdNotificationsOutline } from "react-icons/io";
import socketIO from "socket.io-client";
import {
  useGetAllNotificationsQuery,
  useUpdateNotificationStatusMutation,
} from "../../../redux/features/notifications/notificationApi";
import { format } from "timeago.js";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, {
  transports: ["websocket"],
});

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DashboardHeader: FC<Props> = ({ open, setOpen }) => {
  const { data, refetch } = useGetAllNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateNotificationStatus, { isSuccess }] =
    useUpdateNotificationStatusMutation();

  const [notifications, setNotifications] = React.useState<any[]>();

  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const audioInstance = new Audio(
        "https://res.cloudinary.com/jeevan27/video/upload/v1731219484/preview_wyixxl.mp3"
      );
      setAudio(audioInstance);
    }
  }, []);

  const playerNotificationSound = () => {
    if (audio && audio.readyState >= 3) {
      audio.play();
    }
  };

  useEffect(() => {
    if (data) {
      setNotifications(
        data?.notifications.filter((item: any) => item.status === "unread")
      );
    }
    if (isSuccess) {
      refetch();
    }
    if (audio) {
      audio.load();
    }
  }, [data, isSuccess, audio]);

  useEffect(() => {
    socketId.on("newNotification", (data) => {
      refetch();
      playerNotificationSound();
    });
  }, []);

  const handleNotificationStatusChange = async (id: string) => {
    await updateNotificationStatus(id);
  };

  return (
    <div className="w-full flex items-center justify-end p-6 fixed top-1 right-0">
      <ThemeSwitcher />
      <div
        className="relative cursor-pointer m-2"
        onClick={() => setOpen(!open)}
      >
        <IoMdNotificationsOutline className="text-2xl cursor-pointer text-black dark:text-white" />
        <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white">
          {notifications && notifications.length}
        </span>
      </div>
      {open && (
        <div className="w-[350px] h-[50vh] dark:bg-[#111C43] bg-white shadow-2xl absolute top-16 -z-10 rounded px-1 py-1 overflow-auto border-l border-t border-[#0000003d] dark:border-[#ffffff3d]">
          <h5 className="text-black dark:text-white text-center text-[20px] p-3 font-Poppins">
            Notifications
          </h5>
          {notifications && notifications.length === 0 && (
            <div className="w-full h-[35vh] flex items-center justify-center">
              <p>No Notifications !!</p>
            </div>
          )}
          {notifications &&
            notifications.map((notification: any, index: number) => (
              <div
                key={index}
                className="dark:bg-[#2d3a4ea1] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f] mb-1 rounded"
              >
                <div className="w-full flex items-center justify-between p-1">
                  <p className="text-black dark:text-white">
                    {notification?.title}
                  </p>
                  <p
                    className="dark:text-[#3ccba0] text-[#000000b3] cursor-pointer text-[12px]"
                    onClick={() =>
                      handleNotificationStatusChange(notification?._id)
                    }
                  >
                    Mark as read
                  </p>
                </div>
                <p className="px-2 text-black dark:text-white text-[14px]">
                  {notification?.message}
                </p>
                <p className="text-[#0000008a] dark:text-[#ffffffb3] text-[12px] p-2">
                  {format(notification?.createdAt)}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
