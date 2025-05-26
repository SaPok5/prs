import prisma from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginInputType, CreateUserInputArgs, CreateUserReturnType, CreatedUserData } from "../types/UserTypes.js";

export const createUser = async (args: CreateUserInputArgs, orgId: string): Promise<CreateUserReturnType> => {
  const { email, fullName, password, userId, teamId, roleId } = args.input;

  if (!orgId) return { status: { success: false, message: "Not Authorized" } };

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email, organizationId: orgId },
        { fullName, organizationId: orgId },
      ],
    },
    select: { id: true, email: true, fullName: true },
  });

  if (user) {
    if (user.email.toLowerCase() === email.toLowerCase()) {
      return {
        status: {
          success: false,
          message: "User with this email already exists",
          errors: [
            {
              field: "email",
              message:
                "User already exists with this email in this organization",
            },
          ],
        },
      };
    }
    if (user.fullName.toLowerCase() === fullName.toLowerCase()) {
      return {
        status: {
          success: false,
          message: "User with this name already exists",
          errors: [
            {
              field: "fullName",
              message:
                "User already exists with this name in this organization",
            },
          ],
        },
      };
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const createdUser: CreatedUserData = await prisma.user.create({
      data: {
        email,
        fullName: fullName.trim(),
        password: hashedPassword,
        organizationId: orgId,
        teamId,
        userId,
        role: {
          create: [
            {
              roleId: roleId,
            },
          ],
        },
      },
      select: {
        id: true,
        userId: true,
        fullName: true,
        email: true,
        role: {
          select: {
            roleId: true,
            role: {
              select: {
                roleName: true,
              },
            },
          },
        },
        team: {
          select: {
            teamId: true,
            teamName: true,
          },
        },
      },
    });

    return {
      status: { success: true, message: "User Created Successfully" },
      data: createdUser,
    };
  } catch (error: any) {
    if (error.code === "P2002") {
      const target = error.meta.target;
      if (target.includes("email")) {
        return {
          status: {
            success: false,
            message: "Email already exists",
            errors: [
              {
                field: "email",
                message:
                  "User already exists with this email in this organization",
              },
            ],
          },
        };
      }
      if (target.includes("fullName")) {
        return {
          status: {
            success: false,
            message: "Full name already exists",
            errors: [
              {
                field: "fullName",
                message:
                  "User already exists with this name in this organization",
              },
            ],
          },
        };
      }
    }
  }
};

// user login
export const userLogin = async (args: LoginInputType) => {
  const { email, password } = args.input;
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      userId: true,
      password: true,
      fullName: true,
      role: {
        select: {
          role: {
            select: {
              roleName: true,
            },
          },
        },
      },
      team: {
        select: {
          id: true,
          teamId: true,
          teamName: true,
        },
      },
    },
  });
  if (!user)
    return { status: { success: false, message: "Invalid email or password" } };
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword)
    return { status: { success: false, message: "Invalid email or password" } };

  const roleName = user.role[0].role.roleName || null;
  const token = jwt.sign(
    { userId: user.id, role: roleName },
    process.env.JWT_LOGIN_SECRET,
    { expiresIn: '7d' }
  );
  return {
    status: { success: true, message: "Login Success" },
    token,
    user,
    role: roleName,
  };
};

export const getUserById = async (userId: string, orgId: string) => {
  try {
    const getDetails = await prisma.user.findFirst({
      where: {
        id: userId,
        organizationId: orgId,
      },
      select: {
        id: true,
        userId: true,
        fullName: true,
        email: true,
        createdAt: true,
        role: {
          select: {
            role: {
              select: {
                roleName: true,
              },
            },
          },
        },
        team: {
          select: {
            teamName: true,
          },
        },
      },
    });
    return {
      status: {
        success: true,
        message: "User details",
      },
      data: getDetails,
    };
  } catch (error) {
    console.error(error);
  }
};

// get all user
export const gettAllUsers = async (orgId: string) => {
  if (!orgId)
    return { status: { success: false, message: "Not Authorized" }, data: [] };

  const users = await prisma.user.findMany({
    where: {
      organizationId: orgId,
    },
    select: {
      id: true,
      userId: true,
      fullName: true,
      email: true,
      role: {
        select: {
          roleId: true,
          role: {
            select: {
              roleName: true,
            },
          },
        },
      },
      team: {
        select: {
          teamId: true,
          teamName: true,
        },
      },
    },
  });

  return {
    status: {
      success: true,
      message: "Users Fetched Successfully",
    },
    data: users,
  };
};

//fetch organization latest userId
export const fetchLatestOrganizationUserId = async (orgId) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        organizationId: orgId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        userId: true,
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
};

export const editUser = async (args: any, orgId: string) => {
  const { userId, input } = args;
  const { email, fullName, teamId, roleId, ...otherInputs } = input;

  if (!orgId) {
    return { status: { success: false, message: "Not Authorized" } };
  }

  // Find the user being edited
  const user = await prisma.user.findFirst({
    where: { id: userId, organizationId: orgId },
  });

  if (!user) {
    return { status: { success: false, message: "User Not Found" } };
  }

  // Check for duplicate email or fullName, excluding the current user
  const duplicateUser = await prisma.user.findFirst({
    where: {
      organizationId: orgId,
      OR: [
        { email: email?.toLowerCase(), NOT: { id: userId } },
        { fullName: fullName?.toLowerCase(), NOT: { id: userId } },
      ],
    },
    select: { email: true, fullName: true },
  });

  if (duplicateUser) {
    if (duplicateUser.email?.toLowerCase() === email?.toLowerCase()) {
      return {
        status: {
          success: false,
          message: "User with this email already exists",
          errors: [
            {
              field: "email",
              message:
                "User already exists with this email in this organization",
            },
          ],
        },
      };
    }
    if (duplicateUser.fullName?.toLowerCase() === fullName?.toLowerCase()) {
      return {
        status: {
          success: false,
          message: "User with this name already exists",
          errors: [
            {
              field: "fullName",
              message:
                "User already exists with this name in this organization",
            },
          ],
        },
      };
    }
  }

  // Prepare update data
  const updateData: any = {
    ...otherInputs,
  };

  // Only update email and fullName if they are provided and different
  if (email && email.toLowerCase() !== user.email.toLowerCase()) {
    updateData.email = email;
  }
  if (fullName && fullName.toLowerCase() !== user.fullName.toLowerCase()) {
    updateData.fullName = fullName;
  }

  // Handle team relationship
  if (teamId) {
    updateData.team = {
      connect: { id: teamId },
    };
  }

  // Handle role relationship
  if (roleId) {
    updateData.role = {
      upsert: {
        where: {
          userId_roleId: {
            userId: userId,
            roleId: roleId,
          },
        },
        create: {
          roleId: roleId,
        },
        update: {
          roleId: roleId,
        },
      },
    };
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        userId: true,
        fullName: true,
        email: true,
        team: {
          select: {
            teamId: true,
            teamName: true,
          },
        },
        role: {
          select: {
            roleId: true,
            role: {
              select: {
                roleName: true,
              },
            },
          },
        },
      },
    });

    return {
      status: { success: true, message: "User Updated Successfully" },
      data: updatedUser,
    };
  } catch (error) {
    return {
      status: {
        success: false,
        message: "Failed to update user",
        errors: [
          {
            field: "general",
            message: "An error occurred while updating the user",
          },
        ],
      },
    };
  }
};

export const deleteUser = async (userId: string, orgId: string) => {
  if (!orgId) return { status: { success: false, message: "Not Authorized" } };

  const user = await prisma.user.findFirst({
    where: { id: userId, organizationId: orgId },
  });

  if (!user) return { status: { success: false, message: "User Not Found" } };

  await prisma.user.delete({
    where: { id: userId },
  });

  return { status: { success: true, message: "User Deleted Successfully" } };
};

// export const changePassword = async (args: any, orgId: any) => {
//   try {
//     const { password, confirmPassword, userId } = args.input;

//     // Find the user by userId and organizationId
//     const user = await prisma.user.findFirst({
//       where: {
//         id: userId,
//         organizationId: orgId
//       }
//     });

//     // Check if user was found
//     if (!user) {
//       return {
//         status: {
//           success: false,
//           message: "User not found"
//         }
//       };
//     }

//     // Check if the old password matches
//     // const isValidPrevPw = await bcrypt.compare(oldPassword, user.password);

//     // if (!isValidPrevPw) {
//     //   return {
//     //     status: {
//     //       success: false,
//     //       message: "Old password doesn't match"
//     //     }
//     //   };
//     // }

//     // Check if the new password matches the confirm password
//     if (password !== confirmPassword) {
//       return {
//         status: {
//           success: false,
//           message: "Passwords don't match"
//         }
//       };
//     }

//     // Update the password
//     const changePw = await prisma.user.update({
//       where: {
//         id: userId,
//         organizationId: orgId
//       },
//       data: {
//         password: password
//       }
//     });

//     // Return success message
//     return {
//       status: {
//         success: true,
//         message: "Password updated successfully"
//       },
//       data: changePw
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       status: {
//         success: false,
//         message: "An error occurred while changing the password"
//       }
//     };
//   }
// };

export const changePassword = async (args: any, orgId: any) => {
  try {
    const { oldPassword, password, confirmPassword, userId } = args.input;

    // Find the user by userId and organizationId
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        organizationId: orgId,
      },
    });

    // Check if user was found
    if (!user) {
      return {
        status: {
          success: false,
          message: "User not found",
        },
      };
    }

    // Check if the old password matches
    // const isValidPrevPw = await bcrypt.compare(oldPassword, user.password);

    // if (!isValidPrevPw) {
    //   return {
    //     status: {
    //       success: false,
    //       message: "Old password doesn't match"
    //     }
    //   };
    // }

    // Check if the new password matches the confirm password
    if (password !== confirmPassword) {
      return {
        status: {
          success: false,
          message: "Passwords don't match",
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password
    const changePw = await prisma.user.update({
      where: {
        id: userId,
        organizationId: orgId,
      },
      data: {
        password: hashedPassword,
      },
    });

    // Return success message
    return {
      status: {
        success: true,
        message: "Password updated successfully",
      },
      data: changePw,
    };
  } catch (error) {
    console.error(error);
    return {
      status: {
        success: false,
        message: "An error occurred while changing the password",
      },
    };
  }
};

export const getAllOrganizationUserExceptVerifier = async (orgId: string) => {
  if (!orgId) return { status: { success: false, message: "Not Authorized" } };
  const users = await prisma.user.findMany({
    where: {
      organizationId: orgId,
      role: {
        none: {
          role: {
            roleName: "verifier",
          },
        },
      },
    },
    select: {
      id: true,
      userId: true,
      fullName: true,
      email: true,
      role: {
        select: {
          roleId: true,
          role: {
            select: {
              roleName: true,
            },
          },
        },
      },
      team: {
        select: {
          teamId: true,
          teamName: true,
        },
      },
    },
  });
  return users;
};

export const getUsersWithSalesMetrics = async (orgId: string, date: string) => {
  if (!orgId) {
    return { status: { success: false, message: "Not Authorized" } };
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return { status: { success: false, message: "Invalid date format" } };
  }

  const startOfMonth = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1);
  const endOfMonth = new Date(parsedDate.getFullYear(), parsedDate.getMonth() + 1, 0, 23, 59, 59);

  // 1. Fetch all users for the organization
  const usersInOrg = await prisma.user.findMany({
    where: {
      organizationId: orgId,
    },
    select: {
      id: true,         // Prisma's CUID
      userId: true,     // Custom user ID
      fullName: true,
      email: true,
      role: {
        select: {
          role: {
            select: {
              roleName: true,
            },
          },
        },
      },
      team: {
        select: {
          teamName: true,
        },
      },
    },
  });

  if (usersInOrg.length === 0) {
    return []; // Or appropriate empty response
  }

  // 2. Fetch all deals for the organization within the month, with their verified payments
  const dealsInMonthForOrg = await prisma.deal.findMany({
    where: {
      organizationId: orgId,
      dealDate: {
        gte: startOfMonth,
        lt: endOfMonth,
      },
    },
    select: {
      id: true, // Deal's own ID
      userId: true, // The user (Prisma CUID) this deal belongs to
      Payment: {
        where: {
          paymentStatus: "VERIFIED", // Using string as per previous code and schema enum
        },
        select: {
          receivedAmount: true,
        },
      },
    },
  });

  // 3. Aggregate metrics in JavaScript
  const metricsByUserId = new Map<string, { dealCount: number; totalSales: number }>();

  dealsInMonthForOrg.forEach(deal => {
    // Initialize metrics for the user if not already present
    if (!metricsByUserId.has(deal.userId)) {
      metricsByUserId.set(deal.userId, { dealCount: 0, totalSales: 0 });
    }

    const userMetrics = metricsByUserId.get(deal.userId)!;
    userMetrics.dealCount += 1;

    let dealSales = 0;
    deal.Payment.forEach(payment => {
      dealSales += Number(payment.receivedAmount);
    });
    userMetrics.totalSales += dealSales;
  });

  // 4. Combine user data with their metrics
  const usersWithMetrics = usersInOrg.map(user => {
    const metrics = metricsByUserId.get(user.id) || { dealCount: 0, totalSales: 0 };
    return {
      id: user.id,
      userId: user.userId, // Custom user ID
      fullName: user.fullName,
      email: user.email,
      role: user.role[0]?.role.roleName || null, // Safety check for role
      team: user.team?.teamName || null, // Safety check for team
      dealCount: metrics.dealCount,
      totalSales: metrics.totalSales,
    };
  });

  return usersWithMetrics;
};
