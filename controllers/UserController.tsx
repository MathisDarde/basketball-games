import { db } from "@/db";
import { SelectUser, user } from "@/db/schema";
import { RegisterSchemaType } from "@/types/forms";
import { eq } from "drizzle-orm";
import { auth } from "@/utils/auth";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export async function getUserById(id: SelectUser["id"]) {
  try {
    const result = await db.select().from(user).where(eq(user.id, id)).limit(1);

    return result[0] || null;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la récupération de l'utilisateur");
  }
}

export async function signUp(data: RegisterSchemaType, file?: File) {
  let imageUrl = "";

  try {
    if (file) {
      // Vérification type/size, upload fichier...
      const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo corrigé (2048*2048 c’est trop grand)
      const ALLOWED_TYPES = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];

      if (file.size > MAX_SIZE) {
        throw new Error(
          "Le fichier est trop grand. La taille maximale est de 5 Mo."
        );
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error(
          "Type de fichier non autorisé. Veuillez télécharger une image JPEG, PNG, JPG ou WEBP."
        );
      }

      const uploadDir = path.join(process.cwd(), "/public/uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileExtension = path.extname(file.name);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);

      const buffer = await file.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(buffer));

      imageUrl = `/uploads/${fileName}`;
    }

    // Ensuite, créer l'utilisateur avec ou sans image
    const { name, favorite_team, email, password } = data;

    const result = await auth.api.signUpEmail({
      body: {
        name,
        profilepicture: imageUrl || null,
        favorite_team,
        email,
        password,
      },
    });

    return result;
  } catch (err) {
    console.log(err);
    throw new Error(
      "Erreur lors de l'upload du fichier ou de la création de l'article"
    );
  }
}

export async function updateUser(
  id: SelectUser["id"],
  data: Partial<Omit<SelectUser, "id">>,
  file?: File
) {
  try {
    let imageUrl: string | undefined;

    if (file) {
      const MAX_SIZE = 5 * 1024 * 1024;
      const ALLOWED_TYPES = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];

      if (file.size > MAX_SIZE) throw new Error("Le fichier est trop grand.");
      if (!ALLOWED_TYPES.includes(file.type))
        throw new Error("Type non autorisé.");

      const uploadDir = path.join(process.cwd(), "/public/uploads");
      if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });

      const fileExtension = path.extname(file.name);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);

      const buffer = await file.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(buffer));

      imageUrl = `/uploads/${fileName}`;
    }

    const updatedData: Partial<Omit<SelectUser, "id">> = {
      ...data,
      ...(imageUrl ? { profilepicture: imageUrl } : {}),
    };

    const result = await db
      .update(user)
      .set(updatedData)
      .where(eq(user.id, id));
    return result;
  } catch (err) {
    console.log(err);
    throw new Error("Erreur lors de l'update de l'utilisateur");
  }
}

export async function deleteUser(id: SelectUser["id"]) {
  await db.delete(user).where(eq(user.id, id));
}

export async function getUserPicName(id: SelectUser["id"]) {
  const users = await db
    .select({
      pdp: user.profilepicture,
      username: user.name,
    })
    .from(user)
    .where(eq(user.id, id))
    .limit(1);

  return users[0] || null;
}

export async function deleteUserPic(id: SelectUser["id"]) {
  const userPic = await getUserPicName(id);
  if (userPic && userPic.pdp) {
    const filePath = path.join(process.cwd(), "public", userPic.pdp);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      return;
    }

    await db.update(user).set({ profilepicture: null }).where(eq(user.id, id));
    return true;
  } else {
    return false;
  }
}
