require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncError.middleware";
import { IUser, UserModel } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendEmail from "../utils/mailSender";
import sendToken, {
  accessTokenOptions,
  refreshTokenOptions,
} from "../utils/jwt";
import { redis } from "../utils/redis";
import {
  getAllUsersService,
  getUserById,
  updateUserRoleService,
} from "../services/user.service";
import cloudinary from "cloudinary";

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

// user register
const userRegister = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body as IRegistrationBody;

    const isEmailExist = await UserModel.findOne({ email });
    if (isEmailExist) {
      return next(new ErrorHandler("Email already exists", 400));
    }

    const user: IRegistrationBody = {
      name,
      email,
      password,
    };
    const activationToken = createActivationToken(user);
    const activationCode = activationToken.activationCode;

    const dataForEmail = { user: { name: user.name }, activationCode };

    const html = await ejs.renderFile(
      path.join(__dirname, "../mails/activationMail.ejs"),
      dataForEmail
    );

    try {
      await sendEmail({
        email: user.email,
        subject: "Activate your account",
        template: "activationMail.ejs",
        data: { user: { name: user.name }, activationCode },
      });
      res.status(200).json({
        success: true,
        message: `Please check your email ${user.email} to activate your account.`,
        activationToken: activationToken.token,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_TOKEN_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

interface IActivationBody {
  activation_code: string;
  activation_token: string;
}

// activating user
const userActivation = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_code, activation_token } = req.body as IActivationBody;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET as Secret
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code.", 400));
      }

      const { name, email, password } = newUser.user;
      const isEmailExist = await UserModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      const addUser = await UserModel.create({
        name,
        email,
        password,
      });

      return res.status(201).json({
        success: true,
        message: "user activated and registered successfully.",
        userDetails: {},
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// user login
interface ILoginBody {
  email: string;
  password: string;
}

const userLogin = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginBody;

      if (!email || !password) {
        return next(new ErrorHandler("please provide email and password", 400));
      }

      const user = await UserModel.findOne({ email }).select("+password");
      if (!user) {
        return next(
          new ErrorHandler("User not found, invalid email or password", 400)
        );
      }

      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      await sendToken(user, res, 200);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// user logout
const userLogout = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      await redis.del(req.user?._id as string);
      res.status(200).json({
        success: true,
        message: "Logged out successfully.",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// update access token
const updateAccessToken = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;

      if (!refresh_token) {
        return next(new ErrorHandler("Could not find refresh token", 400));
      }

      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as JwtPayload;

      if (!decoded) {
        return next(new ErrorHandler("Could not refresh token", 400));
      }

      const session = await redis.get(decoded.id as string);

      if (!session) {
        return next(
          new ErrorHandler("Please login to access this resource!", 400)
        );
      }

      const user = JSON.parse(session);
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET as Secret,
        { expiresIn: "5m" }
      );
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET as Secret,
        { expiresIn: "3d" }
      );

      req.user = user; // but why?

      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      await redis.set(
        user._id as string,
        JSON.stringify(user),
        "EX",
        7 * 24 * 60 * 60 // expires in 7 days
      );

      next();
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get user info
const getUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.user?._id as string;
      await getUserById(id, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// social auth
interface ISocialAuthBody {
  name: string;
  email: string;
  avatar: string;
}

const socialAuth = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, avatar } = req.body as ISocialAuthBody;
      const user = await UserModel.findOne({ email: email });

      if (!user) {
        let newAvatar = {};
        if (avatar) {
          const myCloudImage = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });

          newAvatar = {
            public_id: myCloudImage.public_id,
            url: myCloudImage.secure_url,
          };
        }
        const newUser = await UserModel.create({
          name,
          email,
          avatar: newAvatar,
        });
        await sendToken(newUser, res, 200);
      } else {
        if (avatar && user) {
          if (user?.avatar?.public_id) {
            await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

            const myCloudImage = await cloudinary.v2.uploader.upload(avatar, {
              folder: "avatars",
              width: 150,
            });
            user.avatar = {
              public_id: myCloudImage.public_id,
              url: myCloudImage.secure_url,
            };
          } else {
            // for social auth we dont get public_id.
            const myCloudImage = await cloudinary.v2.uploader.upload(avatar, {
              folder: "avatars",
              width: 150,
            });
            user.avatar = {
              public_id: myCloudImage.public_id,
              url: myCloudImage.secure_url,
            };
          }
        }
        await user.save();
        await sendToken(user, res, 200);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// update-user-info
interface IUpdateUserBody {
  name: string;
  email: string;
}

const updateUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body as IUpdateUserBody;
      const id = req.user?._id;

      const user = await UserModel.findById(id);

      if (name && user) {
        user.name = name;
      }

      await user?.save();

      await redis.set(id as string, JSON.stringify(user) as any);

      res.status(201).json({
        success: true,
        message: "User details updated successfully",
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// update-user-password
interface IUpdatePasswordBody {
  oldPassword: string;
  newPassword: string;
}

const updatePasswrod = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePasswordBody;

      if (!oldPassword || !newPassword) {
        return next(new ErrorHandler("Please enter old and new password", 400));
      }

      const user = await UserModel.findById(req.user?._id).select("+password");
      // user with social authentication
      if (user?.password === undefined) {
        return next(new ErrorHandler("Invalid user", 400));
      }

      const isPassMatch = await user?.comparePassword(oldPassword);
      if (isPassMatch) {
        user.password = newPassword;
      } else {
        return next(
          new ErrorHandler("Please enter previous password correctly", 400)
        );
      }

      await user?.save();

      await redis.set(user?._id as string, JSON.stringify(user) as any);

      return res.status(200).json({
        success: true,
        message: "Password modified successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// updating user avatar
interface IUpdateAvatarBody {
  avatar: string;
}

const updateUserAvatar = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateAvatarBody;

      const user = await UserModel.findById(req.user?._id);

      if (avatar && user) {
        if (user?.avatar?.public_id) {
          await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

          const myCloudImage = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });
          user.avatar = {
            public_id: myCloudImage.public_id,
            url: myCloudImage.secure_url,
          };
        } else {
          // for social auth we dont get public_id.
          const myCloudImage = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });
          user.avatar = {
            public_id: myCloudImage.public_id,
            url: myCloudImage.secure_url,
          };
        }
      }

      await user?.save();
      await redis.set(user?._id as string, JSON.stringify(user) as any);

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all users
const getAllUsers = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUsersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// update user role
const updateUserRole = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, role } = req.body;
      if (!email || !role) {
        return next(new ErrorHandler("Please enter email and role", 400));
      }
      const user = await UserModel.findOne({ email });
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      if (user && user._id) {
        const id = user._id.toString() as string;
        updateUserRoleService(res, id, role);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// delete user -- by admin
const deleteUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      await user.deleteOne({ id });
      await redis.del(id as string);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export {
  userRegister,
  userActivation,
  userLogin,
  userLogout,
  updateAccessToken,
  getUserInfo,
  socialAuth,
  updateUserInfo,
  updatePasswrod,
  updateUserAvatar,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
