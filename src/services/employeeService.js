import api from "./interceptors";

export const fetchEmployeesByDepartment = async () => {
  try {
    const response = await api.get("/employees/sub-bidang", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }

    return {
      success: false,
      message: response.data.message || "Failed to fetch employees",
      data: {},
    };
  } catch (error) {
    return error; // Error is already formatted by interceptor
  }
};

// Helper function to get departments list
export const getDepartments = (employeesData) => {
  return Object.keys(employeesData);
};

// Helper function to get supervisor (Asman) for a department
export const getDepartmentSupervisor = (employeesData, department) => {
  if (!employeesData[department]) return null;
  return employeesData[department].find((employee) => employee.isAsman) || null;
};

// Helper function to get non-supervisor employees for a department
export const getDepartmentEmployees = (employeesData, department) => {
  if (!employeesData[department]) return [];
  return employeesData[department].filter((employee) => !employee.isAsman);
};

// Helper function to find employee by ID across all departments
export const findEmployeeById = (employeesData, employeeId) => {
  for (const department of Object.values(employeesData)) {
    const found = department.find((employee) => employee.id === employeeId);
    if (found) return found;
  }
  return null;
};

// Helper function to get employee's department
export const getEmployeeDepartment = (employeesData, employeeId) => {
  for (const [department, employees] of Object.entries(employeesData)) {
    if (employees.some((employee) => employee.id === employeeId)) {
      return department;
    }
  }
  return null;
};
