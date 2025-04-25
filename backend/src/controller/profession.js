const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

exports.getAllProfessions = async (req, res) => {
  try {
    const professions = await prisma.profession.findMany({});
    return res.status(200).json({
      professions,
      message: "Successfully fetched professions.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong when fetching profession",
      error,
    });
  }
};
