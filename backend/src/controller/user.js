const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

exports.getUserData = async (req, res) => {
  try {
    const { user_id } = req.user;
    const user = await prisma.user.findUnique({
      where: {
        uid: user_id,
      },
    });
    if (user) {
      return res.status(200).json({
        message: "User found",
        user,
      });
    }
    throw new Error("Didn't register yet");
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Couldn't find data",
      error,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { user_id, name, email } = req.user;
    const { mobile, department_id, profession_id, roll } = req.body;

    const checkUserExists = await prisma.user.findUnique({
      where: {
        uid: user_id,
      },
    });
    let user;
    if (!checkUserExists) {
      user = await prisma.user.create({
        data: {
          uid: user_id,
          name,
          email,
          mobile,
          department_id,
          profession_id,
          roll,
        },
      });
    } else {
      user = await prisma.user.update({
        data: {
          mobile,
          department_id,
          roll,
        },
        where: {
          uid: user_id,
        },
      });
    }
    return res.status(201).json({
      message: "User updated/created successully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while creating/updating user.",
      error,
    });
  }
};
