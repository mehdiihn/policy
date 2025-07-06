import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/lib/models/User";
import Policy from "@/lib/models/Policy";
import { requireAuth } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(["admin"])(request);

    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { isActive } = await request.json();
    const userId = params.id;

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "admin") {
      return NextResponse.json(
        { error: "Cannot modify admin users" },
        { status: 403 }
      );
    }

    user.isActive = isActive;
    await user.save();

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: any) {
  try {
    const params = await context.params;
    const userId = params.id;
    const updateData = await request.json();
    const authResult = await requireAuth(["admin"])(request);

    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "admin") {
      return NextResponse.json(
        { error: "Cannot modify admin users" },
        { status: 403 }
      );
    }

    if (updateData.email && updateData.email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({
        email: updateData.email.toLowerCase(),
        _id: { $ne: userId },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        );
      }
    }

    const allowedFields = [
      "fullName",
      "email",
      "role",
      "isActive",
      "address",
      "dateOfBirth",
      "vehicleRegistration",
      "lastFourDigits",
      "phoneNumber",
      "credits",
    ];

    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        if (field === "email") {
          user[field] = updateData[field].toLowerCase();
        } else if (field === "dateOfBirth" && updateData[field]) {
          user[field] = new Date(updateData[field]);
        } else if (field === "credits" && user.role === "sub-admin" && typeof updateData[field] === 'number') {
          user[field] = updateData[field];
        } else if (field !== "credits") {
          user[field] = updateData[field];
        }
      }
    });

    await user.save();

    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
      vehicleRegistration: user.vehicleRegistration,
      lastFourDigits: user.lastFourDigits,
      phoneNumber: user.phoneNumber,
    };

    return NextResponse.json({
      message: "User updated successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(["admin"])(request);

    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = params.id;

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "admin") {
      return NextResponse.json(
        { error: "Cannot delete admin users" },
        { status: 403 }
      );
    }

    const activePolicies = await Policy.find({
      userId: userId,
      status: "active",
    });

    if (activePolicies.length > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete user with ${activePolicies.length} active policy(ies). Please expire or cancel policies first.`,
          activePolicies: activePolicies.length,
        },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(userId);
    await Policy.deleteMany({ userId: userId });

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, context: any) {
  try {
    const params = await context.params;
    const userId = params.id;
    const authResult = await requireAuth(["admin"])(request);
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }
    await connectToDatabase();
    const user = await User.findById(userId)
      .select("-password")
      .populate("createdBy", "fullName email");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userObj = user.toObject();
    userObj.credits = typeof user.credits === 'number' ? user.credits : 0;
    return NextResponse.json({ user: userObj });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}