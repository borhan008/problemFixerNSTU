const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

exports.getUserRole = async ({ uid }) => {
  const user = await prisma.user.findUnique({
    where: {
      uid,
    },
  });

  return user?.role || "UNREGISTERED";
};
