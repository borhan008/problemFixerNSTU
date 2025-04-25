const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

// User
exports.makeComplain = async (req, res) => {
  try {
    const { title, description, complaint_cat_id } = req.body;
    const { user_id } = req.user;

    await prisma.complaints.create({
      data: {
        complaint_title: title,
        complaint_description: description,
        complaint_cat_id: parseInt(complaint_cat_id),
        uid: user_id,
      },
    });
    return res.status(201).json({
      message: "Complaint has been made successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to make a complaint.",
      error,
    });
  }
};

exports.getUserComplaints = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { take, skip } = req.query;
    const search = req?.query?.search || "";

    const count = await prisma.complaints.count({
      where: {
        uid: user_id,
        OR: [
          {
            complaint_title: {
              contains: search,
            },
          },
          {
            complaint_description: {
              contains: search,
            },
          },
        ],
      },
    });
    const complaints = await prisma.complaints.findMany({
      skip: parseInt(skip),
      take: parseInt(take),
      include: {
        ComplaintCataegory: true,
      },
      where: {
        uid: user_id,
        OR: [
          {
            complaint_title: {
              contains: search,
            },
          },
          {
            complaint_description: {
              contains: search,
            },
          },
        ],
      },
    });

    return res.status(200).json({
      message: "Complaints data found",
      complaints,
      count,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while fetching user complaints.",
      error,
    });
  }
};

exports.markAsDone = async (req, res) => {
  try {
    const complaint_id = parseInt(req.params.complaint_id);
    const { user_id } = req.user;
    await prisma.complaints.update({
      data: {
        status: "COMPLETED",
      },
      where: {
        uid: user_id,
        complaint_id,
      },
    });
    return res.status(201).json({
      message: "Update completed",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while mark as done complaint",
      error,
    });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const complaint_id = req.params.complaint_id;
    const { user_id } = req.user;
    await prisma.complaints.delete({
      where: {
        uid: user_id,
        complaint_id,
      },
    });
    return res.status(201).json({
      message: "Deletion completed",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while deleting complaint",
      error,
    });
  }
};

exports.editComplaint = async (req, res) => {
  try {
    const { user_id } = req.user;
    const {
      complaint_id,
      complaint_title,
      complaint_description,
      complaint_cat_id,
    } = req.body;
    const checkComplaint = await prisma.complaints.findUnique({
      where: {
        uid: user_id,
        complaint_id: parseInt(complaint_id),
        status: "DUE",
      },
    });
    if (checkComplaint) {
      await prisma.complaints.update({
        data: {
          complaint_title,
          complaint_description,
          complaint_cat_id: parseInt(complaint_cat_id),
        },
        where: {
          complaint_id: parseInt(complaint_id),
          uid: user_id,
        },
      });
      return res.status(201).json({
        message: "Your complaint is updated.",
      });
    } else {
      return res.status(500).json({
        message:
          "You can't edit the the complaint which doesn't exist or already in processing or completed phase.",
        error: "Error",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while updating the complaint",
      error,
    });
  }
};

exports.getSingleComplaint = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { complaint_id } = req.params;
    const complaint = await prisma.complaints.findUnique({
      where: {
        complaint_id: parseInt(complaint_id),
        uid: user_id,
      },
    });
    if (complaint) {
      return res.status(200).json({
        message: "Complaint data has been found",
        complaint,
      });
    }
    throw new Error("There's no data as you requested.");
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while getting the complaint",
      error,
    });
  }
};

// Admin
exports.getUserComplaintsForAdmin = async (req, res) => {
  try {
    const { role } = req.user;
    if (role != "ADMIN") {
      return res.status(401).json({
        message: "Unauthorised",
        error: "Unauthorised",
      });
    }
    const search = req?.query?.search || "";
    const take = parseInt(req?.query?.take) || 10;
    const skip = parseInt(req?.query?.skip) || 0;
    const complaint_id = parseInt(req?.params?.complaint_id) || 0;

    let whereClause = {
      User: {},
    };

    if (req?.params?.complaint_id && complaint_id != NaN && complaint_id != 0) {
      whereClause.complaint_id = complaint_id;
    }
    if (req?.query?.search) {
      whereClause.OR = [
        {
          complaint_title: {
            contains: req?.query?.search || "",
          },
        },
        {
          complaint_description: {
            contains: req?.query?.search || "",
          },
        },
        {
          User: {
            OR: [
              {
                name: {
                  contains: req?.query?.search || "",
                },
              },
              {
                email: {
                  contains: req?.query?.search || "",
                },
              },
            ],
          },
        },
      ];
    }
    if (
      req?.query?.searchCategoryId &&
      parseInt(req?.query?.searchCategoryId) != 0 &&
      parseInt(req?.query?.searchCategoryId) != NaN
    ) {
      whereClause.complaint_cat_id = parseInt(req?.query?.searchCategoryId);
    }
    if (
      req?.query?.searchStatus &&
      (req?.query?.searchStatus === "PROCESSING" ||
        req?.query?.searchStatus === "DUE" ||
        req?.query?.searchStatus === "COMPLETED")
    ) {
      whereClause.status = req?.query?.searchStatus;
    }
    if (
      req?.query?.searchProfessionId &&
      parseInt(req?.query?.searchProfessionId) != 0 &&
      parseInt(req?.query?.searchProfessionId) != NaN
    ) {
      whereClause.User.profession_id = parseInt(req?.query?.searchProfessionId);
    }
    if (
      req?.query?.searchDepartmentId &&
      parseInt(req?.query?.searchDepartmentId) != 0 &&
      parseInt(req?.query?.searchDepartmentId) != NaN
    ) {
      whereClause.User.department_id = parseInt(req?.query?.searchDepartmentId);
    }

    const complaints = await prisma.complaints.findMany({
      take,
      skip,
      where: whereClause,
      include: {
        User: {
          include: {
            Department: {
              select: {
                dept_shortform: true,
                dept_full_name: true,
              },
            },
            Profession: {
              select: {
                profession_name: true,
              },
            },
          },
        },

        ComplaintCataegory: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const count = await prisma.complaints.count({
      where: whereClause,
    });
    return res.status(200).json({
      message: "Complaints data found",
      complaints,
      count,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while getting the complaints for admin",
      error,
    });
  }
};
