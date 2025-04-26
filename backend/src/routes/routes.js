const {
  makeComplain,
  getUserComplaints,
  markAsDone,
  editComplaint,
  getSingleComplaint,
  getUserComplaintsForAdmin,
  resolveComplaintForAdmin,
} = require("../controller/complain");
const {
  getComplaintCategories,
  createComplaintCategory,
  editComplaintCategory,
  deleteComplaintCategory,
} = require("../controller/complainCategories");
const {
  getAllDepartment,
  createDepartment,
  editDepartment,
  deleteDepartment,
} = require("../controller/department");
const {
  getAllEmployees,
  createEmployee,
  editEmployee,
  deleteEmployee,
} = require("../controller/employee");
const {
  getAllEmployeeCategories,
  editEmployeeCategory,
  createEmployeeCategory,
  deleteEmployeeCategory,
} = require("../controller/employeeCategory");
const { getAllProfessions } = require("../controller/profession");
const { createUser, getUserData } = require("../controller/user");

const router = require("express").Router();

// user create
router.post("/user/create", createUser);
router.get("/user", getUserData);

//departments
router.get("/departments", getAllDepartment);
router.post("/department", createDepartment);
router.put("/department/:department_id", editDepartment);
router.delete("/department/:department_id", deleteDepartment);

// profession
router.get("/profession", getAllProfessions);

// Complaint Categories
router.get("/complaint/category", getComplaintCategories);
router.post("/complaint/category", createComplaintCategory);
router.put("/complaint/category/:complaint_cat_id", editComplaintCategory);
router.delete("/complaint/category/:complaint_cat_id", deleteComplaintCategory);

//complaint
router.post("/complaint", makeComplain);
router.get("/complaint", getUserComplaints);
router.get("/complaint/:complaint_id", getSingleComplaint);
router.put("/complaint/done/:complaint_id", markAsDone);
router.put("/complaint/edit", editComplaint);

// Complaint Categories
router.get("/complaint/category", getComplaintCategories);
router.post("/complaint/category", createComplaintCategory);
router.put("/complaint/category/:complaint_cat_id", editComplaintCategory);
router.delete("/complaint/category/:complaint_cat_id", deleteComplaintCategory);

// Employees Category
router.get("/employees/category", getAllEmployeeCategories);
router.post("/employees/category", createEmployeeCategory);
router.put("/employees/category/:emp_category_id", editEmployeeCategory);
router.delete("/employees/category/:emp_category_id", deleteEmployeeCategory);

// Employee
router.get("/employee", getAllEmployees);
router.post("/employee", createEmployee);
router.put("/employee/:employee_id", editEmployee);
router.delete("/employee/:employee_id", deleteEmployee);

// Admin

// Complaints
router.get("/admin/complaints", getUserComplaintsForAdmin);
router.get("/admin/complaint/:complaint_id", getUserComplaintsForAdmin);
router.post("/admin/complaint/resolve", resolveComplaintForAdmin);

module.exports = router;
