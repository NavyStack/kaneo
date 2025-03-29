import bcrypt from "bcrypt";
import db from "../../../database";
import { userTable } from "../../../database/schema";

async function signUp(email: string, password: string, name: string) {
  // TODO:
  //   const { allowRegistration, isDemoMode } = getSettings();

  //   if (!allowRegistration && !isDemoMode) {
  //     throw new Error("Registration is disabled on this instance");
  //   }

  const isEmailTaken = Boolean(
    await db.query.userTable.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    }),
  );

  if (isEmailTaken) {
    throw new Error("Email taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = (
    await db
      .insert(userTable)
      .values({ email, name, password: hashedPassword })
      .returning()
  ).at(0);

  if (!user) {
    throw new Error("Failed to create an account");
  }

  // TODO:
  //   publishEvent("user.signed_up", {
  //     email: user.email,
  //   });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

export default signUp;
